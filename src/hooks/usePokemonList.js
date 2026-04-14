import { useQuery } from '@tanstack/react-query'

async function fetchPokemonList() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500')
  if (!res.ok) throw new Error('Failed to fetch Pokemon list')
  const data = await res.json()
  return data.results.map(p => {
    // Extract ID from URL: https://pokeapi.co/api/v2/pokemon/1/
    const parts = p.url.split('/')
    const id = parseInt(parts[parts.length - 2], 10)
    return { name: p.name, id }
  })
}

export function usePokemonList() {
  return useQuery({
    queryKey: ['pokemon-list'],
    queryFn: fetchPokemonList,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24,
  })
}
