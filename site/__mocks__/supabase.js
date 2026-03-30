// Mock Supabase client
export const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    updateUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
  }),
  channel: vi.fn().mockReturnValue({
    on: vi.fn(),
    subscribe: vi.fn(),
  }),
  removeChannel: vi.fn(),
};

export const supabase = mockSupabase;

// Helper to create mock responses
export const createMockResponse = (data, error = null) => ({
  data,
  error,
});

// Setup default mock implementations
vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
}));
