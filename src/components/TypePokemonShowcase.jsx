import { useState, useEffect } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getCounterTypes, getVulnerableTypes } from '../utils/matchupCalc'
import { GEN_RANGES, GAMES_BY_GEN } from '../data/generations'
import { LEGENDARY_IDS } from '../data/legendaries'
import { NOT_FULLY_EVOLVED } from '../data/notFullyEvolved'
import { useRegionalDex } from '../hooks/useRegionalDex'

const SPRITE_URL = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

// ── Fetch helpers ─────────────────────────────────────────────────

async function fetchPokemonByType(typeName) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
  const data = await res.json()
  return data.pokemon
    .map(entry => {
      const parts = entry.pokemon.url.split('/')
      const id = parseInt(parts[parts.length - 2])
      return { name: entry.pokemon.name, id }
    })
    .sort((a, b) => a.id - b.id)
}

async function fetchGeneration(genNumber) {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${genNumber}`)
  if (!res.ok) throw new Error(`Failed to fetch generation ${genNumber}`)
  const data = await res.json()
  return new Set(data.pokemon_species.map(s => s.name))
}

async function fetchSpeciesLegendary(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
  if (!res.ok) throw new Error(`Species ${name} fetch failed`)
  const { is_legendary, is_mythical } = await res.json()
  return { is_legendary, is_mythical }
}

function typeQueryConfig(typeName) {
  return {
    queryKey: ['pokemon-by-type', typeName],
    queryFn: () => fetchPokemonByType(typeName),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function combinePokemon(queryResults) {
  const seen = new Set()
  return queryResults
    .flatMap(q => q.data ?? [])
    .filter(p => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })
    .sort((a, b) => a.id - b.id)
}

// ── Sub-components ────────────────────────────────────────────────

function PokemonMiniCard({ pokemon }) {
  return (
    <div className="pokemon-mini-card">
      <img
        className="pokemon-mini-card__sprite"
        src={SPRITE_URL(pokemon.id)}
        alt={pokemon.name}
        loading="lazy"
      />
      <span className="pokemon-mini-card__name">{capitalize(pokemon.name)}</span>
    </div>
  )
}

function SkeletonCard() {
  return <div className="pokemon-mini-card pokemon-mini-card--skeleton" />
}

function PokemonRow({ title, pokemonList, isLoading }) {
  const [expanded, setExpanded] = useState(false)

  // Collapse when the list changes (e.g. filter changed)
  useEffect(() => { setExpanded(false) }, [pokemonList])

  if (!isLoading && pokemonList.length === 0) return null

  const INITIAL_COUNT = 20
  const displayList = expanded ? pokemonList : pokemonList.slice(0, INITIAL_COUNT)
  const remaining = pokemonList.length - INITIAL_COUNT

  return (
    <div className="pokemon-row">
      <h3 className="pokemon-row__title">{title}</h3>
      <div className={expanded ? 'pokemon-row__grid' : 'pokemon-row__list'}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : displayList.map(p => <PokemonMiniCard key={p.id} pokemon={p} />)
        }
      </div>
      {!isLoading && !expanded && remaining > 0 && (
        <button className="pokemon-row__show-more" onClick={() => setExpanded(true)}>
          Show {remaining} more ↓
        </button>
      )}
      {!isLoading && expanded && (
        <button className="pokemon-row__show-more" onClick={() => setExpanded(false)}>
          Show less ↑
        </button>
      )}
    </div>
  )
}

// ── Filter bar ────────────────────────────────────────────────────

const GENS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function FilterBar({ selectedGens, onToggleGen, selectedGame, onSelectGame, legendary, onCycleLegendary, baseFormsOnly, onToggleBase, finalEvoOnly, onToggleFinalEvo }) {
  const singleGen = selectedGens.size === 1 ? [...selectedGens][0] : null
  const games = singleGen ? GAMES_BY_GEN[singleGen] : []

  const legendaryLabels = { all: 'All', only: 'Only', exclude: 'Exclude' }

  return (
    <div className="showcase-filters">
      {/* Row 1 – Generation */}
      <div className="showcase-filters__row">
        <span className="showcase-filters__label">Gen</span>
        <button
          className={`filter-pill ${selectedGens.size === 0 ? 'filter-pill--active' : ''}`}
          onClick={() => onToggleGen(null)}
        >
          All
        </button>
        {GENS.map(g => (
          <button
            key={g}
            className={`filter-pill ${selectedGens.has(g) ? 'filter-pill--active' : ''}`}
            onClick={() => onToggleGen(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Row 2 – Games (only when exactly one gen is selected) */}
      {singleGen && (
        <div className="showcase-filters__row">
          <span className="showcase-filters__label">Game</span>
          <button
            className={`filter-pill ${!selectedGame ? 'filter-pill--active' : ''}`}
            onClick={() => onSelectGame(null)}
          >
            All
          </button>
          {games.map(game => (
            <button
              key={game.dex + game.label}
              className={`filter-pill ${selectedGame?.label === game.label ? 'filter-pill--active' : ''}`}
              onClick={() => onSelectGame(selectedGame?.label === game.label ? null : game)}
            >
              {game.label}
            </button>
          ))}
        </div>
      )}

      {/* Row 3 – Toggles */}
      <div className="showcase-filters__row">
        <span className="showcase-filters__label">Legendary</span>
        {['all', 'only', 'exclude'].map(val => (
          <button
            key={val}
            className={`filter-chip ${legendary === val ? 'filter-pill--active' : ''}`}
            onClick={() => onCycleLegendary(val)}
          >
            {legendaryLabels[val]}
          </button>
        ))}
        <span className="showcase-filters__divider" />
        <button
          className={`filter-chip ${baseFormsOnly ? 'filter-pill--active' : ''}`}
          onClick={onToggleBase}
        >
          Base forms
        </button>
        <button
          className={`filter-chip ${finalEvoOnly ? 'filter-pill--active' : ''}`}
          onClick={onToggleFinalEvo}
        >
          Final evo
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export default function TypePokemonShowcase({ selectedTypes }) {
  const [selectedGens, setSelectedGens] = useState(new Set())
  const [selectedGame, setSelectedGame] = useState(null)
  const [legendary, setLegendary] = useState('all')
  const [baseFormsOnly, setBaseFormsOnly] = useState(true)
  const [finalEvoOnly, setFinalEvoOnly] = useState(false)

  // Reset game filter when gen selection changes
  useEffect(() => { setSelectedGame(null) }, [selectedGens])

  const { data: regionalDexNames } = useRegionalDex(selectedGame?.dex ?? null)

  function toggleGen(gen) {
    if (gen === null) {
      setSelectedGens(new Set())
      return
    }
    setSelectedGens(prev => {
      const next = new Set(prev)
      if (next.has(gen)) next.delete(gen)
      else next.add(gen)
      return next
    })
  }

  // ── Phase 1: Fetch Pokémon by type ────────────────────────────

  const counterTypes = getCounterTypes(selectedTypes)
  const vulnerableTypes = getVulnerableTypes(selectedTypes)
  const allTypes = [...new Set([...selectedTypes, ...counterTypes, ...vulnerableTypes])]

  const typeQueries = useQueries({ queries: allTypes.map(typeQueryConfig) })
  const typeQueryMap = Object.fromEntries(allTypes.map((type, i) => [type, typeQueries[i]]))

  // ── Phase 2: Fetch generation species sets from PokéAPI ───────

  const selectedGensArray = [...selectedGens]
  const genQueries = useQueries({
    queries: selectedGensArray.map(gen => ({
      queryKey: ['generation', gen],
      queryFn: () => fetchGeneration(gen),
      staleTime: Infinity,
      gcTime: Infinity,
      enabled: selectedGens.size > 0,
    }))
  })
  const genDataMap = Object.fromEntries(selectedGensArray.map((gen, i) => [gen, genQueries[i]]))

  // ── Phase 3: Compute raw Pokémon lists from type queries ──────

  const selectedTypeQueries = selectedTypes.map(t => typeQueryMap[t])
  const typeLoading = selectedTypeQueries.some(q => q?.isLoading)

  let rawTypePokemon = []
  if (!typeLoading) {
    if (selectedTypes.length === 1) {
      rawTypePokemon = selectedTypeQueries[0]?.data ?? []
    } else {
      const ids = new Set((selectedTypeQueries[0]?.data ?? []).map(p => p.id))
      rawTypePokemon = (selectedTypeQueries[1]?.data ?? []).filter(p => ids.has(p.id))
    }
  }

  const counterTypeQueries = counterTypes.map(t => typeQueryMap[t])
  const counterLoading = counterTypeQueries.some(q => q?.isLoading)
  const rawCounterPokemon = counterLoading ? [] : combinePokemon(counterTypeQueries)

  const vulnerableTypeQueries = vulnerableTypes.map(t => typeQueryMap[t])
  const vulnerableLoading = vulnerableTypeQueries.some(q => q?.isLoading)
  const rawVulnerablePokemon = vulnerableLoading ? [] : combinePokemon(vulnerableTypeQueries)

  // ── Phase 4: Apply base filters (gen, game, forms, evo) ───────

  function applyBaseFilters(list) {
    return list.filter(p => {
      // Base forms: PokéAPI uses IDs > 10000 for megas, gigantamax, regional forms
      if (baseFormsOnly && p.id > 10000) return false

      // Generation — use API Set when available, fall back to ID range
      if (selectedGens.size > 0) {
        const inAnyGen = selectedGensArray.some(gen => {
          const q = genDataMap[gen]
          if (q?.data) return q.data.has(p.name)
          const [min, max] = GEN_RANGES[gen]
          return p.id >= min && p.id <= max
        })
        if (!inAnyGen) return false
      }

      // Game / regional dex (only filter when data has loaded)
      if (selectedGame && regionalDexNames) {
        if (!regionalDexNames.has(p.name)) return false
      }

      // Final evo
      if (finalEvoOnly && NOT_FULLY_EVOLVED.has(p.id)) return false

      return true
    })
  }

  const baseTypePokemon = applyBaseFilters(rawTypePokemon)
  const baseCounterPokemon = applyBaseFilters(rawCounterPokemon)
  const baseVulnerablePokemon = applyBaseFilters(rawVulnerablePokemon)

  // ── Phase 5: Fetch species legendary flags ────────────────────
  // Only when legendary filter is active, only for base-filtered Pokémon

  const needsLegendaryCheck = legendary !== 'all'
  const allBaseFiltered = needsLegendaryCheck
    ? [...new Map(
        [...baseTypePokemon, ...baseCounterPokemon, ...baseVulnerablePokemon]
          .map(p => [p.name, p])
      ).values()]
    : []

  const speciesQueries = useQueries({
    queries: allBaseFiltered.map(p => ({
      queryKey: ['pokemon-species-legendary', p.name],
      queryFn: () => fetchSpeciesLegendary(p.name),
      staleTime: Infinity,
      gcTime: Infinity,
      enabled: needsLegendaryCheck,
      retry: 1,
    }))
  })

  const speciesMap = Object.fromEntries(
    allBaseFiltered.map((p, i) => [p.name, speciesQueries[i]?.data])
  )

  // Are any species queries still loading (only relevant when filter is active)?
  const speciesLoading = needsLegendaryCheck && speciesQueries.some(q => q.isLoading)

  // ── Phase 6: Apply legendary filter ───────────────────────────

  function applyLegendaryFilter(list) {
    if (legendary === 'all') return list
    return list.filter(p => {
      const species = speciesMap[p.name]
      const isLegend = species != null
        ? species.is_legendary || species.is_mythical
        : LEGENDARY_IDS.has(p.id)   // fallback when API errored or not yet loaded
      if (legendary === 'only') return isLegend
      if (legendary === 'exclude') return !isLegend
      return true
    })
  }

  // Final lists — hold off on legendary filter until species data is ready
  const typePokemon = speciesLoading ? [] : applyLegendaryFilter(baseTypePokemon)
  const counterPokemon = speciesLoading ? [] : applyLegendaryFilter(baseCounterPokemon)
  const vulnerablePokemon = speciesLoading ? [] : applyLegendaryFilter(baseVulnerablePokemon)

  const typeTitle =
    selectedTypes.length === 1
      ? `${capitalize(selectedTypes[0])} Pokémon`
      : `${selectedTypes.map(capitalize).join(' / ')} Pokémon`

  const hasAnyContent =
    typeLoading || typePokemon.length > 0 ||
    counterLoading || counterPokemon.length > 0 ||
    vulnerableLoading || vulnerablePokemon.length > 0

  if (!hasAnyContent && !typeLoading && !counterLoading && !vulnerableLoading) return null

  return (
    <div className="type-pokemon-showcase">
      <FilterBar
        selectedGens={selectedGens}
        onToggleGen={toggleGen}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
        legendary={legendary}
        onCycleLegendary={setLegendary}
        baseFormsOnly={baseFormsOnly}
        onToggleBase={() => setBaseFormsOnly(v => !v)}
        finalEvoOnly={finalEvoOnly}
        onToggleFinalEvo={() => setFinalEvoOnly(v => !v)}
      />

      <PokemonRow
        title={typeTitle}
        pokemonList={typePokemon}
        isLoading={typeLoading || speciesLoading}
      />
      <PokemonRow
        title="Strong against these types"
        pokemonList={counterPokemon}
        isLoading={counterLoading || speciesLoading}
      />
      <PokemonRow
        title="Weak against these types"
        pokemonList={vulnerablePokemon}
        isLoading={vulnerableLoading || speciesLoading}
      />
    </div>
  )
}
