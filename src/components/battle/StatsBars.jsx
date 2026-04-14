import { motion } from 'framer-motion'

const STAT_LABELS = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed': 'Speed',
}
const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']

export default function StatsBars({ statsA, statsB, colorA, colorB }) {
  const getVal = (stats, name) => stats?.find(s => s.name === name)?.value ?? 0

  return (
    <div className="stats-bars">
      {STAT_ORDER.map((statName, index) => {
        const valA = getVal(statsA, statName)
        const valB = getVal(statsB, statName)
        return (
          <div key={statName} className="stats-bars__row">
            <span className="stats-bars__label">{STAT_LABELS[statName]}</span>
            <div className="stats-bars__pair">
              <div className="stats-bars__bar-wrapper">
                <div className="stats-bars__track">
                  <motion.div
                    className="stats-bars__bar"
                    style={{ background: colorA }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(valA / 255) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                  />
                </div>
                <span className="stats-bars__value">{valA}</span>
              </div>
              <div className="stats-bars__bar-wrapper">
                <div className="stats-bars__track">
                  <motion.div
                    className="stats-bars__bar"
                    style={{ background: colorB }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(valB / 255) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 + 0.025, ease: 'easeOut' }}
                  />
                </div>
                <span className="stats-bars__value">{valB}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
