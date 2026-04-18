import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'

async function fetchItemList() {
  const res = await fetch('https://pokeapi.co/api/v2/item?limit=1000')
  if (!res.ok) throw new Error('Failed to fetch items')
  const data = await res.json()
  return data.results // [{name, url}]
}

export async function fetchItemDetail(nameOrUrl) {
  const url = nameOrUrl.startsWith('http')
    ? nameOrUrl
    : `https://pokeapi.co/api/v2/item/${nameOrUrl}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch item')
  const data = await res.json()
  return {
    id: data.id,
    name: data.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    sprite: data.sprites?.default ?? null,
    effect: data.effect_entries?.find(e => e.language.name === 'en')?.short_effect ?? '',
  }
}

export function useItemSearch() {
  const [query, setQuery] = useState('')

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['item-list'],
    queryFn: fetchItemList,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allItems
      .filter(item => item.name.includes(q))
      .slice(0, 12)
      .map(item => ({
        name: item.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        rawName: item.name,
        url: item.url,
      }))
  }, [allItems, query])

  return { filtered, query, setQuery, isLoading }
}
