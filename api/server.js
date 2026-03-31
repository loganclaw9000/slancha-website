/**
 * Slancha API Server v0.1.0
 *
 * Lightweight proxy that sits in front of vLLM and adds:
 * - API key authentication (via Supabase api_keys table)
 * - OpenAI-compatible /v1/chat/completions endpoint
 * - Usage logging to Supabase usage_logs table
 * - Rate limiting per API key
 * - CORS for browser-based requests
 *
 * The "black box" starts here — callers send a prompt, we route it.
 */

import http from 'node:http';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { products, getPriceId, getTierByPriceId, getPlanCode } from './stripe-products.js';

// --- Configuration ---
const PORT = parseInt(process.env.SLANCHA_PORT || '3100', 10);
const VLLM_URL = process.env.VLLM_URL || 'http://127.0.0.1:8000';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const RATE_LIMIT_RPM = parseInt(process.env.RATE_LIMIT_RPM || '60', 10);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';

// --- Supabase client (service role for server-side ops) ---
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

// --- Stripe client ---
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

// --- In-memory rate limiter (per API key, sliding window) ---
const rateLimits = new Map(); // keyHash -> { timestamps: number[] }

function checkRateLimit(keyHash) {
  const now = Date.now();
  const windowMs = 60_000;
  let bucket = rateLimits.get(keyHash);
  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimits.set(keyHash, bucket);
  }
  // Remove expired entries
  bucket.timestamps = bucket.timestamps.filter(t => now - t < windowMs);
  if (bucket.timestamps.length >= RATE_LIMIT_RPM) {
    return false;
  }
  bucket.timestamps.push(now);
  return true;
}

// Clean up stale rate limit buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimits) {
    bucket.timestamps = bucket.timestamps.filter(t => now - t < 60_000);
    if (bucket.timestamps.length === 0) rateLimits.delete(key);
  }
}, 300_000);

// --- API Key validation ---
async function hashKey(rawKey) {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

// Cache validated keys for 5 minutes to reduce DB round-trips
const keyCache = new Map(); // hash -> { userId, keyId, validUntil }
const KEY_CACHE_TTL = 300_000;

async function validateApiKey(rawKey) {
  if (!rawKey || !rawKey.startsWith('sk-')) return null;

  const keyHash = await hashKey(rawKey);

  // Check cache
  const cached = keyCache.get(keyHash);
  if (cached && cached.validUntil > Date.now()) {
    return cached;
  }

  // Demo mode — accept sk-demo-* keys without Supabase
  if (rawKey.startsWith('sk-demo-')) {
    const entry = { userId: 'demo', keyId: 'demo', keyHash, validUntil: Date.now() + KEY_CACHE_TTL };
    keyCache.set(keyHash, entry);
    return entry;
  }

  if (!supabase) return null;

  const prefix = rawKey.slice(0, 8);
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, user_id, is_active')
    .eq('key_prefix', prefix)
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  // Update last_used_at
  supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id).then(() => {});

  const entry = { userId: data.user_id, keyId: data.id, keyHash, validUntil: Date.now() + KEY_CACHE_TTL };
  keyCache.set(keyHash, entry);
  return entry;
}

// --- Usage logging ---
async function logUsage({ userId, keyId, model, endpoint, tokensIn, tokensOut, latencyMs, statusCode, costCents }) {
  if (!supabase) {
    // Log to console in dev mode
    console.log(`[usage] user=${userId} model=${model} tokens=${tokensIn}+${tokensOut} latency=${latencyMs}ms cost=${costCents}¢`);
    return;
  }

  await supabase.from('usage_logs').insert({
    user_id: userId,
    api_key_id: keyId === 'demo' ? null : keyId,
    model,
    endpoint,
    tokens_in: tokensIn,
    tokens_out: tokensOut,
    latency_ms: latencyMs,
    status_code: statusCode,
    cost_cents: costCents,
  });
}

// --- Cost estimation (cents per 1K tokens) ---
const COST_PER_1K = {
  input: 0.15,   // $0.0015 per 1K input tokens
  output: 0.60,  // $0.006 per 1K output tokens
};

function estimateCost(tokensIn, tokensOut) {
  return Math.round((tokensIn / 1000 * COST_PER_1K.input + tokensOut / 1000 * COST_PER_1K.output) * 100) / 100;
}

// --- Helpers ---
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(body);
}

function sendError(res, status, message, type = 'invalid_request_error') {
  sendJSON(res, status, {
    error: { message, type, param: null, code: null }
  });
}

