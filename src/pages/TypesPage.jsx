import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TypeGrid from '../components/TypeGrid'
import MatchupDisplay from '../components/MatchupDisplay'
import Toast, { useToast } from '../components/Toast'
import { TYPES } from '../data/typeChart'
import SEO from '../components/SEO'

export default function TypesPage() {
  const [searchParams] = useSearchParams()
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const t = searchParams.get('type')
    return t && TYPES.includes(t) ? [t] : []
  })
  const { toast, showToast } = useToast()

  return (
    <div className="page types-page">
      <SEO
        title="Type Chart"
        description="Full Pokémon type effectiveness chart. See offensive and defensive matchups for all 18 types — Fire, Water, Grass, Psychic, Dragon, and more."
        path="/types"
      />
      <div className="page__header">
        <h1 className="page__title">Select your Pokémon's type(s)</h1>
        <p className="page__subtitle">Choose up to 2 types to see type matchups instantly</p>
      </div>

      <TypeGrid
        selectedTypes={selectedTypes}
        onSelect={setSelectedTypes}
        onToast={showToast}
      />

      {selectedTypes.length > 0 && (
        <MatchupDisplay selectedTypes={selectedTypes} />
      )}

      <Toast message={toast} />
    </div>
  )
}
