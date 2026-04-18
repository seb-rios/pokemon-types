import { describe, it, expect } from 'vitest'
import {
  getDefensiveMatchups,
  getOffensiveMatchups,
  groupMatchups,
  getTypeAdvantageScore,
  getCounterTypes,
  getVulnerableTypes,
} from '../matchupCalc'
import { TYPES } from '../../data/typeChart'

describe('getDefensiveMatchups', () => {
  it('returns 18 entries for a single type', () => {
    const result = getDefensiveMatchups(['fire'])
    expect(result).toHaveLength(18)
  })

  it('correctly identifies fire weak vs fire/flying charizard', () => {
    const result = getDefensiveMatchups(['fire', 'flying'])
    const rock = result.find(m => m.type === 'rock')
    // rock deals 2x to fire AND 2x to flying → 4x
    expect(rock.multiplier).toBe(4)
  })

  it('identifies immunity: ground vs fire/flying is immune', () => {
    const result = getDefensiveMatchups(['fire', 'flying'])
    const ground = result.find(m => m.type === 'ground')
    // flying is immune to ground
    expect(ground.multiplier).toBe(0)
  })

  it('identifies resistance: fire vs fire/flying is 0.5', () => {
    const result = getDefensiveMatchups(['fire', 'flying'])
    const fire = result.find(m => m.type === 'fire')
    // fire resists fire (0.5) and flying is neutral (1) → 0.5
    expect(fire.multiplier).toBe(0.5)
  })

  it('fire type defending: water attacking deals 2x', () => {
    const result = getDefensiveMatchups(['fire'])
    const water = result.find(m => m.type === 'water')
    expect(water.multiplier).toBe(2)
  })

  it('ghost/normal immunity: normal type is immune to ghost', () => {
    const result = getDefensiveMatchups(['normal'])
    const ghost = result.find(m => m.type === 'ghost')
    expect(ghost.multiplier).toBe(0)
  })

  it('dual type quarter resist: rock/steel takes 0.25 from normal', () => {
    // normal deals 0.5 to rock and 0.5 to steel → 0.25
    const result = getDefensiveMatchups(['rock', 'steel'])
    const normal = result.find(m => m.type === 'normal')
    expect(normal.multiplier).toBe(0.25)
  })

  it('has correct shape for each entry', () => {
    getDefensiveMatchups(['water']).forEach(entry => {
      expect(entry).toHaveProperty('type')
      expect(entry).toHaveProperty('multiplier')
      expect(TYPES).toContain(entry.type)
    })
  })
})

describe('getOffensiveMatchups', () => {
  it('returns 18 entries', () => {
    expect(getOffensiveMatchups(['fire'])).toHaveLength(18)
  })

  it('fire deals 2x to grass', () => {
    const result = getOffensiveMatchups(['fire'])
    const grass = result.find(m => m.type === 'grass')
    expect(grass.multiplier).toBe(2)
  })

  it('fire deals 0.5 to water', () => {
    const result = getOffensiveMatchups(['fire'])
    const water = result.find(m => m.type === 'water')
    expect(water.multiplier).toBe(0.5)
  })

  it('dual attacking picks the best multiplier: fire+water vs grass → 2 (fire wins over water 0.5)', () => {
    const result = getOffensiveMatchups(['fire', 'water'])
    const grass = result.find(m => m.type === 'grass')
    expect(grass.multiplier).toBe(2)
  })

  it('dual attacking: fire+water vs rock → 2 (water wins)', () => {
    const result = getOffensiveMatchups(['fire', 'water'])
    const rock = result.find(m => m.type === 'rock')
    expect(rock.multiplier).toBe(2)
  })
})

describe('groupMatchups', () => {
  it('correctly groups into 6 buckets', () => {
    const matchups = getDefensiveMatchups(['fire', 'flying'])
    const grouped = groupMatchups(matchups)
    expect(grouped).toHaveProperty('immune')
    expect(grouped).toHaveProperty('quarter')
    expect(grouped).toHaveProperty('half')
    expect(grouped).toHaveProperty('neutral')
    expect(grouped).toHaveProperty('double')
    expect(grouped).toHaveProperty('quadruple')
  })

  it('all matchups appear in exactly one bucket', () => {
    const matchups = getDefensiveMatchups(['fire', 'flying'])
    const grouped = groupMatchups(matchups)
    const total = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)
    expect(total).toBe(18)
  })

  it('rock goes into quadruple for fire/flying', () => {
    const matchups = getDefensiveMatchups(['fire', 'flying'])
    const grouped = groupMatchups(matchups)
    expect(grouped.quadruple.some(m => m.type === 'rock')).toBe(true)
  })

  it('ground goes into immune for fire/flying', () => {
    const matchups = getDefensiveMatchups(['fire', 'flying'])
    const grouped = groupMatchups(matchups)
    expect(grouped.immune.some(m => m.type === 'ground')).toBe(true)
  })
})

describe('getTypeAdvantageScore', () => {
  it('fire beats grass 2x', () => {
    expect(getTypeAdvantageScore(['fire'], ['grass'])).toBe(2)
  })

  it('returns combined multiplier across dual defender types', () => {
    // fire attacking water/grass: typeChart[fire][water]=0.5, typeChart[fire][grass]=2 → 0.5*2=1
    expect(getTypeAdvantageScore(['fire'], ['water', 'grass'])).toBe(1)
  })

  it('returns 1 for neutral matchup', () => {
    expect(getTypeAdvantageScore(['normal'], ['normal'])).toBe(1)
  })

  it('returns 0 for immune matchup', () => {
    expect(getTypeAdvantageScore(['normal'], ['ghost'])).toBe(0)
  })
})

describe('getCounterTypes', () => {
  it('returns types that deal ≥2x to at least one defending type', () => {
    const counters = getCounterTypes(['fire'])
    // water, rock, ground all deal 2x to fire
    expect(counters).toContain('water')
    expect(counters).toContain('rock')
    expect(counters).toContain('ground')
  })

  it('does not include types that deal <2x', () => {
    const counters = getCounterTypes(['fire'])
    // fire vs fire is 0.5
    expect(counters).not.toContain('fire')
  })
})

describe('getVulnerableTypes', () => {
  it('returns defending types that take ≥2x from at least one selected attacking type', () => {
    const vulnerable = getVulnerableTypes(['fire'])
    expect(vulnerable).toContain('grass')
    expect(vulnerable).toContain('ice')
    expect(vulnerable).toContain('bug')
    expect(vulnerable).toContain('steel')
  })

  it('does not include types that resist the attacking type', () => {
    const vulnerable = getVulnerableTypes(['fire'])
    expect(vulnerable).not.toContain('water')
    expect(vulnerable).not.toContain('rock')
  })
})
