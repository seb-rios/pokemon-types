import { useQuery } from '@tanstack/react-query'

async function fetchPokemon(nameOrId) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
  if (!res.ok) throw new Error(`Failed to fetch Pokemon: ${nameOrId}`)
  const data = await res.json()
  return {
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    types: data.types.map(t => t.type.name),
    sprite: data.sprites?.other?.['official-artwork']?.front_default
      || data.sprites?.front_default
      || null,
    id: data.id,
    stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
  }
}

export function usePokemon(nameOrId) {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => fetchPokemon(nameOrId),
    enabled: !!nameOrId,
    staleTime: 1000 * 60 * 60,
  })
}
