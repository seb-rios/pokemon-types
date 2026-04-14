import TypeBadge from '../TypeBadge'
import { typeChart } from '../../data/typeChart'

function getMultiplierClass(m) {
  if (m === 0) return 'matchup-group__multiplier--immune'
  if (m === 0.25) return 'matchup-group__multiplier--quarter'
  if (m === 0.5) return 'matchup-group__multiplier--half'
  if (m === 2) return 'matchup-group__multiplier--double'
  if (m === 4) return 'matchup-group__multiplier--quad'
  return ''
}

function formatMultiplier(m) {
  if (m === 0) return '0×'
  if (m === 0.25) return '¼×'
  if (m === 0.5) return '½×'
  if (m === 1) return '1×'
  if (m === 2) return '2×'
  if (m === 4) return '4×'
  return `${m}×`
}

function MatchupPanel({ attackerName, attackerTypes, defenderName, defenderTypes }) {
  return (
    <div className="type-matchup-breakdown__panel">
      <p className="type-matchup-breakdown__subtitle">
        {attackerName} attacks {defenderName}
      </p>
      {attackerTypes.map(atkType => {
        const multiplier = defenderTypes.reduce(
          (acc, defType) => acc * (typeChart[atkType]?.[defType] ?? 1),
          1
        )
        return (
          <div key={atkType} className="type-matchup-breakdown__row">
            <TypeBadge type={atkType} size="sm" />
            <span className="type-matchup-breakdown__arrow">→</span>
            <div className="type-matchup-breakdown__vs">
              {defenderTypes.map(defType => (
                <TypeBadge key={defType} type={defType} size="sm" />
              ))}
            </div>
            <span className="type-matchup-breakdown__equals">=</span>
            <span className={`matchup-group__multiplier ${getMultiplierClass(multiplier)}`}>
              {formatMultiplier(multiplier)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function TypeMatchupBreakdown({ pokemonA, pokemonB }) {
  return (
    <div className="type-matchup-breakdown">
      <MatchupPanel
        attackerName={pokemonA.name}
        attackerTypes={pokemonA.types}
        defenderName={pokemonB.name}
        defenderTypes={pokemonB.types}
      />
      <MatchupPanel
        attackerName={pokemonB.name}
        attackerTypes={pokemonB.types}
        defenderName={pokemonA.name}
        defenderTypes={pokemonA.types}
      />
    </div>
  )
}
