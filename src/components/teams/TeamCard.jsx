import { Link } from 'react-router-dom'
import { Pencil, Trash2, Share2 } from 'lucide-react'
import TypeBadge from '../TypeBadge'

function MiniSprite({ id }) {
  if (!id) return <div className="team-card__empty-sprite" />
  return (
    <img
      className="team-card__sprite"
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      alt=""
    />
  )
}

export default function TeamCard({ team, onDelete, onShare }) {
  const slots = team.team_slots ?? []
  const filledCount = slots.filter(s => s?.pokemon_id).length

  return (
    <div className="team-card">
      <div className="team-card__header">
        <h3 className="team-card__name">{team.name}</h3>
        <div className="team-card__actions">
          <button className="team-card__btn" onClick={() => onShare(team)} aria-label="Share team">
            <Share2 size={15} />
          </button>
          <Link to={`/teams/${team.id}/edit`} className="team-card__btn" aria-label="Edit team">
            <Pencil size={15} />
          </Link>
          <button className="team-card__btn team-card__btn--danger" onClick={() => onDelete(team.id)} aria-label="Delete team">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="team-card__sprites">
        {Array.from({ length: 6 }).map((_, i) => (
          <MiniSprite key={i} id={slots[i]?.pokemon_id} />
        ))}
      </div>

      <div className="team-card__meta">
        <span className="team-card__member-count">{filledCount}/6</span>
      </div>

      <div className="team-card__types">
        {slots.flatMap(s => s.pokemon_types ?? [])
          .filter((t, i, arr) => arr.indexOf(t) === i)
          .slice(0, 8)
          .map(t => <TypeBadge key={t} type={t} size="sm" iconOnly />)}
      </div>
    </div>
  )
}
