import { useQueries } from '@tanstack/react-query'
import { getItemRecommendations } from '../utils/itemRecommendations'
import { fetchItemDetail } from './useItemSearch'

export function useItemRecommendations(pokemon) {
  const names = getItemRecommendations(pokemon)

  const results = useQueries({
    queries: names.map(name => ({
      queryKey: ['item-detail', name],
      queryFn: () => fetchItemDetail(name),
      staleTime: Infinity,
      gcTime: Infinity,
      enabled: !!pokemon,
    })),
  })

  return {
    recommendations: results.filter(r => r.data).map(r => r.data),
    isLoading: results.some(r => r.isLoading || r.isFetching),
  }
}
