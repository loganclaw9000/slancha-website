import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// vi.mock is hoisted — factories must not reference outer variables.
// Use vi.hoisted to declare mocks that the factory can see.
const { mockUser, mockChain, mockRpc, mockFrom, mockMutateChain } = vi.hoisted(() => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  // Separate chain for mutations (update/delete) that end with .eq().eq()
  const mockMutateChain = {
    eq: vi.fn(),
  };
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn(() => mockMutateChain),
    delete: vi.fn(() => mockMutateChain),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn(),
    single: vi.fn(),
  };
  // Double eq chain: first .eq() returns object with second .eq()
  mockMutateChain.eq = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
  const mockRpc = vi.fn();
  const mockFrom = vi.fn(() => mockChain);
  return { mockUser, mockChain, mockRpc, mockFrom, mockMutateChain };
});

vi.mock('../../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}));

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    rpc: mockRpc,
  },
}));

// Force Supabase "configured" state
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');

import { useProviders } from '../../src/hooks/useProviders';

describe('useProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset chain methods
    mockChain.select.mockReturnThis();
    mockChain.insert.mockReturnThis();
    mockChain.update.mockReturnThis();
    mockChain.delete.mockReturnThis();
    mockChain.eq.mockReturnThis();
    mockFrom.mockReturnValue(mockChain);
    // Default: fetch returns empty list
    mockChain.order.mockResolvedValue({ data: [], error: null });
  });

  it('fetches providers on mount', async () => {
    const { result } = renderHook(() => useProviders());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.providers).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isConnected).toBe(true);
  });

  it('returns fetched providers', async () => {
    const mockProviders = [
      { id: 'p1', name: 'OpenAI', provider_type: 'openai', enabled: true, api_key_last4: 'ab12' },
    ];
    mockChain.order.mockResolvedValue({ data: mockProviders, error: null });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.providers).toEqual(mockProviders);
  });

  it('sets error on fetch failure', async () => {
    mockChain.order.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('DB error');
    expect(result.current.providers).toEqual([]);
  });

  it('createProvider inserts row and stores API key in vault', async () => {
    const newProvider = { id: 'p-new', name: 'Test', provider_type: 'openai', enabled: true, api_key_last4: null };
    mockChain.single.mockResolvedValue({ data: newProvider, error: null });
    mockRpc.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response;
    await act(async () => {
      response = await result.current.createProvider({
        name: 'Test',
        provider_type: 'openai',
        base_url: 'https://api.openai.com/v1',
        api_key: 'sk-test1234567890abcdef',
      });
    });

    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();
    // Verify vault RPC was called with the key
    expect(mockRpc).toHaveBeenCalledWith('store_provider_api_key', {
      p_provider_id: 'p-new',
      p_api_key: 'sk-test1234567890abcdef',
    });
    // Provider should be in the list now
    expect(result.current.providers).toHaveLength(1);
  });

  it('createProvider without api_key skips vault RPC', async () => {
    const newProvider = { id: 'p-new', name: 'vLLM', provider_type: 'vllm', enabled: true };
    mockChain.single.mockResolvedValue({ data: newProvider, error: null });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createProvider({
        name: 'vLLM',
        provider_type: 'vllm',
        base_url: 'http://127.0.0.1:8000/v1',
      });
    });

    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('deleteProvider removes from list', async () => {
    const existing = [{ id: 'p1', name: 'OpenAI', provider_type: 'openai', enabled: true }];
    mockChain.order.mockResolvedValue({ data: existing, error: null });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.providers).toHaveLength(1));

    await act(async () => {
      await result.current.deleteProvider('p1');
    });

    expect(result.current.providers).toHaveLength(0);
  });

  it('toggleEnabled flips the enabled state', async () => {
    const existing = [{ id: 'p1', name: 'OpenAI', provider_type: 'openai', enabled: true }];
    mockChain.order.mockResolvedValue({ data: existing, error: null });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.providers).toHaveLength(1));

    await act(async () => {
      await result.current.toggleEnabled('p1');
    });

    expect(result.current.providers[0].enabled).toBe(false);
  });

  it('returns not authenticated error when no user', async () => {
    const { useAuth } = await import('../../src/contexts/AuthContext');
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useProviders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response;
    await act(async () => {
      response = await result.current.createProvider({ name: 'Test', provider_type: 'openai' });
    });

    expect(response.error).toBe('Not authenticated');

    // Restore for other tests
    useAuth.mockReturnValue({ user: mockUser });
  });
});
