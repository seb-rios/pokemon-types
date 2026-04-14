import { motion, AnimatePresence } from 'framer-motion'
import PokemonSearch from '../PokemonSearch'
import { usePokemon } from '../../hooks/usePokemon'
import TypeBadge from '../TypeBadge'

export default function PokemonSlot({ label, selectedName, onSelect }) {
  const { data, isLoading } = usePokemon(selectedName)

  return (
    <div className="pokemon-slot">
      <p className="pokemon-slot__label">{label}</p>
      <PokemonSearch onSelect={onSelect} />
      <AnimatePresence mode="wait">
        {isLoading && selectedName && (
          <motion.div
            key="loading"
            className="pokemon-slot__loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pokemon-card__spinner" />
          </motion.div>
        )}
        {data && !isLoading && (
          <motion.div
            key={data.name}
            className="pokemon-slot__card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
          >
            {data.sprite && (
              <img
                className="pokemon-slot__sprite"
                src={data.sprite}
                alt={data.name}
              />
            )}
            <div className="pokemon-slot__info">
              <p className="pokemon-slot__name">{data.name}</p>
              <div className="pokemon-slot__types">
                {data.types.map(t => <TypeBadge key={t} type={t} size="md" />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