// --- Route: POST /v1/chat/completions ---
async function handleChatCompletions(req, res, auth) {
  const startTime = Date.now();
  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    return sendError(res, 400, 'Invalid JSON body');
  }

  // The "black box" — caller doesn't pick the model, we do.
  // For v0.1, route everything to the local vLLM model.
  // Future: semantic router picks the best model per task.
  const routedModel = 'Qwen3.5-35B';

  const vllmPayload = {
    model: routedModel,
    messages: body.messages,
    temperature: body.temperature ?? 0.7,
    max_tokens: body.max_tokens ?? 2048,
    top_p: body.top_p ?? 1,
    stream: body.stream ?? false,
  };

  // Streaming support
  if (vllmPayload.stream) {
    return handleStreamingCompletion(res, auth, vllmPayload, startTime);
  }

  try {
    const vllmRes = await fetch(`${VLLM_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vllmPayload),
    });

    const vllmData = await vllmRes.json();
    const latencyMs = Date.now() - startTime;

    // Extract usage from vLLM response
    const tokensIn = vllmData.usage?.prompt_tokens || 0;
    const tokensOut = vllmData.usage?.completion_tokens || 0;
    const costCents = estimateCost(tokensIn, tokensOut);

    // Rewrite the response to use "slancha" branding
    const response = {
      ...vllmData,
      model: 'slancha-auto',  // Black box — don't expose internal model
      system_fingerprint: `slancha-v0.1`,
      usage: {
        ...vllmData.usage,
        cost_cents: costCents,
        routed_model: routedModel,
      },
    };

    // Log usage asynchronously
    logUsage({
      userId: auth.userId,
      keyId: auth.keyId,
      model: routedModel,
      endpoint: '/v1/chat/completions',
      tokensIn,
      tokensOut,
      latencyMs,
      statusCode: 200,
      costCents,
    });

    sendJSON(res, 200, response);
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logUsage({
      userId: auth.userId,
      keyId: auth.keyId,
      model: routedModel,
      endpoint: '/v1/chat/completions',
      tokensIn: 0,
      tokensOut: 0,
      latencyMs,
      statusCode: 502,
      costCents: 0,
    });
    sendError(res, 502, 'Upstream model unavailable');
  }
}

// --- Streaming handler ---
async function handleStreamingCompletion(res, auth, payload, startTime) {
  try {
    const vllmRes = await fetch(`${VLLM_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    });

    let totalTokensIn = 0;
    let totalTokensOut = 0;
    const reader = vllmRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      // Rewrite model name in stream chunks
      const rewritten = chunk.replace(/"model"\s*:\s*"[^"]*"/g, '"model":"slancha-auto"');
      res.write(rewritten);

      // Try to extract token counts from usage chunks
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.usage) {
              totalTokensIn = data.usage.prompt_tokens || totalTokensIn;
              totalTokensOut = data.usage.completion_tokens || totalTokensOut;
            }
          } catch {}
        }
      }
    }

    res.end();

    const latencyMs = Date.now() - startTime;
    const costCents = estimateCost(totalTokensIn, totalTokensOut);
    logUsage({
      userId: auth.userId,
      keyId: auth.keyId,
      model: payload.model,
      endpoint: '/v1/chat/completions',
      tokensIn: totalTokensIn,
      tokensOut: totalTokensOut,
      latencyMs,
      statusCode: 200,
      costCents,
    });
  } catch (err) {
    if (!res.headersSent) {
      sendError(res, 502, 'Upstream model unavailable');
    }
  }
}

// --- Route: GET /v1/models ---
function handleModels(req, res) {
  sendJSON(res, 200, {
    object: 'list',
    data: [
      {
        id: 'slancha-auto',
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'slancha',
        description: 'Automatically routed to the optimal model for your task',
      },
    ],
  });
}

// --- Route: GET /health ---
function handleHealth(req, res) {
  sendJSON(res, 200, {
    status: 'ok',
    version: '0.1.0',
    uptime: process.uptime(),
    vllm: VLLM_URL,
  });
}

// --- Route: POST /stripe/create-checkout-session ---
async function handleCreateCheckoutSession(req, res) {
  if (!stripe) {
    return sendError(res, 503, 'Stripe not configured');
  }

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    return sendError(res, 400, 'Invalid JSON body');
  }

  const { tierId, interval = 'monthly', userId, email } = body;
  if (!tierId) {
    return sendError(res, 400, 'Missing tierId');
  }

  const product = products[tierId];
  if (!product) {
    return sendError(res, 400, `Unknown tier: ${tierId}`);
  }

  // Custom pricing tiers — redirect to contact
  if (!product.prices) {
    return sendJSON(res, 200, { redirect: `${FRONTEND_URL}/contact?plan=${tierId}` });
  }

  const priceId = getPriceId(tierId, interval);
  if (!priceId) {
    return sendError(res, 400, `No Stripe price configured for ${tierId}/${interval}. Set ${product.prices[interval].envVar} env var.`);
  }

  try {
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout/cancel`,
      metadata: { tier: tierId, plan_code: getPlanCode(tierId) },
      subscription_data: {
        metadata: { tier: tierId, plan_code: getPlanCode(tierId) },
      },
    };

    // Attach to existing Stripe customer if we have the user's email
    if (email) {
      sessionParams.customer_email = email;
    }
    if (userId) {
      sessionParams.client_reference_id = userId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    sendJSON(res, 200, { sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('[stripe] Checkout session error:', err.message);
    sendError(res, 500, 'Failed to create checkout session');
  }
}

// --- Route: POST /stripe/webhooks ---
async function handleStripeWebhook(req, res) {
  if (!stripe) {
    return sendError(res, 503, 'Stripe not configured');
  }

  const rawBody = await readBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } else {
      // Dev mode: parse without signature verification
      event = JSON.parse(rawBody);
      console.warn('[stripe] Webhook signature verification skipped (no secret configured)');
    }
  } catch (err) {
    console.error('[stripe] Webhook signature verification failed:', err.message);
    return sendError(res, 400, 'Webhook signature verification failed');
  }

  console.log(`[stripe] Webhook event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      console.log(`[stripe] Unhandled event type: ${event.type}`);
  }

  sendJSON(res, 200, { received: true });
}

