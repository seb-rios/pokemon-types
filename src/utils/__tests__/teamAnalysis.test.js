import { describe, it, expect } from 'vitest'
import { getTeamTypeCoverage, getTeamOffensiveCoverage, getTeamStatTotals } from '../teamAnalysis'
import { fullTeamSlots } from '../../test/fixtures/team'
import { TYPES } from '../../data/typeChart'

const emptySlots = Array(6).fill(null)

describe('getTeamTypeCoverage', () => {
  it('returns 18 entries for all-null slots without crashing', () => {
    const result = getTeamTypeCoverage(emptySlots)
    expect(result).toHaveLength(18)
  })

  it('returns all zeros when no slots filled', () => {
    const result = getTeamTypeCoverage(emptySlots)
    result.forEach(entry => {
      expect(entry.weakCount).toBe(0)
      expect(entry.resistCount).toBe(0)
      expect(entry.immuneCount).toBe(0)
      expect(entry.total).toBe(0)
    })
  })

  it('has correct shape for each entry', () => {
    const result = getTeamTypeCoverage(emptySlots)
    result.forEach(entry => {
      expect(entry).toHaveProperty('type')
      expect(entry).toHaveProperty('weakCount')
      expect(entry).toHaveProperty('resistCount')
      expect(entry).toHaveProperty('immuneCount')
      expect(entry).toHaveProperty('total')
      expect(TYPES).toContain(entry.type)
    })
  })

  it('fire/flying slot: rock shows weakCount=1', () => {
    const slots = [
      { pokemon_types: ['fire', 'flying'] },
      ...Array(5).fill(null),
    ]
    const result = getTeamTypeCoverage(slots)
    const rock = result.find(e => e.type === 'rock')
    expect(rock.weakCount).toBe(1)
    expect(rock.total).toBe(1)
  })

  it('fire/flying slot: ground shows immuneCount=1', () => {
    const slots = [{ pokemon_types: ['fire', 'flying'] }, ...Array(5).fill(null)]
    const result = getTeamTypeCoverage(slots)
    const ground = result.find(e => e.type === 'ground')
    expect(ground.immuneCount).toBe(1)
  })

  it('reports correct total from full team fixture', () => {
    const result = getTeamTypeCoverage(fullTeamSlots)
    const filledCount = fullTeamSlots.filter(s => s?.pokemon_types?.length).length
    result.forEach(entry => expect(entry.total).toBe(filledCount))
  })

  it('handles mixed null and filled slots gracefully', () => {
    const slots = [
      { pokemon_types: ['water'] },
      null,
      { pokemon_types: ['steel'] },
      null,
      null,
      null,
    ]
    const result = getTeamTypeCoverage(slots)
    expect(result).toHaveLength(18)
    // fire deals 2x to steel → weakCount should include that
    const fire = result.find(e => e.type === 'fire')
    expect(fire.weakCount).toBeGreaterThan(0)
    result.forEach(entry => expect(entry.total).toBe(2))
  })
})

describe('getTeamOffensiveCoverage', () => {
  it('returns empty array for all-null slots', () => {
    expect(getTeamOffensiveCoverage(emptySlots)).toEqual([])
  })

  it('returns unique move types', () => {
    const slots = [
      { moves: [{ type: 'fire', category: 'special' }, { type: 'fire', category: 'physical' }] },
      { moves: [{ type: 'water', category: 'special' }] },
    ]
    const result = getTeamOffensiveCoverage(slots)
    expect(result).toContain('fire')
    expect(result).toContain('water')
    expect(result.filter(t => t === 'fire')).toHaveLength(1)
  })

  it('excludes status moves', () => {
    const slots = [
      { moves: [{ type: 'normal', category: 'status' }, { type: 'fire', category: 'special' }] },
    ]
    const result = getTeamOffensiveCoverage(slots)
    expect(result).not.toContain('normal')
    expect(result).toContain('fire')
  })

  it('handles slots with no moves', () => {
    const slots = [
      { moves: [] },
      null,
      { moves: [{ type: 'grass', category: 'special' }] },
    ]
    expect(getTeamOffensiveCoverage(slots)).toEqual(['grass'])
  })

  it('handles slots missing moves key', () => {
    const slots = [{ pokemon_types: ['fire'] }, null]
    expect(() => getTeamOffensiveCoverage(slots)).not.toThrow()
  })
})

describe('getTeamStatTotals', () => {
  it('returns 6 stat entries', () => {
    const result = getTeamStatTotals(emptySlots)
    expect(result).toHaveLength(6)
  })

  it('returns all zeros for empty slots', () => {
    const result = getTeamStatTotals(emptySlots)
    result.forEach(s => expect(s.avg).toBe(0))
  })

  it('correctly averages a single slot', () => {
    const slots = [
      { stats: [{ name: 'hp', value: 78 }, { name: 'attack', value: 84 }, { name: 'defense', value: 78 }, { name: 'special-attack', value: 109 }, { name: 'special-defense', value: 85 }, { name: 'speed', value: 100 }] },
      ...Array(5).fill(null),
    ]
    const result = getTeamStatTotals(slots)
    const hp = result.find(s => s.name === 'hp')
    expect(hp.avg).toBe(78)
  })

  it('averages only filled slots, skips nulls', () => {
    const slots = [
      { stats: [{ name: 'hp', value: 100 }, { name: 'attack', value: 0 }, { name: 'defense', value: 0 }, { name: 'special-attack', value: 0 }, { name: 'special-defense', value: 0 }, { name: 'speed', value: 0 }] },
      null,
      { stats: [{ name: 'hp', value: 60 }, { name: 'attack', value: 0 }, { name: 'defense', value: 0 }, { name: 'special-attack', value: 0 }, { name: 'special-defense', value: 0 }, { name: 'speed', value: 0 }] },
      null,
      null,
      null,
    ]
    const result = getTeamStatTotals(slots)
    const hp = result.find(s => s.name === 'hp')
    expect(hp.avg).toBe(80)
  })

  it('returns correct stat names', () => {
    const result = getTeamStatTotals(emptySlots)
    const names = result.map(s => s.name)
    expect(names).toContain('hp')
    expect(names).toContain('attack')
    expect(names).toContain('speed')
    expect(names).toContain('special-attack')
    expect(names).toContain('special-defense')
  })
})
