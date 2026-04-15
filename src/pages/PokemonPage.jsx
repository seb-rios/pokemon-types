import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PokemonSearch from '../components/PokemonSearch'
import MatchupDisplay from '../components/MatchupDisplay'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../hooks/usePokemon'
import SEO from '../components/SEO'

function PokemonCard({ name }) {
  const { data, isLoading, isError } = usePokemon(name)

  if (isLoading) {
    return (
      <div className="pokemon-card pokemon-card--loading">
        <div className="pokemon-card__spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="pokemon-card pokemon-card--error">
        <p>Could not load Pokémon data.</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name}
        className="pokemon-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
      >
        <div className="pokemon-card__identity">
          {data.sprite && (
            <motion.img
              className="pokemon-card__sprite"
              src={data.sprite}
              alt={data.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            />
          )}
          <div className="pokemon-card__info">
            <h2 className="pokemon-card__name">{data.name}</h2>
            <div className="pokemon-card__types">
              {data.types.map(type => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>
          </div>
        </div>

        <MatchupDisplay selectedTypes={data.types} />
      </motion.div>
    </AnimatePresence>
  )
}

export default function PokemonPage() {
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  return (
    <div className="page pokemon-page">
      <SEO
        title="Pokédex"
        description="Search any Pokémon by name and instantly see its type weaknesses, resistances, and immunities. Powered by PokéAPI."
        path="/pokemon"
      />
      <div className="page__header">
        <h1 className="page__title">Search a Pokémon</h1>
        <p className="page__subtitle">Find any Pokémon and see its type matchups</p>
      </div>

      <PokemonSearch onSelect={setSelectedPokemon} />

      {selectedPokemon && (
        <PokemonCard name={selectedPokemon} />
      )}
    </div>
  )
}
