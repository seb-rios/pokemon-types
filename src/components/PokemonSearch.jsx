import { useState, useEffect, useRef, useMemo } from 'react'
import { Search } from 'lucide-react'
import { usePokemonList } from '../hooks/usePokemonList'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function PokemonSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const { data: pokemonList, isLoading } = usePokemonList()
  const debouncedQuery = useDebounce(query, 300)

  const filtered = useMemo(() => {
    if (!debouncedQuery || !pokemonList) return []
    const q = debouncedQuery.toLowerCase()
    return pokemonList
      .filter(p => p.name.startsWith(q))
      .slice(0, 8)
  }, [debouncedQuery, pokemonList])

  useEffect(() => {
    setOpen(filtered.length > 0 && query.length > 0)
    setActiveIndex(-1)
  }, [filtered, query])

  const handleSelect = (pokemon) => {
    setQuery(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1))
    setOpen(false)
    onSelect(pokemon.name)
  }

  const handleKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex]
      if (item) item.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  return (
    <div className="pokemon-search">
      <div className="pokemon-search__input-wrapper">
        <Search className="pokemon-search__icon" size={20} />
        <input
          ref={inputRef}
          type="text"
          className="pokemon-search__input"
          placeholder={isLoading ? 'Loading Pokémon...' : 'Search Pokémon (e.g. charizard)'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => filtered.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {query && (
          <button
            className="pokemon-search__clear"
            onClick={() => { setQuery(''); setOpen(false); onSelect(null) }}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <ul className="pokemon-search__dropdown" ref={listRef}>
          {filtered.map((pokemon, idx) => (
            <li
              key={pokemon.name}
              className={`pokemon-search__item ${idx === activeIndex ? 'pokemon-search__item--active' : ''}`}
              onMouseDown={() => handleSelect(pokemon)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <img
                className="pokemon-search__sprite"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
                loading="lazy"
              />
              <span className="pokemon-search__name">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
