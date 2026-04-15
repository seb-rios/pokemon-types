import { useQuery } from '@tanstack/react-query'

async function fetchRegionalDex(dexName) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokedex/${dexName}`)
  const data = await res.json()
  return new Set(data.pokemon_entries.map(e => e.pokemon_species.name))
}

export function useRegionalDex(dexName) {
  return useQuery({
    queryKey: ['regional-dex', dexName],
    queryFn: () => fetchRegionalDex(dexName),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!dexName,
  })
}
