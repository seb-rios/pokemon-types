import { useItemRecommendations } from '../../hooks/useItemRecommendations'

export default function ItemRecommendations({ pokemon, onSelect }) {
  const { recommendations, isLoading } = useItemRecommendations(pokemon)

  if (!pokemon) return null

  return (
    <div className="item-recommendations">
      <span className="item-recommendations__label">Suggested</span>
      <div className="item-recommendations__chips">
        {isLoading
          ? Array(3).fill(null).map((_, i) => (
              <div key={i} className="item-chip item-chip--skeleton" />
            ))
          : recommendations.map(item => (
              <button
                key={item.id}
                className="item-chip"
                onClick={() => onSelect(item)}
                title={item.effect}
              >
                {item.sprite && (
                  <img src={item.sprite} alt="" className="item-chip__sprite" />
                )}
                <span className="item-chip__name">{item.name}</span>
              </button>
            ))
        }
      </div>
    </div>
  )
}
