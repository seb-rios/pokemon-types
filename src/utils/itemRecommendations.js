export function getItemRecommendations(pokemon) {
  if (!pokemon?.stats?.length) return []

  const getStat = name => pokemon.stats.find(s => s.name === name)?.value ?? 0
  const spAtk = getStat('special-attack')
  const atk   = getStat('attack')
  const def   = getStat('defense')
  const spDef = getStat('special-defense')
  const speed = getStat('speed')
  const hp    = getStat('hp')
  const types = pokemon.types ?? []

  const isSpecial  = spAtk > atk && spAtk >= 80
  const isPhysical = atk >= spAtk && atk >= 80
  const isTank     = (def >= 80 && hp >= 80) || spDef >= 100
  const isFast     = speed >= 100
  const isPoison   = types.includes('poison')

  const picks = []

  if (isSpecial) {
    picks.push('choice-specs')
    picks.push(isFast ? 'choice-scarf' : 'life-orb')
    picks.push('leftovers')
  } else if (isPhysical) {
    picks.push('choice-band')
    picks.push(isFast ? 'choice-scarf' : 'life-orb')
    picks.push('leftovers')
  } else if (isTank) {
    picks.push(isPoison ? 'black-sludge' : 'leftovers')
    picks.push('rocky-helmet')
    picks.push('assault-vest')
    picks.push('heavy-duty-boots')
  } else {
    picks.push('leftovers')
    picks.push('life-orb')
    picks.push(isFast ? 'choice-scarf' : 'choice-band')
  }

  return picks.slice(0, 4)
}
