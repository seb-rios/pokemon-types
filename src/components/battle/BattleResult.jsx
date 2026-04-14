import { motion } from 'framer-motion'
import { getTypeAdvantageScore } from '../../utils/matchupCalc'
import { TYPE_COLORS } from '../../data/typeColors'
import AdvantageBar from './AdvantageBar'
import StatsBars from './StatsBars'
import TypeMatchupBreakdown from './TypeMatchupBreakdown'
import PokemonDescription from './PokemonDescription'

export default function BattleResult({ pokemonA, pokemonB }) {
  const scoreA = getTypeAdvantageScore(pokemonA.types, pokemonB.types)
  const scoreB = getTypeAdvantageScore(pokemonB.types, pokemonA.types)
  const colorA = TYPE_COLORS[pokemonA.types[0]] || '#888'
  const colorB = TYPE_COLORS[pokemonB.types[0]] || '#888'

  return (
    <motion.div
      className="battle-result"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="battle-result__section">
        <AdvantageBar
          scoreA={scoreA}
          scoreB={scoreB}
          nameA={pokemonA.name}
          nameB={pokemonB.name}
          colorA={colorA}
          colorB={colorB}
        />
      </div>

      <div className="battle-result__columns">
        <div className="battle-result__panel">
          <h3 className="battle-result__panel-title">Type Matchup</h3>
          <TypeMatchupBreakdown pokemonA={pokemonA} pokemonB={pokemonB} />
        </div>
        <div className="battle-result__panel">
          <h3 className="battle-result__panel-title">Base Stats</h3>
          <StatsBars
            statsA={pokemonA.stats}
            statsB={pokemonB.stats}
            colorA={colorA}
            colorB={colorB}
          />
        </div>
      </div>

      <div className="battle-result__descriptions">
        <PokemonDescription pokemonId={pokemonA.id} pokemonName={pokemonA.name} />
        <PokemonDescription pokemonId={pokemonB.id} pokemonName={pokemonB.name} />
      </div>
    </motion.div>
  )
}
