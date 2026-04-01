/**
 * Static presets for LLM providers used by the Semantic Router.
 * Each preset auto-fills base_url, api_format, and default models
 * when a user selects a provider type in ProviderForm.
 */

export const PROVIDER_PRESETS = [
  {
    provider_type: 'openai',
    name: 'OpenAI',
    base_url: 'https://api.openai.com/v1',
    api_format: 'openai',
    icon: '🟢',
    description: 'GPT-4o, GPT-4o-mini, o1, o3 and more',
    defaultModels: [
      { name: 'gpt-4o', provider_model_id: 'gpt-4o', pricing_prompt_per_1m: 2.50, pricing_completion_per_1m: 10.00, capabilities: ['chat', 'tools', 'vision'] },
      { name: 'gpt-4o-mini', provider_model_id: 'gpt-4o-mini', pricing_prompt_per_1m: 0.15, pricing_completion_per_1m: 0.60, capabilities: ['chat', 'tools', 'vision'] },
      { name: 'o3-mini', provider_model_id: 'o3-mini', pricing_prompt_per_1m: 1.10, pricing_completion_per_1m: 4.40, capabilities: ['chat', 'reasoning'] },
    ],
  },
  {
    provider_type: 'anthropic',
    name: 'Anthropic',
    base_url: 'https://api.anthropic.com',
    api_format: 'anthropic',
    icon: '🟤',
    description: 'Claude Opus, Sonnet, Haiku',
    defaultModels: [
      { name: 'claude-sonnet-4', provider_model_id: 'claude-sonnet-4-20250514', pricing_prompt_per_1m: 3.00, pricing_completion_per_1m: 15.00, capabilities: ['chat', 'reasoning', 'tools', 'vision'] },
      { name: 'claude-haiku-3.5', provider_model_id: 'claude-3-5-haiku-20241022', pricing_prompt_per_1m: 0.80, pricing_completion_per_1m: 4.00, capabilities: ['chat', 'tools', 'vision'] },
    ],
  },
  {
    provider_type: 'vllm',
    name: 'vLLM Local',
    base_url: 'http://127.0.0.1:8000/v1',
    api_format: 'openai',
    icon: '🖥️',
    description: 'Self-hosted vLLM instance',
    defaultModels: [
      { name: 'local-model', provider_model_id: 'default', pricing_prompt_per_1m: 0, pricing_completion_per_1m: 0, capabilities: ['chat'] },
    ],
  },
  {
    provider_type: 'mistral',
    name: 'Mistral',
    base_url: 'https://api.mistral.ai/v1',
    api_format: 'openai',
    icon: '🔵',
    description: 'Mistral Large, Medium, Small, Codestral',
    defaultModels: [
      { name: 'mistral-large', provider_model_id: 'mistral-large-latest', pricing_prompt_per_1m: 2.00, pricing_completion_per_1m: 6.00, capabilities: ['chat', 'tools'] },
      { name: 'codestral', provider_model_id: 'codestral-latest', pricing_prompt_per_1m: 0.30, pricing_completion_per_1m: 0.90, capabilities: ['chat', 'tools'] },
    ],
  },
  {
    provider_type: 'google',
    name: 'Google',
    base_url: 'https://generativelanguage.googleapis.com/v1beta',
    api_format: 'openai',
    icon: '🔴',
    description: 'Gemini 2.5 Pro, Flash',
    defaultModels: [
      { name: 'gemini-2.5-pro', provider_model_id: 'gemini-2.5-pro', pricing_prompt_per_1m: 1.25, pricing_completion_per_1m: 10.00, capabilities: ['chat', 'reasoning', 'tools', 'vision'] },
      { name: 'gemini-2.5-flash', provider_model_id: 'gemini-2.5-flash', pricing_prompt_per_1m: 0.15, pricing_completion_per_1m: 0.60, capabilities: ['chat', 'tools', 'vision'] },
    ],
  },
  {
    provider_type: 'custom',
    name: 'Custom',
    base_url: '',
    api_format: 'openai',
    icon: '⚙️',
    description: 'Any OpenAI-compatible endpoint',
    defaultModels: [],
  },
];

export function getPreset(providerType) {
  return PROVIDER_PRESETS.find(p => p.provider_type === providerType) || PROVIDER_PRESETS[PROVIDER_PRESETS.length - 1];
}

export function getPresetIcon(providerType) {
  const preset = PROVIDER_PRESETS.find(p => p.provider_type === providerType);
  return preset ? preset.icon : '⚙️';
}

export const PROVIDER_TYPES = PROVIDER_PRESETS.map(p => ({ value: p.provider_type, label: p.name }));

export const CAPABILITY_OPTIONS = [
  { value: 'chat', label: 'Chat' },
  { value: 'reasoning', label: 'Reasoning' },
  { value: 'tools', label: 'Tool Use' },
  { value: 'vision', label: 'Vision' },
  { value: 'image', label: 'Image Gen' },
];

export const DOMAIN_OPTIONS = [
  { value: 'math', label: 'Mathematics' },
  { value: 'code', label: 'Code & Programming' },
  { value: 'business', label: 'Business & Finance' },
  { value: 'law', label: 'Law & Legal' },
  { value: 'creative', label: 'Creative Writing' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'science', label: 'Science & Research' },
  { value: 'general', label: 'General' },
];
