import { TYPES } from '../data/typeChart'
import { getDefensiveMatchups } from './matchupCalc'

const STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']

// For each of 18 types, how many team members are weak (2x+) or resistant (0.5x-)
export function getTeamTypeCoverage(slots) {
  const filled = slots.filter(s => s.pokemon_types?.length)
  if (!filled.length) return TYPES.map(type => ({ type, weakCount: 0, resistCount: 0, immuneCount: 0, total: 0 }))

  return TYPES.map(attackingType => {
    let weakCount = 0
    let resistCount = 0
    let immuneCount = 0

    filled.forEach(slot => {
      const matchups = getDefensiveMatchups(slot.pokemon_types)
      const multiplier = matchups.find(m => m.type === attackingType)?.multiplier ?? 1
      if (multiplier === 0) immuneCount++
      else if (multiplier >= 2) weakCount++
      else if (multiplier <= 0.5) resistCount++
    })

    return { type: attackingType, weakCount, resistCount, immuneCount, total: filled.length }
  })
}

// Which types can the team hit super-effectively via their moves
export function getTeamOffensiveCoverage(slots) {
  const moveTypes = slots
    .flatMap(s => s.moves || [])
    .filter(m => m.category !== 'status' && m.type)
    .map(m => m.type)
  return [...new Set(moveTypes)]
}

// Average base stats across all filled slots
export function getTeamStatTotals(slots) {
  const filled = slots.filter(s => s.stats?.length)
  if (!filled.length) return STAT_NAMES.map(name => ({ name, avg: 0 }))

  return STAT_NAMES.map(statName => {
    const total = filled.reduce((sum, slot) => {
      const stat = slot.stats?.find(s => s.name === statName)
      return sum + (stat?.value ?? 0)
    }, 0)
    return { name: statName, avg: Math.round(total / filled.length) }
  })
}
