// Auth hook tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';

// Mock Supabase
vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

describe('useAuth Hook', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it('should have all auth methods available', () => {
    expect(typeof result.current.signUp).toBe('function');
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
    expect(typeof result.current.resetPassword).toBe('function');
    expect(typeof result.current.updatePassword).toBe('function');
  });
});

describe('AuthProvider', () => {
  it('should update user on auth state change', async () => {
    const mockSession = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'test-token',
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: { unsubscribe: vi.fn() },
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    // Wait for async state update
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(result.current.user).toEqual(mockSession.user);
  });

  it('should handle sign in', async () => {
    const mockData = {
      session: { user: { id: '123' } },
    };

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      const { data, error } = await result.current.signIn(
        'test@example.com',
        'password123'
      );
      
      expect(data).toEqual(mockData);
      expect(error).toBeNull();
    });
  });

  it('should handle sign out', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      const { error } = await result.current.signOut();
      
      expect(error).toBeNull();
    });
  });
});
