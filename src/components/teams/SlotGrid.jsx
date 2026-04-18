import { Plus } from 'lucide-react'
import TypeBadge from '../TypeBadge'

function PokemonSprite({ id }) {
  if (!id) return <div className="slot-grid__empty-sprite" />
  return (
    <img
      className="slot-grid__sprite"
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      alt=""
    />
  )
}

export default function SlotGrid({ slots, activeSlot, onSlotClick }) {
  return (
    <div className="slot-grid">
      {slots.map((slot, i) => {
        const filled = !!slot?.pokemon_name
        return (
          <button
            key={i}
            className={`slot-grid__slot ${filled ? 'slot-grid__slot--filled' : ''} ${activeSlot === i ? 'slot-grid__slot--active' : ''}`}
            onClick={() => onSlotClick(i)}
            aria-label={filled ? `Edit slot ${i + 1}: ${slot.pokemon_name}` : `Add Pokémon to slot ${i + 1}`}
          >
            <PokemonSprite id={slot?.pokemon_id} />
            {filled ? (
              <>
                <span className="slot-grid__name">{slot.pokemon_name}</span>
                <div className="slot-grid__types">
                  {slot.pokemon_types?.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                </div>
              </>
            ) : (
              <span className="slot-grid__empty-label"><Plus size={20} /> Add</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
