import { describe, it, expect } from 'vitest'
import { getItemRecommendations } from '../itemRecommendations'
import { charizardFixture, empoleonFixture } from '../../test/fixtures/pokemon'

describe('getItemRecommendations', () => {
  it('returns [] for null', () => {
    expect(getItemRecommendations(null)).toEqual([])
  })

  it('returns [] for pokemon with no stats', () => {
    expect(getItemRecommendations({ types: ['fire'], stats: [] })).toEqual([])
  })

  it('returns [] for pokemon with missing stats', () => {
    expect(getItemRecommendations({})).toEqual([])
  })

  it('returns at most 4 items', () => {
    expect(getItemRecommendations(charizardFixture).length).toBeLessThanOrEqual(4)
  })

  describe('special attacker (spAtk > atk, spAtk >= 80)', () => {
    it('includes choice-specs as first pick', () => {
      const recs = getItemRecommendations(charizardFixture) // spAtk 109 > atk 84
      expect(recs[0]).toBe('choice-specs')
    })

    it('includes choice-scarf when speed >= 100', () => {
      const recs = getItemRecommendations(charizardFixture) // speed 100
      expect(recs).toContain('choice-scarf')
      expect(recs).not.toContain('life-orb')
    })

    it('includes life-orb instead of choice-scarf when speed < 100', () => {
      const recs = getItemRecommendations(empoleonFixture) // speed 60
      expect(recs).toContain('life-orb')
      expect(recs).not.toContain('choice-scarf')
    })

    it('includes leftovers', () => {
      expect(getItemRecommendations(charizardFixture)).toContain('leftovers')
    })
  })

  describe('physical attacker (atk >= spAtk, atk >= 80)', () => {
    const machamp = {
      id: 68, name: 'Machamp', types: ['fighting'],
      stats: [
        { name: 'hp', value: 90 }, { name: 'attack', value: 130 },
        { name: 'defense', value: 80 }, { name: 'special-attack', value: 65 },
        { name: 'special-defense', value: 85 }, { name: 'speed', value: 55 },
      ],
    }

    it('includes choice-band as first pick', () => {
      expect(getItemRecommendations(machamp)[0]).toBe('choice-band')
    })

    it('includes life-orb when speed < 100', () => {
      const recs = getItemRecommendations(machamp) // speed 55
      expect(recs).toContain('life-orb')
    })

    it('includes choice-scarf when speed >= 100', () => {
      const fastPhysical = {
        ...machamp,
        stats: machamp.stats.map(s => s.name === 'speed' ? { ...s, value: 105 } : s),
      }
      expect(getItemRecommendations(fastPhysical)).toContain('choice-scarf')
    })
  })

  describe('tank (def >= 80 AND hp >= 80, or spDef >= 100)', () => {
    const blissey = {
      id: 242, name: 'Blissey', types: ['normal'],
      stats: [
        { name: 'hp', value: 255 }, { name: 'attack', value: 10 },
        { name: 'defense', value: 10 }, { name: 'special-attack', value: 75 },
        { name: 'special-defense', value: 135 }, { name: 'speed', value: 55 },
      ],
    }

    it('includes leftovers for non-poison tank', () => {
      expect(getItemRecommendations(blissey)).toContain('leftovers')
    })

    it('includes rocky-helmet', () => {
      expect(getItemRecommendations(blissey)).toContain('rocky-helmet')
    })

    it('includes black-sludge for poison-type tank', () => {
      // atk < 80 so isPhysical is false, spDef=100 triggers isTank
      const poisonTank = {
        id: 89, name: 'Muk', types: ['poison'],
        stats: [
          { name: 'hp', value: 105 }, { name: 'attack', value: 65 },
          { name: 'defense', value: 75 }, { name: 'special-attack', value: 65 },
          { name: 'special-defense', value: 100 }, { name: 'speed', value: 50 },
        ],
      }
      const recs = getItemRecommendations(poisonTank)
      expect(recs).toContain('black-sludge')
      expect(recs).not.toContain('leftovers')
    })
  })

  describe('Charizard fixture (spAtk 109, atk 84, speed 100)', () => {
    it('recommends choice-specs', () => {
      expect(getItemRecommendations(charizardFixture)).toContain('choice-specs')
    })

    it('recommends choice-scarf (fast special attacker)', () => {
      expect(getItemRecommendations(charizardFixture)).toContain('choice-scarf')
    })
  })

  describe('Empoleon fixture (spAtk 111, atk 86, speed 60)', () => {
    it('recommends choice-specs', () => {
      expect(getItemRecommendations(empoleonFixture)).toContain('choice-specs')
    })

    it('recommends life-orb (slow special attacker)', () => {
      expect(getItemRecommendations(empoleonFixture)).toContain('life-orb')
    })
  })
})
