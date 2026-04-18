import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AIAnalysisPanel from '../AIAnalysisPanel'
import { aiAnalysisFixture } from '../../../test/fixtures/team'

describe('AIAnalysisPanel', () => {
  it('returns null when analysis is absent and not loading', () => {
    const { container } = render(<AIAnalysisPanel />)
    expect(container.firstChild).toBeNull()
  })

  it('shows spinner when isLoading=true', () => {
    const { container } = render(<AIAnalysisPanel isLoading />)
    expect(container.querySelector('.ai-analysis-spinner')).toBeInTheDocument()
    expect(screen.getByText(/Analyzing your team/i)).toBeInTheDocument()
  })

  it('renders overall text when analysis provided', () => {
    render(<AIAnalysisPanel analysis={aiAnalysisFixture} />)
    expect(screen.getByText(aiAnalysisFixture.overall)).toBeInTheDocument()
  })

  it('renders type gaps section', () => {
    render(<AIAnalysisPanel analysis={aiAnalysisFixture} />)
    expect(screen.getByText('Type Gaps')).toBeInTheDocument()
    expect(screen.getByText(aiAnalysisFixture.type_gaps[0])).toBeInTheDocument()
  })

  it('renders role balance chips', () => {
    render(<AIAnalysisPanel analysis={aiAnalysisFixture} />)
    expect(screen.getByText('Role Balance')).toBeInTheDocument()
    expect(screen.getByText(/Attacker/)).toBeInTheDocument()
    expect(screen.getByText(/Tank/)).toBeInTheDocument()
    expect(screen.getByText(/Support/)).toBeInTheDocument()
  })

  it('renders suggestions', () => {
    render(<AIAnalysisPanel analysis={aiAnalysisFixture} />)
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
    expect(screen.getByText(aiAnalysisFixture.suggestions[0].pokemon)).toBeInTheDocument()
    expect(screen.getByText(aiAnalysisFixture.suggestions[0].tip)).toBeInTheDocument()
  })

  it('renders synergy notes', () => {
    render(<AIAnalysisPanel analysis={aiAnalysisFixture} />)
    expect(screen.getByText('Synergy')).toBeInTheDocument()
    expect(screen.getByText(aiAnalysisFixture.synergy_notes)).toBeInTheDocument()
  })

  it('skips type_gaps section when array is empty', () => {
    const analysis = { ...aiAnalysisFixture, type_gaps: [] }
    render(<AIAnalysisPanel analysis={analysis} />)
    expect(screen.queryByText('Type Gaps')).toBeNull()
  })

  it('skips suggestions section when array is empty', () => {
    const analysis = { ...aiAnalysisFixture, suggestions: [] }
    render(<AIAnalysisPanel analysis={analysis} />)
    expect(screen.queryByText('Suggestions')).toBeNull()
  })
})
