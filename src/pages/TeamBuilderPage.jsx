import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTeam, useCreateTeam, useUpdateTeam } from '../hooks/useTeams'
import { supabase } from '../lib/supabase'
import SlotGrid from '../components/teams/SlotGrid'
import SlotEditor from '../components/teams/SlotEditor'
import SlotWizard from '../components/teams/SlotWizard'
import TypeCoveragePanel from '../components/teams/TypeCoveragePanel'
import StatOverviewPanel from '../components/teams/StatOverviewPanel'
import AIAnalysisPanel from '../components/teams/AIAnalysisPanel'
import SEO from '../components/SEO'

const EMPTY_SLOTS = Array.from({ length: 6 }, () => null)

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

export default function TeamBuilderPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const { data: existingTeam } = useTeam(id)
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  const isMobile = useIsMobile()

  const [teamName, setTeamName] = useState('My Team')
  const [slots, setSlots] = useState(EMPTY_SLOTS)
  const [activeSlot, setActiveSlot] = useState(null)
  const [wizardStep, setWizardStep] = useState(0)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true })
  }, [user, loading])

  // Load existing team into state
  useEffect(() => {
    if (existingTeam) {
      setTeamName(existingTeam.name)
      setAiAnalysis(existingTeam.ai_analysis ?? null)
      const loaded = Array.from({ length: 6 }, (_, i) => {
        const s = existingTeam.team_slots?.find(sl => sl.slot_index === i)
        return s ?? null
      })
      setSlots(loaded)
    }
  }, [existingTeam])

  const handleSlotChange = useCallback((index, data) => {
    setSlots(prev => {
      const next = [...prev]
      next[index] = data
      return next
    })
  }, [])

  // Auto-trigger AI analysis when all 6 slots are filled
  const allFilled = slots.every(s => s?.pokemon_name)
  useEffect(() => {
    if (!allFilled || aiAnalysis || aiLoading) return
    runAiAnalysis()
  }, [allFilled])

  async function runAiAnalysis() {
    setAiLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('analyze-team', {
        body: { team: { name: teamName, slots } },
      })
      if (error) throw error
      setAiAnalysis(data.analysis)
    } catch (e) {
      console.error('AI analysis failed:', e)
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSave() {
    setSaveError('')
    const filledSlots = slots.map((s, i) => ({
      slot_index: i,
      pokemon_id: s?.pokemon_id ?? null,
      pokemon_name: s?.pokemon_name ?? null,
      pokemon_types: s?.pokemon_types ?? null,
      item_id: s?.item_id ?? null,
      item_name: s?.item_name ?? null,
      item_sprite: s?.item_sprite ?? null,
      moves: s?.moves ?? [],
      stats: s?.stats ?? [],
    }))

    try {
      if (isEdit) {
        await updateTeam.mutateAsync({ id, name: teamName, slots: filledSlots })
        // Save AI analysis if available
        if (aiAnalysis) {
          await supabase.from('teams').update({
            ai_analysis: aiAnalysis,
            ai_analyzed_at: new Date().toISOString(),
          }).eq('id', id)
        }
      } else {
        const team = await createTeam.mutateAsync({ name: teamName, slots: filledSlots })
        if (aiAnalysis) {
          await supabase.from('teams').update({
            ai_analysis: aiAnalysis,
            ai_analyzed_at: new Date().toISOString(),
          }).eq('id', team.id)
        }
      }
      navigate('/teams')
    } catch (e) {
      setSaveError(e.message)
    }
  }

  if (loading || (!user && !loading)) return null

  const isSaving = createTeam.isPending || updateTeam.isPending

  return (
    <>
      <SEO title={`${isEdit ? 'Edit' : 'New'} Team — PokéTypeDex`} />
      <div className="page team-builder-page">
        {/* Header */}
        <div className="team-builder__header">
          <button className="team-builder__back" onClick={() => navigate('/teams')}>
            <ChevronLeft size={18} /> Teams
          </button>
          <input
            className="team-builder__name-input"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="Team name…"
            maxLength={40}
          />
          <button
            className="team-builder__save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} /> {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {saveError && <p className="team-builder__error">{saveError}</p>}

        {/* Responsive builder */}
        {isMobile ? (
          <SlotWizard
            slots={slots}
            currentStep={wizardStep}
            onStepChange={setWizardStep}
            onSlotChange={handleSlotChange}
          />
        ) : (
          <div className="team-builder__desktop">
            <div className="team-builder__left">
              <SlotGrid
                slots={slots}
                activeSlot={activeSlot}
                onSlotClick={setActiveSlot}
              />
            </div>
            <div className="team-builder__right">
              {activeSlot !== null ? (
                <SlotEditor
                  key={activeSlot}
                  slotIndex={activeSlot}
                  slot={slots[activeSlot]}
                  onChange={handleSlotChange}
                  onClose={() => setActiveSlot(null)}
                />
              ) : (
                <div className="team-builder__hint">
                  Click a slot to add or edit a Pokémon
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis panels */}
        <div className="team-builder__analysis">
          <TypeCoveragePanel slots={slots} />
          <StatOverviewPanel slots={slots} />
          {(allFilled || aiAnalysis || aiLoading) && (
            <AIAnalysisPanel analysis={aiAnalysis} isLoading={aiLoading} />
          )}
        </div>
      </div>
    </>
  )
}
