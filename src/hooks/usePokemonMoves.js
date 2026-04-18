import { useQuery } from '@tanstack/react-query'

async function fetchPokemonMoves(pokemonId) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
  if (!res.ok) throw new Error('Failed to fetch Pokémon moves')
  const data = await res.json()

  // Take up to 30 moves from the learnset and fetch their details in parallel
  const moveUrls = data.moves.slice(0, 30).map(m => m.move.url)
  const moveDetails = await Promise.all(
    moveUrls.map(url => fetch(url).then(r => r.json()).catch(() => null))
  )

  return moveDetails
    .filter(Boolean)
    .map(m => ({
      id: m.id,
      name: m.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      power: m.power,
      type: m.type.name,
      category: m.damage_class.name, // physical | special | status
      pp: m.pp,
    }))
    .sort((a, b) => (b.power ?? 0) - (a.power ?? 0))
}

export function usePokemonMoves(pokemonId) {
  return useQuery({
    queryKey: ['pokemon-moves', pokemonId],
    queryFn: () => fetchPokemonMoves(pokemonId),
    enabled: !!pokemonId,
    staleTime: 1000 * 60 * 60,
  })
}
