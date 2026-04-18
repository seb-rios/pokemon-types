export const charizardFixture = {
  id: 6,
  name: 'Charizard',
  types: ['fire', 'flying'],
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
  stats: [
    { name: 'hp', value: 78 },
    { name: 'attack', value: 84 },
    { name: 'defense', value: 78 },
    { name: 'special-attack', value: 109 },
    { name: 'special-defense', value: 85 },
    { name: 'speed', value: 100 },
  ],
}

export const empoleonFixture = {
  id: 395,
  name: 'Empoleon',
  types: ['water', 'steel'],
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png',
  stats: [
    { name: 'hp', value: 84 },
    { name: 'attack', value: 86 },
    { name: 'defense', value: 88 },
    { name: 'special-attack', value: 111 },
    { name: 'special-defense', value: 101 },
    { name: 'speed', value: 60 },
  ],
}

// Raw PokéAPI shape for MSW handlers
export const charizardApiResponse = {
  id: 6,
  name: 'charizard',
  types: [
    { type: { name: 'fire' } },
    { type: { name: 'flying' } },
  ],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    other: { 'official-artwork': { front_default: charizardFixture.sprite } },
  },
  stats: [
    { stat: { name: 'hp' }, base_stat: 78 },
    { stat: { name: 'attack' }, base_stat: 84 },
    { stat: { name: 'defense' }, base_stat: 78 },
    { stat: { name: 'special-attack' }, base_stat: 109 },
    { stat: { name: 'special-defense' }, base_stat: 85 },
    { stat: { name: 'speed' }, base_stat: 100 },
  ],
  moves: [
    { move: { name: 'flamethrower', url: 'https://pokeapi.co/api/v2/move/53/' } },
    { move: { name: 'air-slash', url: 'https://pokeapi.co/api/v2/move/403/' } },
  ],
}

export const flamethrowerApiResponse = {
  id: 53,
  name: 'flamethrower',
  power: 90,
  pp: 15,
  type: { name: 'fire' },
  damage_class: { name: 'special' },
}
