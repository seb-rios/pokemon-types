import { http, HttpResponse } from 'msw'
import { charizardApiResponse, flamethrowerApiResponse } from '../fixtures/pokemon'

const POKEAPI = 'https://pokeapi.co/api/v2'

export const handlers = [
  // Single Pokémon
  http.get(`${POKEAPI}/pokemon/charizard`, () =>
    HttpResponse.json(charizardApiResponse)
  ),
  http.get(`${POKEAPI}/pokemon/6`, () =>
    HttpResponse.json(charizardApiResponse)
  ),
  http.get(`${POKEAPI}/pokemon/empoleon`, () =>
    HttpResponse.json({
      ...charizardApiResponse,
      id: 395,
      name: 'empoleon',
      types: [{ type: { name: 'water' } }, { type: { name: 'steel' } }],
    })
  ),

  // Full Pokémon list
  http.get(`${POKEAPI}/pokemon`, ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.get('limit') === '1500') {
      return HttpResponse.json({
        results: [
          { name: 'charizard', url: `${POKEAPI}/pokemon/6/` },
          { name: 'empoleon', url: `${POKEAPI}/pokemon/395/` },
          { name: 'pikachu', url: `${POKEAPI}/pokemon/25/` },
        ],
      })
    }
    return HttpResponse.json({ results: [] })
  }),

  // Move detail
  http.get(`${POKEAPI}/move/53/`, () =>
    HttpResponse.json(flamethrowerApiResponse)
  ),
  http.get(`${POKEAPI}/move/:id/`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      name: 'tackle',
      power: 40,
      pp: 35,
      type: { name: 'normal' },
      damage_class: { name: 'physical' },
    })
  ),

  // Item list
  http.get(`${POKEAPI}/item`, () =>
    HttpResponse.json({
      results: [
        { name: 'choice-specs', url: `${POKEAPI}/item/87/` },
        { name: 'choice-band', url: `${POKEAPI}/item/10016/` },
        { name: 'leftovers', url: `${POKEAPI}/item/234/` },
      ],
    })
  ),

  // Item detail
  http.get(`${POKEAPI}/item/:nameOrId/`, ({ params }) =>
    HttpResponse.json({
      id: 87,
      name: params.nameOrId,
      sprites: { default: null },
      effect_entries: [{ language: { name: 'en' }, short_effect: 'Boosts Special Attack.' }],
    })
  ),
]
