import { charizardFixture, empoleonFixture } from './pokemon'

export const fullTeamSlots = [
  {
    slot_index: 0,
    pokemon_id: 6,
    pokemon_name: 'Charizard',
    pokemon_types: ['fire', 'flying'],
    stats: charizardFixture.stats,
    item_id: 1,
    item_name: 'Choice Specs',
    item_sprite: null,
    moves: [{ id: 53, name: 'Flamethrower', power: 90, type: 'fire', category: 'special' }],
  },
  {
    slot_index: 1,
    pokemon_id: 395,
    pokemon_name: 'Empoleon',
    pokemon_types: ['water', 'steel'],
    stats: empoleonFixture.stats,
    item_id: null,
    item_name: null,
    item_sprite: null,
    moves: [{ id: 55, name: 'Surf', power: 90, type: 'water', category: 'special' }],
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    slot_index: i + 2,
    pokemon_id: 25 + i,
    pokemon_name: `Pokémon${i + 3}`,
    pokemon_types: ['normal'],
    stats: [{ name: 'hp', value: 60 }, { name: 'attack', value: 55 }, { name: 'defense', value: 40 }, { name: 'special-attack', value: 50 }, { name: 'special-defense', value: 50 }, { name: 'speed', value: 90 }],
    item_id: null,
    item_name: null,
    item_sprite: null,
    moves: [],
  })),
]

export const teamFixture = {
  id: 'test-team-uuid-1234',
  user_id: 'test-user-uuid',
  name: 'Test Team Alpha',
  share_token: 'share-token-uuid-5678',
  ai_analysis: null,
  ai_analyzed_at: null,
  created_at: '2026-04-18T00:00:00.000Z',
  updated_at: '2026-04-18T00:00:00.000Z',
  team_slots: fullTeamSlots,
}

export const aiAnalysisFixture = {
  overall: 'A balanced team with strong special attackers but some defensive gaps.',
  type_gaps: ['Vulnerable to Electric-type moves on 3 members'],
  role_balance: { attackers: 4, tanks: 1, support: 1 },
  suggestions: [
    { slot: 1, pokemon: 'Charizard', tip: 'Consider a Ground-type move to cover Rock weakness.' },
  ],
  synergy_notes: 'Fire and Water types create a solid offensive core.',
}
