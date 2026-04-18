import { vi } from 'vitest'

// Chainable query builder mock
function makeQueryBuilder(resolveValue = { data: [], error: null }) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolveValue),
    then: undefined,
  }
  // Make it thenable so await works
  builder[Symbol.for('nodejs.rejection')] = undefined
  Object.defineProperty(builder, 'then', {
    get() {
      return (resolve) => Promise.resolve(resolveValue).then(resolve)
    },
  })
  return builder
}

export const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-uuid', email: 'test@example.com' } }, error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn(() => makeQueryBuilder()),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: { analysis: null }, error: null }),
  },
}

// These vi.mock calls apply when this file is imported directly from a test.
// For hooks that import supabase themselves, use vi.hoisted() + vi.mock in the test file.
vi.mock('../../lib/supabase', () => ({ supabase: mockSupabase }))
vi.mock('../../../lib/supabase', () => ({ supabase: mockSupabase }))
