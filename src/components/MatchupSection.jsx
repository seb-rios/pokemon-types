import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TypeBadge from './TypeBadge'
import { groupMatchups } from '../utils/matchupCalc'

const OFFENSIVE_LABELS = {
  quadruple: { label: 'Super Effective', sub: '4×', className: 'matchup-group--quad' },
  double:    { label: 'Super Effective', sub: '2×', className: 'matchup-group--double' },
  half:      { label: 'Not Very Effective', sub: '½×', className: 'matchup-group--half' },
  quarter:   { label: 'Not Very Effective', sub: '¼×', className: 'matchup-group--quarter' },
  immune:    { label: 'No Effect', sub: '0×', className: 'matchup-group--immune' },
}

const DEFENSIVE_LABELS = {
  quadruple: { label: 'Weak to', sub: '4×', className: 'matchup-group--quad' },
  double:    { label: 'Weak to', sub: '2×', className: 'matchup-group--double' },
  half:      { label: 'Resists', sub: '½×', className: 'matchup-group--half' },
  quarter:   { label: 'Resists', sub: '¼×', className: 'matchup-group--quarter' },
  immune:    { label: 'Immune', sub: '0×', className: 'matchup-group--immune' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
}

function MultiplierGroup({ types, multiplier, label, sub, className }) {
  if (types.length === 0) return null
  return (
    <motion.div className={`matchup-group ${className}`} variants={itemVariants}>
      <div className="matchup-group__header">
        <span className="matchup-group__label">{label}</span>
        <span className={`matchup-group__multiplier matchup-group__multiplier--${className.replace('matchup-group--', '')}`}>
          {sub}
        </span>
      </div>
      <div className="matchup-group__badges">
        {types.map(({ type }) => (
          <TypeBadge key={type} type={type} size="sm" />
        ))}
      </div>
    </motion.div>
  )
}

export default function MatchupSection({ title, matchups, mode }) {
  const [showNeutral, setShowNeutral] = useState(false)
  const grouped = groupMatchups(matchups)
  const labels = mode === 'offensive' ? OFFENSIVE_LABELS : DEFENSIVE_LABELS

  return (
    <div className="matchup-section">
      <h3 className="matchup-section__title">{title}</h3>
      <motion.div
        className="matchup-section__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MultiplierGroup
          types={grouped.quadruple}
          multiplier={4}
          label={labels.quadruple.label}
          sub={labels.quadruple.sub}
          className={labels.quadruple.className}
        />
        <MultiplierGroup
          types={grouped.double}
          multiplier={2}
          label={labels.double.label}
          sub={labels.double.sub}
          className={labels.double.className}
        />
        <MultiplierGroup
          types={grouped.half}
          multiplier={0.5}
          label={labels.half.label}
          sub={labels.half.sub}
          className={labels.half.className}
        />
        <MultiplierGroup
          types={grouped.quarter}
          multiplier={0.25}
          label={labels.quarter.label}
          sub={labels.quarter.sub}
          className={labels.quarter.className}
        />
        <MultiplierGroup
          types={grouped.immune}
          multiplier={0}
          label={labels.immune.label}
          sub={labels.immune.sub}
          className={labels.immune.className}
        />

        {grouped.neutral.length > 0 && (
          <motion.div className="matchup-group matchup-group--neutral" variants={itemVariants}>
            <button
              className="matchup-group__neutral-toggle"
              onClick={() => setShowNeutral(v => !v)}
            >
              <span>Normal Effectiveness (1×)</span>
              <span className="matchup-group__neutral-count">
                {grouped.neutral.length} types {showNeutral ? '▲' : '▼'}
              </span>
            </button>
            <AnimatePresence>
              {showNeutral && (
                <motion.div
                  className="matchup-group__badges"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {grouped.neutral.map(({ type }) => (
                    <TypeBadge key={type} type={type} size="sm" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
