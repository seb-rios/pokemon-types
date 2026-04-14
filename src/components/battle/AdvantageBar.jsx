import { motion } from 'framer-motion'

function getLabel(pct, nameA, nameB, scoreA, scoreB) {
  if (scoreA === 0 && scoreB === 0) return 'Even matchup'
  if (scoreA === 0) return `${nameB} has total type immunity`
  if (scoreB === 0) return `${nameA} has total type immunity`
  if (pct >= 0.45 && pct <= 0.55) return 'Even matchup'
  if (pct > 0.55 && pct <= 0.70) return `${nameA} has a slight type advantage`
  if (pct < 0.45 && pct >= 0.30) return `${nameB} has a slight type advantage`
  if (pct > 0.70 && pct <= 0.85) return `${nameA} has a moderate type advantage`
  if (pct < 0.30 && pct >= 0.15) return `${nameB} has a moderate type advantage`
  if (pct > 0.85) return `${nameA} has a strong type advantage`
  return `${nameB} has a strong type advantage`
}

function formatMultiplier(score) {
  if (score === 0) return '0×'
  if (score === 0.25) return '¼×'
  if (score === 0.5) return '½×'
  if (score === 1) return '1×'
  if (score === 2) return '2×'
  if (score === 4) return '4×'
  return `${score}×`
}

export default function AdvantageBar({ scoreA, scoreB, nameA, nameB, colorA, colorB }) {
  const bothZero = scoreA === 0 && scoreB === 0
  const advantagePercent = bothZero ? 0.5 : scoreA / (scoreA + scoreB)
  const label = getLabel(advantagePercent, nameA, nameB, scoreA, scoreB)

  return (
    <div className="advantage-bar">
      <div className="advantage-bar__names">
        <span className="advantage-bar__name">{nameA}</span>
        <span className="advantage-bar__name">{nameB}</span>
      </div>
      <div className="advantage-bar__track">
        <motion.div
          className="advantage-bar__fill advantage-bar__fill--a"
          style={{ background: colorA }}
          initial={{ width: '50%' }}
          animate={{ width: `${advantagePercent * 100}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        />
        <motion.div
          className="advantage-bar__fill advantage-bar__fill--b"
          style={{ background: colorB }}
          initial={{ width: '50%' }}
          animate={{ width: `${(1 - advantagePercent) * 100}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        />
      </div>
      <div className="advantage-bar__label">{label}</div>
      <div className="advantage-bar__scores">
        <span className="advantage-bar__score">{formatMultiplier(scoreA)} effective</span>
        <span className="advantage-bar__score">{formatMultiplier(scoreB)} effective</span>
      </div>
    </div>
  )
}
