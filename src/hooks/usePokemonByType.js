import { useQuery } from '@tanstack/react-query'

async function fetchPokemonByType(typeName) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
  const data = await res.json()
  return data.pokemon
    .map(entry => {
      const parts = entry.pokemon.url.split('/')
      const id = parseInt(parts[parts.length - 2])
      return { name: entry.pokemon.name, id }
    })
    .sort((a, b) => a.id - b.id)
}

export function usePokemonByType(typeName) {
  return useQuery({
    queryKey: ['pokemon-by-type', typeName],
    queryFn: () => fetchPokemonByType(typeName),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    enabled: !!typeName,
  })
}