// --- Webhook handlers ---

async function handleCheckoutCompleted(session) {
  if (!supabase) {
    console.log('[stripe] Checkout completed (no Supabase — skipping DB sync):', session.id);
    return;
  }

  const userId = session.client_reference_id;
  const subscriptionId = session.subscription;
  const customerId = session.customer;
  const tier = session.metadata?.tier;
  const planCode = session.metadata?.plan_code || 'starter';

  if (!userId || !subscriptionId) {
    console.warn('[stripe] Checkout session missing userId or subscriptionId');
    return;
  }

  // Fetch subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price?.id;
  const tierInfo = getTierByPriceId(priceId);

  const { error } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    plan: planCode,
    status: 'active',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: false,
    price_id: priceId,
    interval: tierInfo?.interval || 'monthly',
  }, { onConflict: 'user_id' });

  if (error) {
    console.error('[stripe] Failed to upsert subscription:', error.message);
  } else {
    console.log(`[stripe] Subscription activated for user ${userId}: ${planCode}`);
  }
}

async function handleSubscriptionUpdated(subscription) {
  if (!supabase) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('[stripe] Failed to update subscription:', error.message);
  } else {
    console.log(`[stripe] Subscription ${subscription.id} updated: ${subscription.status}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  if (!supabase) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: false,
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('[stripe] Failed to cancel subscription:', error.message);
  } else {
    console.log(`[stripe] Subscription ${subscription.id} canceled`);
  }
}

async function handlePaymentFailed(invoice) {
  if (!supabase) return;

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('[stripe] Failed to mark subscription past_due:', error.message);
  } else {
    console.log(`[stripe] Subscription ${subscriptionId} marked past_due (payment failed)`);
  }
}

// --- Main request handler ---
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    });
    return res.end();
  }

  // Health check (no auth required)
  if (url === '/health' && method === 'GET') {
    return handleHealth(req, res);
  }

  // Models list (no auth required)
  if (url === '/v1/models' && method === 'GET') {
    return handleModels(req, res);
  }

  // Stripe checkout session (no API key auth — uses Supabase user context)
  if (url === '/stripe/create-checkout-session' && method === 'POST') {
    return handleCreateCheckoutSession(req, res);
  }

  // Stripe webhooks (verified by Stripe signature, not API key)
  if (url === '/stripe/webhooks' && method === 'POST') {
    return handleStripeWebhook(req, res);
  }

  // --- Authenticated endpoints below ---
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Missing API key. Include Authorization: Bearer sk-...');
  }

  const apiKey = authHeader.slice(7);
  const auth = await validateApiKey(apiKey);
  if (!auth) {
    return sendError(res, 401, 'Invalid API key');
  }

  // Rate limiting
  if (!checkRateLimit(auth.keyHash)) {
    return sendError(res, 429, `Rate limit exceeded (${RATE_LIMIT_RPM} requests/minute)`);
  }

  // Chat completions
  if (url === '/v1/chat/completions' && method === 'POST') {
    return handleChatCompletions(req, res, auth);
  }

  // 404 for everything else
  sendError(res, 404, `Unknown endpoint: ${method} ${url}`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
┌─────────────────────────────────────────────┐
│  Slancha API Server v0.2.0                  │
├─────────────────────────────────────────────┤
│  Port:     ${String(PORT).padEnd(33)}│
│  vLLM:     ${VLLM_URL.padEnd(33)}│
│  Supabase: ${(supabase ? 'connected' : 'demo mode').padEnd(33)}│
│  Stripe:   ${(stripe ? 'connected' : 'not configured').padEnd(33)}│
│  Rate:     ${(RATE_LIMIT_RPM + ' req/min').padEnd(33)}│
└─────────────────────────────────────────────┘
  `);
});
