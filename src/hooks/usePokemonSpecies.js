import { useQuery } from '@tanstack/react-query'

async function fetchPokemonSpecies(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch species: ${id}`)
  const data = await res.json()

  const englishEntries = data.flavor_text_entries.filter(e => e.language.name === 'en')
  const latest = englishEntries[englishEntries.length - 1]
  const flavorText = latest
    ? latest.flavor_text.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  return { flavorText }
}

export function usePokemonSpecies(id) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  })
}
