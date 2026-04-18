import { getTeamStatTotals } from '../../utils/teamAnalysis'

const STAT_LABELS = {
  'hp': 'HP',
  'attack': 'Atk',
  'defense': 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  'speed': 'Spe',
}

const STAT_COLORS = {
  'hp': '#6bba6b',
  'attack': '#e87a6b',
  'defense': '#e8c56b',
  'special-attack': '#7a9de8',
  'special-defense': '#a87ae8',
  'speed': '#e87ac8',
}

export default function StatOverviewPanel({ slots }) {
  const stats = getTeamStatTotals(slots)
  const filledCount = slots.filter(s => s.stats?.length).length
  if (!filledCount) return null

  const maxAvg = Math.max(...stats.map(s => s.avg), 1)

  return (
    <div className="analysis-panel">
      <h3 className="analysis-panel__title">Team Stats (avg)</h3>
      <div className="stat-overview">
        {stats.map(({ name, avg }) => (
          <div key={name} className="stat-overview-row">
            <span className="stat-overview-label">{STAT_LABELS[name] ?? name}</span>
            <div className="stat-overview-bar-track">
              <div
                className="stat-overview-bar"
                style={{
                  width: `${(avg / maxAvg) * 100}%`,
                  background: STAT_COLORS[name] ?? '#94a3b8',
                }}
              />
            </div>
            <span className="stat-overview-value">{avg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
