import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Trash2 } from 'lucide-react'
import { usePokemonList } from '../../hooks/usePokemonList'
import { usePokemon } from '../../hooks/usePokemon'
import TypeBadge from '../TypeBadge'
import MoveSearch from './MoveSearch'
import ItemSearch from './ItemSearch'
import ItemRecommendations from './ItemRecommendations'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function SlotEditor({ slotIndex, slot, onChange, onClose }) {
  const [query, setQuery] = useState(slot?.pokemon_name ?? '')
  const [open, setOpen] = useState(false)
  const [selectedPokemonName, setSelectedPokemonName] = useState(slot?.pokemon_name ?? null)
  const inputRef = useRef(null)

  const { data: pokemonList } = usePokemonList()
  const debouncedQuery = useDebounce(query, 250)

  const filtered = useMemo(() => {
    if (!debouncedQuery || !pokemonList) return []
    const q = debouncedQuery.toLowerCase()
    return pokemonList.filter(p => p.name.startsWith(q)).slice(0, 8)
  }, [debouncedQuery, pokemonList])

  useEffect(() => {
    setOpen(filtered.length > 0 && !selectedPokemonName)
  }, [filtered, selectedPokemonName])

  const { data: pokemon } = usePokemon(selectedPokemonName)

  // Track the previous pokemon name so we know when the pokemon actually changed
  const prevNameRef = useRef(selectedPokemonName)

  useEffect(() => {
    if (!pokemon || !selectedPokemonName) return
    // Confirm loaded data matches what's currently selected (guards against stale responses)
    if (pokemon.name.toLowerCase() !== selectedPokemonName.toLowerCase()) return
    const pokemonChanged = prevNameRef.current !== selectedPokemonName
    prevNameRef.current = selectedPokemonName
    onChange(slotIndex, {
      pokemon_id: pokemon.id,
      pokemon_name: pokemon.name,
      pokemon_types: pokemon.types,
      stats: pokemon.stats,
      // Reset moves when the pokemon changes; preserve them on re-renders of the same pokemon
      moves: pokemonChanged ? [] : (slot?.moves ?? []),
      item_id: slot?.item_id ?? null,
      item_name: slot?.item_name ?? null,
      item_sprite: slot?.item_sprite ?? null,
    })
  }, [pokemon, selectedPokemonName])

  function selectPokemon(name) {
    const display = name.charAt(0).toUpperCase() + name.slice(1)
    setQuery(display)
    setSelectedPokemonName(name)
    setOpen(false)
  }

  function clearPokemon() {
    setQuery('')
    setSelectedPokemonName(null)
    onChange(slotIndex, null)
  }

  function handleMovesChange(moves) {
    onChange(slotIndex, { ...slot, moves })
  }

  function handleItemChange(item) {
    onChange(slotIndex, {
      ...slot,
      item_id: item?.id ?? null,
      item_name: item?.name ?? null,
      item_sprite: item?.sprite ?? null,
    })
  }

  const spriteUrl = pokemon?.id
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    : null

  return (
    <div className="slot-editor">
      <div className="slot-editor__header">
        <span className="slot-editor__title">Slot {slotIndex + 1}</span>
        <button className="slot-editor__close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      {/* Pokémon search */}
      <div className="slot-editor__pokemon-row">
        {spriteUrl && <img className="slot-editor__sprite" src={spriteUrl} alt={pokemon.name} />}
        <div className="slot-editor__search-wrap">
          <input
            ref={inputRef}
            className="slot-editor__search"
            placeholder="Search Pokémon…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedPokemonName(null) }}
            autoFocus
          />
          {selectedPokemonName && (
            <button className="slot-editor__clear" onClick={clearPokemon} aria-label="Remove Pokémon">
              <Trash2 size={14} />
            </button>
          )}
          {open && (
            <ul className="slot-editor__dropdown">
              {filtered.map(p => (
                <li key={p.name}>
                  <button onClick={() => selectPokemon(p.name)}>
                    {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Type badges */}
      {pokemon?.types && (
        <div className="slot-editor__types">
          {pokemon.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </div>
      )}

      {/* Moves */}
      {selectedPokemonName && (
        <MoveSearch
          pokemonId={pokemon?.id}
          selectedMoves={slot?.moves ?? []}
          onChange={handleMovesChange}
        />
      )}

      {/* Item */}
      {selectedPokemonName && (
        <>
          {!slot?.item_id && (
            <ItemRecommendations pokemon={pokemon} onSelect={handleItemChange} />
          )}
          <ItemSearch
            selectedItem={slot?.item_id ? { id: slot.item_id, name: slot.item_name, sprite: slot.item_sprite } : null}
            onChange={handleItemChange}
          />
        </>
      )}
    </div>
  )
}
