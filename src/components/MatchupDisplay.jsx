import { motion } from 'framer-motion'
import TypeBadge from './TypeBadge'
import MatchupSection from './MatchupSection'
import { getOffensiveMatchups, getDefensiveMatchups } from '../utils/matchupCalc'

export default function MatchupDisplay({ selectedTypes }) {
  if (!selectedTypes || selectedTypes.length === 0) return null

  const offensiveMatchups = getOffensiveMatchups(selectedTypes)
  const defensiveMatchups = getDefensiveMatchups(selectedTypes)

  return (
    <motion.div
      className="matchup-display"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="matchup-display__selected-types">
        {selectedTypes.map(type => (
          <TypeBadge key={type} type={type} size="md" />
        ))}
      </div>

      <div className="matchup-display__panels">
        <div className="matchup-display__panel">
          <MatchupSection
            title="⚔️ Offensive"
            matchups={offensiveMatchups}
            mode="offensive"
          />
        </div>
        <div className="matchup-display__panel">
          <MatchupSection
            title="🛡️ Defensive"
            matchups={defensiveMatchups}
            mode="defensive"
          />
        </div>
      </div>
    </motion.div>
  )
}
