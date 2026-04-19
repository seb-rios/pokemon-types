import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTeams, useDeleteTeam } from '../hooks/useTeams'
import TeamCard from '../components/teams/TeamCard'
import SEO from '../components/SEO'

const FREE_TEAM_LIMIT = 4

function TeamCardSkeleton() {
  return (
    <div className="team-card team-card--skeleton">
      <div className="team-card__header">
        <div className="skeleton team-card__skeleton-name" />
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => <div key={i} className="skeleton team-card__skeleton-btn" />)}
        </div>
      </div>
      <div className="team-card__sprites">
        {Array(6).fill(null).map((_, i) => (
          <div key={i} className="skeleton team-card__empty-sprite" />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {[52, 62, 48, 58].map((w, i) => (
          <div key={i} className="skeleton team-card__skeleton-type" style={{ width: w }} />
        ))}
      </div>
    </div>
  )
}

export default function TeamsPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { data: teams = [], isLoading } = useTeams()
  const deleteTeam = useDeleteTeam()
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true })
  }, [user, loading])

  async function handleDelete(id) {
    if (!confirm('Delete this team?')) return
    await deleteTeam.mutateAsync(id)
  }

  async function handleShare(team) {
    const url = `${window.location.origin}/teams/share/${team.share_token}`
    await navigator.clipboard.writeText(url)
    setShareMsg('Link copied!')
    setTimeout(() => setShareMsg(''), 2500)
  }

  const atLimit = teams.length >= FREE_TEAM_LIMIT

  if (loading || (!user && !loading)) return null

  return (
    <>
      <SEO title="My Teams — PokéTypeDex" />
      <div className="page">
        <div className="page__header teams-page__header">
          <div>
            <h1 className="page__title">
              <Users size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              My Teams
            </h1>
            <p className="page__subtitle">
              {teams.length} / {FREE_TEAM_LIMIT} teams used
            </p>
          </div>
          <div className="teams-page__new-wrap">
            {atLimit && (
              <span className="teams-page__limit-badge">Free limit reached</span>
            )}
            <Link
              to={atLimit ? '#' : '/teams/new'}
              className={`teams-page__new-btn ${atLimit ? 'teams-page__new-btn--disabled' : ''}`}
              aria-disabled={atLimit}
              onClick={e => atLimit && e.preventDefault()}
            >
              <Plus size={16} /> New Team
            </Link>
          </div>
        </div>

        {shareMsg && <div className="teams-page__toast">{shareMsg}</div>}

        {isLoading ? (
          <div className="teams-grid">
            <TeamCardSkeleton /><TeamCardSkeleton /><TeamCardSkeleton />
          </div>
        ) : teams.length === 0 ? (
          <div className="teams-page__empty">
            <p>No teams yet. Build your first team!</p>
            <Link to="/teams/new" className="teams-page__new-btn">
              <Plus size={16} /> New Team
            </Link>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
