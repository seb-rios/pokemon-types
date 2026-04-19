import { useEffect, useRef } from 'react'
import { useItemSearch, fetchItemDetail } from '../../hooks/useItemSearch'
import { useQueryClient } from '@tanstack/react-query'

export default function ItemSearch({ selectedItem, onChange }) {
  const { filtered, query, setQuery, isLoading } = useItemSearch()
  const qc = useQueryClient()
  const inputRef = useRef(null)

  async function selectItem(raw) {
    // Fetch full item detail (sprite + effect) then pass up
    let detail = qc.getQueryData(['item-detail', raw.rawName])
    if (!detail) {
      detail = await fetchItemDetail(raw.url)
      qc.setQueryData(['item-detail', raw.rawName], detail)
    }
    onChange(detail)
    setQuery(detail.name)
  }

  function clear() {
    onChange(null)
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="item-search">
      <span className="item-search__label">Held Item</span>
      <div className="item-search__row">
        {selectedItem?.sprite && (
          <img className="item-search__sprite" src={selectedItem.sprite} alt={selectedItem.name} />
        )}
        <input
          ref={inputRef}
          className="item-search__input"
          placeholder="Search held items…"
          value={query}
          onChange={e => { setQuery(e.target.value); if (!e.target.value) onChange(null) }}
        />
        {selectedItem && (
          <button className="item-search__clear" onClick={clear} aria-label="Remove item">×</button>
        )}
      </div>

      {query && !selectedItem && (
        <div className="item-search__dropdown">
          {isLoading && Array(3).fill(null).map((_, i) => (
            <div key={i} className="skeleton item-search__skeleton-row" />
          ))}
          {filtered.length === 0 && !isLoading && (
            <p className="item-search__empty">No items found</p>
          )}
          {filtered.map(item => (
            <button
              key={item.rawName}
              className="item-search__option"
              onClick={() => selectItem(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
