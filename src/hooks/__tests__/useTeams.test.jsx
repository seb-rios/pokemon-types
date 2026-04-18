import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const { mockGetUser, mockRpc, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-uuid' } }, error: null }),
  mockRpc: vi.fn(),
  mockFrom: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: mockFrom,
    rpc: mockRpc,
  },
}))

import { useCreateTeam, useDeleteTeam, useSharedTeam, useTeams } from '../useTeams'

function makeQueryBuilder(resolveValue = { data: [], error: null }) {
  const builder = {
    select: vi.fn().mockResolvedValue(resolveValue),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolveValue),
  }
  Object.defineProperty(builder, 'then', {
    get() { return (resolve) => Promise.resolve(resolveValue).then(resolve) },
  })
  return builder
}

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user-uuid' } }, error: null })
  mockRpc.mockResolvedValue({ data: null, error: null })
  mockFrom.mockReturnValue(makeQueryBuilder({ data: [], error: null }))
})

describe('useTeams', () => {
  it('calls supabase.from("teams")', async () => {
    const { result } = renderHook(() => useTeams(), { wrapper: wrapper() })
    await waitFor(() => result.current.isSuccess || result.current.isError)
    expect(mockFrom).toHaveBeenCalledWith('teams')
  })
})

describe('useSharedTeam', () => {
  it('calls rpc with get_team_by_share_token', async () => {
    mockRpc.mockResolvedValueOnce({ data: { id: 'abc', name: 'Test' }, error: null })
    const { result } = renderHook(() => useSharedTeam('share-token-uuid-5678'), { wrapper: wrapper() })
    await waitFor(() => result.current.isSuccess || result.current.isError)
    expect(mockRpc).toHaveBeenCalledWith('get_team_by_share_token', { p_token: 'share-token-uuid-5678' })
  })

  it('does not run the query when shareToken is falsy', () => {
    renderHook(() => useSharedTeam(null), { wrapper: wrapper() })
    expect(mockRpc).not.toHaveBeenCalled()
  })
})

describe('useCreateTeam', () => {
  it('calls supabase.auth.getUser() before inserting', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'new-team-id' }, error: null })
    const insertBuilder = { select: vi.fn().mockReturnThis(), single }
    mockFrom
      .mockReturnValueOnce(makeQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce({ insert: vi.fn().mockReturnValue(insertBuilder) })
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) })

    const { result } = renderHook(() => useCreateTeam(), { wrapper: wrapper() })
    result.current.mutate({ name: 'My Team', slots: [] })
    await waitFor(() => result.current.isSuccess || result.current.isError)
    expect(mockGetUser).toHaveBeenCalled()
  })

  it('throws when user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null })
    const { result } = renderHook(() => useCreateTeam(), { wrapper: wrapper() })
    result.current.mutate({ name: 'My Team', slots: [] })
    await waitFor(() => result.current.isError)
    expect(result.current.error.message).toMatch(/signed in/i)
  })

  it('throws at 4-team limit', async () => {
    mockFrom.mockReturnValueOnce(
      makeQueryBuilder({ data: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], error: null })
    )
    const { result } = renderHook(() => useCreateTeam(), { wrapper: wrapper() })
    result.current.mutate({ name: 'My Team', slots: [] })
    await waitFor(() => result.current.isError)
    expect(result.current.error.message).toMatch(/4-team limit/i)
  })

  it('includes user_id in the team insert payload', async () => {
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'new-team' }, error: null }),
    })
    mockFrom
      .mockReturnValueOnce(makeQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce({ insert: insertMock })
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) })

    const { result } = renderHook(() => useCreateTeam(), { wrapper: wrapper() })
    result.current.mutate({ name: 'My Team', slots: [] })
    await waitFor(() => result.current.isSuccess || result.current.isError)
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'test-user-uuid', name: 'My Team' })
    )
  })
})

describe('useDeleteTeam', () => {
  it('calls supabase.from("teams").delete().eq("id", id)', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValueOnce({ delete: deleteMock })

    const { result } = renderHook(() => useDeleteTeam(), { wrapper: wrapper() })
    result.current.mutate('test-team-uuid-1234')
    await waitFor(() => result.current.isSuccess || result.current.isError)

    expect(mockFrom).toHaveBeenCalledWith('teams')
    expect(deleteMock).toHaveBeenCalled()
    expect(eqMock).toHaveBeenCalledWith('id', 'test-team-uuid-1234')
  })
})
