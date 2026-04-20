import { Sparkles, AlertTriangle } from 'lucide-react'
import TypeBadge from '../TypeBadge'

const ALL_TYPES = ['fire','water','grass','electric','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy','normal']

function GapItem({ text }) {
  const lower = text.toLowerCase()
  const found = ALL_TYPES.filter(t => lower.includes(t))
  return (
    <li className="ai-gap-item">
      {found.length > 0 && (
        <div className="ai-gap-badges">
          {found.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </div>
      )}
      <span className="ai-gap-text">{text}</span>
    </li>
  )
}

export default function AIAnalysisPanel({ analysis, isLoading }) {
  if (isLoading) {
    return (
      <div className="analysis-panel analysis-panel--ai">
        <h3 className="analysis-panel__title"><Sparkles size={16} /> AI Analysis</h3>
        <div className="ai-analysis-loading">
          <div className="ai-analysis-spinner" />
          <span>Analyzing your team…</span>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="analysis-panel analysis-panel--ai">
      <h3 className="analysis-panel__title"><Sparkles size={16} /> AI Analysis</h3>

      <p className="ai-analysis-overall">{analysis.overall}</p>

      {analysis.type_gaps?.length > 0 && (
        <div className="ai-analysis-section">
          <h4 className="ai-analysis-section-title">
            <AlertTriangle size={14} /> Type Gaps
          </h4>
          <ul className="ai-analysis-list">
            {analysis.type_gaps.map((gap, i) => <GapItem key={i} text={gap} />)}
          </ul>
        </div>
      )}

      {analysis.role_balance && (
        <div className="ai-analysis-section">
          <h4 className="ai-analysis-section-title">Role Balance</h4>
          <div className="ai-role-chips">
            <span className="ai-role-chip ai-role-chip--attacker">⚔ {analysis.role_balance.attackers} Attacker{analysis.role_balance.attackers !== 1 ? 's' : ''}</span>
            <span className="ai-role-chip ai-role-chip--tank">🛡 {analysis.role_balance.tanks} Tank{analysis.role_balance.tanks !== 1 ? 's' : ''}</span>
            <span className="ai-role-chip ai-role-chip--support">✦ {analysis.role_balance.support} Support</span>
          </div>
        </div>
      )}

      {analysis.suggestions?.length > 0 && (
        <div className="ai-analysis-section">
          <h4 className="ai-analysis-section-title">Suggestions</h4>
          <ul className="ai-analysis-suggestions">
            {analysis.suggestions.map((s, i) => (
              <li key={i}>
                <span className="ai-suggestion-pokemon">{s.pokemon}</span>
                <span className="ai-suggestion-tip">{s.tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.synergy_notes && (
        <div className="ai-analysis-section">
          <h4 className="ai-analysis-section-title">Synergy</h4>
          <p className="ai-analysis-synergy">{analysis.synergy_notes}</p>
        </div>
      )}
    </div>
  )
}
