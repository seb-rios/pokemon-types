import { useState } from 'react'
import { usePokemonMoves } from '../../hooks/usePokemonMoves'
import TypeBadge from '../TypeBadge'

export default function MoveSearch({ pokemonId, selectedMoves, onChange }) {
  const [query, setQuery] = useState('')
  const { data: moves = [], isLoading } = usePokemonMoves(pokemonId)

  const filtered = query.trim()
    ? moves.filter(m => m.name.toLowerCase().includes(query.toLowerCase()))
    : moves

  function toggle(move) {
    const already = selectedMoves.some(m => m.id === move.id)
    if (already) {
      onChange(selectedMoves.filter(m => m.id !== move.id))
    } else if (selectedMoves.length < 4) {
      onChange([...selectedMoves, move])
    }
  }

  return (
    <div className="move-search">
      <div className="move-search__header">
        <span className="move-search__label">Moves <span className="move-search__count">{selectedMoves.length}/4</span></span>
        <input
          className="move-search__input"
          placeholder="Filter moves…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {isLoading && <p className="move-search__loading">Loading moves…</p>}

      <div className="move-search__list">
        {filtered.map(move => {
          const selected = selectedMoves.some(m => m.id === move.id)
          const disabled = !selected && selectedMoves.length >= 4
          return (
            <button
              key={move.id}
              className={`move-search__item ${selected ? 'move-search__item--selected' : ''} ${disabled ? 'move-search__item--disabled' : ''}`}
              onClick={() => toggle(move)}
              disabled={disabled}
            >
              <span className="move-search__item-name">{move.name}</span>
              <span className="move-search__item-meta">
                <TypeBadge type={move.type} size="sm" />
                <span className="move-search__item-cat">{move.category}</span>
                {move.power && <span className="move-search__item-power">{move.power} pw</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
