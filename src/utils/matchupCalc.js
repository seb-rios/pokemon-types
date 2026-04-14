import { TYPES, typeChart } from '../data/typeChart'

function getEffectiveness(attackingType, defendingType) {
  return typeChart[attackingType]?.[defendingType] ?? 1
}

// Defensive: given 1-2 defending types, what multiplier does each attacking type deal?
export function getDefensiveMatchups(selectedTypes) {
  return TYPES.map(attackingType => {
    const multiplier = selectedTypes.reduce((acc, defType) => {
      return acc * getEffectiveness(attackingType, defType)
    }, 1)
    return { type: attackingType, multiplier }
  })
}

// Offensive: given 1-2 attacking types, what's the best damage we can deal to each defending type?
export function getOffensiveMatchups(selectedTypes) {
  return TYPES.map(defendingType => {
    const multiplier = Math.max(
      ...selectedTypes.map(atkType => getEffectiveness(atkType, defendingType))
    )
    return { type: defendingType, multiplier }
  })
}

// Group matchups by category
export function groupMatchups(matchups) {
  return {
    immune:    matchups.filter(m => m.multiplier === 0),
    quarter:   matchups.filter(m => m.multiplier === 0.25),
    half:      matchups.filter(m => m.multiplier === 0.5),
    neutral:   matchups.filter(m => m.multiplier === 1),
    double:    matchups.filter(m => m.multiplier === 2),
    quadruple: matchups.filter(m => m.multiplier === 4),
  }
}

export function getTypeAdvantageScore(attackerTypes, defenderTypes) {
  return Math.max(
    ...attackerTypes.map(atkType =>
      defenderTypes.reduce((acc, defType) => acc * (typeChart[atkType]?.[defType] ?? 1), 1)
    )
  )
}
