// Supabase Edge Function: Handle Stripe Webhooks
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Set secrets: supabase secrets set STRIPE_SECRET_KEY=sk_xxx STRIPE_WEBHOOK_SECRET=whsec_xxx
//
// Stripe Dashboard → Developers → Webhooks → Add endpoint:
//   URL: https://<project>.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, customer.subscription.updated,
//           customer.subscription.deleted, invoice.payment_failed

import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' });
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Map Stripe price IDs to Slancha plan names.
// Update these after creating products in Stripe Dashboard.
const PRICE_TO_PLAN: Record<string, string> = {
  // Set via env or hardcode after Stripe setup:
  // 'price_xxx_eval_deploy': 'eval-deploy',
  // 'price_xxx_full_loop': 'full-loop',
};

async function getPlanFromPriceId(priceId: string): Promise<string> {
  // Check hardcoded map first
  if (PRICE_TO_PLAN[priceId]) return PRICE_TO_PLAN[priceId];

  // Fallback: look up price in Stripe and match by amount
  try {
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount;
    if (amount === 29900) return 'eval-deploy';
    if (amount === 99900) return 'full-loop';
  } catch {
    // ignore
  }

  return 'eval-deploy'; // safe default
}

async function upsertSubscription(
  userId: string,
  stripeCustomerId: string,
  subscription: Stripe.Subscription,
) {
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = priceId ? await getPlanFromPriceId(priceId) : 'eval-deploy';

  const statusMap: Record<string, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due',
  };

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan,
      status: statusMap[subscription.status] || subscription.status,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Failed to upsert subscription:', error);
    throw error;
  }
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  // Check if we already have this customer mapped
  const { data } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  return data?.user_id ?? null;
}

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`Processing event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;

      if (!userId) {
        console.warn('No supabase_user_id in checkout session metadata');
        break;
      }

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertSubscription(userId, session.customer as string, subscription);
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const userId = await getUserIdFromCustomer(customerId);

      if (!userId) {
        console.warn(`No user found for Stripe customer ${customerId}`);
        break;
      }

      if (event.type === 'customer.subscription.deleted') {
        // Downgrade to free
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            stripe_subscription_id: null,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
        if (error) console.error('Failed to downgrade:', error);
      } else {
        await upsertSubscription(userId, customerId, subscription);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const userId = await getUserIdFromCustomer(customerId);

      if (userId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('user_id', userId);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
