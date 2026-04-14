import { motion } from 'framer-motion'
import { usePokemonSpecies } from '../../hooks/usePokemonSpecies'

export default function PokemonDescription({ pokemonId, pokemonName }) {
  const { data, isLoading } = usePokemonSpecies(pokemonId)

  if (isLoading) {
    return (
      <div className="pokemon-desc pokemon-desc--loading">
        <div className="pokemon-card__spinner" />
      </div>
    )
  }

  if (!data?.flavorText) return null

  return (
    <motion.div
      className="pokemon-desc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="pokemon-desc__name">{pokemonName}</p>
      <p className="pokemon-desc__text">{data.flavorText}</p>
    </motion.div>
  )
}
