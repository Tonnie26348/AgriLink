// src/integrations/supabase/__mocks__/client.ts
import { vi } from 'vitest';

export const supabase = {
  auth: {
    signInWithPassword: vi.fn(() => ({ data: {}, error: null })),
    signUp: vi.fn(() => ({ data: {}, error: null })),
    signOut: vi.fn(() => ({ error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    getUser: vi.fn(() => ({ data: { user: null } })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({ data: [], error: null })),
      order: vi.fn(() => ({ data: [], error: null })),
      single: vi.fn(() => ({ data: null, error: null })),
      in: vi.fn(() => ({ data: [], error: null })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })),
      })),
    })),
    delete: vi.fn(() => ({ eq: vi.fn(() => ({ error: null })) })),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(() => ({ error: null })),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'mock-image-url' } })),
    })),
  },
};
