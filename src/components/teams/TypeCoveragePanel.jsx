import { getTeamTypeCoverage } from '../../utils/teamAnalysis'
import TypeBadge from '../TypeBadge'

export default function TypeCoveragePanel({ slots }) {
  const coverage = getTeamTypeCoverage(slots)
  const filledCount = slots.filter(s => s?.pokemon_types?.length).length

  if (!filledCount) return null

  const gaps = coverage.filter(c => c.weakCount >= 3)

  return (
    <div className="analysis-panel">
      <h3 className="analysis-panel__title">Type Coverage</h3>
      {gaps.length > 0 && (
        <div className="analysis-panel__warning">
          <span className="analysis-panel__warning-icon">⚠</span>
          <span>Critical weaknesses ({gaps.map(g => g.type).join(', ')}) affect 3+ members</span>
        </div>
      )}
      <div className="type-coverage-grid">
        {coverage.map(({ type, weakCount, resistCount, immuneCount }) => (
          <div key={type} className="type-coverage-row">
            <TypeBadge type={type} size="sm" />
            <div className="type-coverage-bars">
              {weakCount > 0 && (
                <span className="type-coverage-bar type-coverage-bar--weak" style={{ width: `${(weakCount / filledCount) * 100}%` }}>
                  {weakCount}w
                </span>
              )}
              {resistCount > 0 && (
                <span className="type-coverage-bar type-coverage-bar--resist" style={{ width: `${(resistCount / filledCount) * 100}%` }}>
                  {resistCount}r
                </span>
              )}
              {immuneCount > 0 && (
                <span className="type-coverage-bar type-coverage-bar--immune">
                  {immuneCount}✕
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="type-coverage-legend">
        <span className="type-coverage-bar type-coverage-bar--weak">w = weak</span>
        <span className="type-coverage-bar type-coverage-bar--resist">r = resist</span>
        <span className="type-coverage-bar type-coverage-bar--immune">✕ = immune</span>
      </div>
    </div>
  )
}
