import { describe, it, expect } from 'vitest';
import {
  PROVIDER_PRESETS,
  getPreset,
  getPresetIcon,
  PROVIDER_TYPES,
  CAPABILITY_OPTIONS,
  DOMAIN_OPTIONS,
} from '../../src/utils/providerPresets';

describe('PROVIDER_PRESETS', () => {
  it('has all 6 provider types', () => {
    const types = PROVIDER_PRESETS.map(p => p.provider_type);
    expect(types).toEqual(['openai', 'anthropic', 'vllm', 'mistral', 'google', 'custom']);
  });

  it('every preset has required fields', () => {
    PROVIDER_PRESETS.forEach(preset => {
      expect(preset).toHaveProperty('provider_type');
      expect(preset).toHaveProperty('name');
      expect(typeof preset.name).toBe('string');
      expect(preset).toHaveProperty('base_url');
      expect(preset).toHaveProperty('api_format');
      expect(['openai', 'anthropic']).toContain(preset.api_format);
      expect(preset).toHaveProperty('icon');
      expect(preset).toHaveProperty('description');
      expect(preset).toHaveProperty('defaultModels');
      expect(Array.isArray(preset.defaultModels)).toBe(true);
    });
  });

  it('openai preset has correct base_url', () => {
    const openai = PROVIDER_PRESETS.find(p => p.provider_type === 'openai');
    expect(openai.base_url).toBe('https://api.openai.com/v1');
  });

  it('anthropic preset uses anthropic api_format', () => {
    const anthropic = PROVIDER_PRESETS.find(p => p.provider_type === 'anthropic');
    expect(anthropic.api_format).toBe('anthropic');
  });

  it('vllm preset points to localhost', () => {
    const vllm = PROVIDER_PRESETS.find(p => p.provider_type === 'vllm');
    expect(vllm.base_url).toContain('127.0.0.1');
  });

  it('custom preset has empty base_url and no default models', () => {
    const custom = PROVIDER_PRESETS.find(p => p.provider_type === 'custom');
    expect(custom.base_url).toBe('');
    expect(custom.defaultModels).toHaveLength(0);
  });

  it('default models have pricing and capabilities', () => {
    PROVIDER_PRESETS.forEach(preset => {
      preset.defaultModels.forEach(model => {
        expect(model).toHaveProperty('name');
        expect(model).toHaveProperty('provider_model_id');
        expect(typeof model.pricing_prompt_per_1m).toBe('number');
        expect(typeof model.pricing_completion_per_1m).toBe('number');
        expect(Array.isArray(model.capabilities)).toBe(true);
        expect(model.capabilities.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('getPreset', () => {
  it('returns matching preset by type', () => {
    const preset = getPreset('openai');
    expect(preset.name).toBe('OpenAI');
  });

  it('falls back to custom for unknown type', () => {
    const preset = getPreset('unknown-provider');
    expect(preset.provider_type).toBe('custom');
  });
});

describe('getPresetIcon', () => {
  it('returns icon for known provider', () => {
    expect(getPresetIcon('openai')).toBe('🟢');
    expect(getPresetIcon('anthropic')).toBe('🟤');
  });

  it('returns gear icon for unknown provider', () => {
    expect(getPresetIcon('unknown')).toBe('⚙️');
  });
});

describe('PROVIDER_TYPES', () => {
  it('has value/label pairs for all presets', () => {
    expect(PROVIDER_TYPES).toHaveLength(PROVIDER_PRESETS.length);
    PROVIDER_TYPES.forEach(t => {
      expect(t).toHaveProperty('value');
      expect(t).toHaveProperty('label');
    });
  });
});

describe('CAPABILITY_OPTIONS', () => {
  it('includes core capabilities', () => {
    const values = CAPABILITY_OPTIONS.map(c => c.value);
    expect(values).toContain('chat');
    expect(values).toContain('reasoning');
    expect(values).toContain('tools');
    expect(values).toContain('vision');
  });
});

describe('DOMAIN_OPTIONS', () => {
  it('includes key routing domains', () => {
    const values = DOMAIN_OPTIONS.map(d => d.value);
    expect(values).toContain('math');
    expect(values).toContain('code');
    expect(values).toContain('business');
    expect(values).toContain('general');
  });
});
