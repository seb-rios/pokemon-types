import { getTeamTypeCoverage } from '../../utils/teamAnalysis'
import TypeBadge from '../TypeBadge'

export default function TypeCoveragePanel({ slots }) {
  const coverage = getTeamTypeCoverage(slots)
  const filledCount = slots.filter(s => s?.pokemon_types?.length).length

  if (!filledCount) return null

  const criticalGaps = coverage.filter(c => c.weakCount >= 3)

  const weakAgainst = coverage
    .filter(c => c.weakCount >= Math.max(2, Math.ceil(filledCount * 0.34)))
    .sort((a, b) => b.weakCount - a.weakCount)

  const strongAgainst = coverage
    .filter(c => (c.resistCount + c.immuneCount) >= Math.ceil(filledCount * 0.5))
    .sort((a, b) => (b.resistCount + b.immuneCount) - (a.resistCount + a.immuneCount))

  return (
    <div className="analysis-panel">
      <h3 className="analysis-panel__title">Type Coverage</h3>

      {criticalGaps.length > 0 && (
        <div className="analysis-panel__warning">
          <span className="analysis-panel__warning-icon">⚠</span>
          <span>Critical weaknesses ({criticalGaps.map(g => g.type).join(', ')}) affect 3+ members</span>
        </div>
      )}

      <div className="type-coverage-split">
        <div className="type-coverage-col">
          <p className="type-coverage-col__label type-coverage-col__label--weak">Weak against ↓</p>
          <div className="type-coverage-badges">
            {weakAgainst.length === 0 ? (
              <span className="type-coverage-none">None critical</span>
            ) : (
              weakAgainst.map(({ type, weakCount }) => (
                <div key={type} className="type-coverage-badge-item">
                  <TypeBadge type={type} size="sm" />
                  <span className="type-coverage-badge-count type-coverage-badge-count--weak">
                    ×{weakCount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="type-coverage-col">
          <p className="type-coverage-col__label type-coverage-col__label--strong">Strong against ↑</p>
          <div className="type-coverage-badges">
            {strongAgainst.length === 0 ? (
              <span className="type-coverage-none">Add more Pokémon</span>
            ) : (
              strongAgainst.map(({ type, resistCount, immuneCount }) => (
                <div key={type} className="type-coverage-badge-item">
                  <TypeBadge type={type} size="sm" />
                  <span className="type-coverage-badge-count type-coverage-badge-count--strong">
                    ×{resistCount + immuneCount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
