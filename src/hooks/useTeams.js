import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const FREE_TEAM_LIMIT = 4

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_slots(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data.map(t => ({
        ...t,
        team_slots: (t.team_slots || []).sort((a, b) => a.slot_index - b.slot_index),
      }))
    },
  })
}

export function useTeam(id) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_slots(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        ...data,
        team_slots: (data.team_slots || []).sort((a, b) => a.slot_index - b.slot_index),
      }
    },
    enabled: !!id,
  })
}

export function useSharedTeam(shareToken) {
  return useQuery({
    queryKey: ['shared-team', shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_team_by_share_token', { p_token: shareToken })
      if (error) throw error
      if (!data) throw new Error('Team not found')
      return data
    },
    enabled: !!shareToken,
  })
}

function friendlyError(error) {
  if (!error) return 'Something went wrong. Please try again.'
  const msg = error.message ?? ''
  if (msg.includes('row-level security') || msg.includes('policy')) {
    return 'You need to be signed in to save teams. Please sign in and try again.'
  }
  if (msg.includes('JWT') || msg.includes('token') || msg.includes('auth')) {
    return 'Your session has expired. Please sign in again.'
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }
  return msg || 'Something went wrong. Please try again.'
}

export function useCreateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, slots }) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('You need to be signed in to create a team.')

      const { data: existing, error: countError } = await supabase
        .from('teams')
        .select('id')
      if (countError) throw new Error(friendlyError(countError))
      if (existing.length >= FREE_TEAM_LIMIT) {
        throw new Error(`You've reached the ${FREE_TEAM_LIMIT}-team limit on the free plan.`)
      }

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({ name, user_id: user.id })
        .select()
        .single()
      if (teamError) throw new Error(friendlyError(teamError))

      const slotRows = slots.map((s, i) => ({ ...s, team_id: team.id, slot_index: i }))
      const { error: slotsError } = await supabase.from('team_slots').insert(slotRows)
      if (slotsError) throw new Error(friendlyError(slotsError))

      return team
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  })
}

export function useUpdateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name, slots }) => {
      const { error: teamError } = await supabase
        .from('teams')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (teamError) throw teamError

      const slotRows = slots.map((s, i) => ({ ...s, team_id: id, slot_index: i }))
      const { error: slotsError } = await supabase
        .from('team_slots')
        .upsert(slotRows, { onConflict: 'team_id,slot_index' })
      if (slotsError) throw slotsError
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['teams'] })
      qc.invalidateQueries({ queryKey: ['teams', id] })
    },
  })
}

export function useDeleteTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('teams').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  })
}

export function useSaveTeamAnalysis() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, analysis }) => {
      const { error } = await supabase
        .from('teams')
        .update({ ai_analysis: analysis, ai_analyzed_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['teams', id] }),
  })
}
