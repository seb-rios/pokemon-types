import { Link, useParams } from 'react-router-dom'
import { useSharedTeam } from '../hooks/useTeams'
import { useAuth } from '../context/AuthContext'
import TypeBadge from '../components/TypeBadge'
import TypeCoveragePanel from '../components/teams/TypeCoveragePanel'
import StatOverviewPanel from '../components/teams/StatOverviewPanel'
import AIAnalysisPanel from '../components/teams/AIAnalysisPanel'
import SEO from '../components/SEO'

function SlotCard({ slot }) {
  if (!slot?.pokemon_name) return null
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${slot.pokemon_id}.png`

  return (
    <div className="shared-slot-card">
      <img className="shared-slot-card__sprite" src={spriteUrl} alt={slot.pokemon_name} />
      <div className="shared-slot-card__info">
        <span className="shared-slot-card__name">{slot.pokemon_name}</span>
        <div className="shared-slot-card__types">
          {slot.pokemon_types?.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </div>
        {slot.item_name && (
          <div className="shared-slot-card__item">
            {slot.item_sprite && <img src={slot.item_sprite} alt={slot.item_name} width={16} />}
            <span>{slot.item_name}</span>
          </div>
        )}
        {slot.moves?.length > 0 && (
          <ul className="shared-slot-card__moves">
            {slot.moves.map((m, i) => (
              <li key={i}>
                <TypeBadge type={m.type} size="sm" />
                <span>{m.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function SharedTeamPage() {
  const { shareToken } = useParams()
  const { user } = useAuth()
  const { data, isLoading, isError } = useSharedTeam(shareToken)

  if (isLoading) return <div className="page"><p>Loading team…</p></div>
  if (isError || !data) return <div className="page"><p>Team not found.</p></div>

  const team = data.team
  const slots = (data.slots ?? []).sort((a, b) => a.slot_index - b.slot_index)

  return (
    <>
      <SEO title={`${team.name} — PokéTypeDex`} />
      <div className="page">
        <div className="shared-team__header">
          <h1 className="page__title">{team.name}</h1>
          <p className="page__subtitle">Shared team — read only</p>
        </div>

        <div className="shared-team__slots">
          {slots.map((slot, i) => <SlotCard key={i} slot={slot} />)}
        </div>

        <div className="team-builder__analysis">
          <TypeCoveragePanel slots={slots} />
          <StatOverviewPanel slots={slots} />
          {team.ai_analysis && <AIAnalysisPanel analysis={team.ai_analysis} />}
        </div>

        {!user && (
          <div className="shared-team__cta">
            <p>Want to build your own team?</p>
            <Link to="/" className="shared-team__cta-btn">Sign in to get started</Link>
          </div>
        )}
      </div>
    </>
  )
}
