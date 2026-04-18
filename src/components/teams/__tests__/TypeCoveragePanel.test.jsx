import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TypeCoveragePanel from '../TypeCoveragePanel'

const emptySlots = Array(6).fill(null)

describe('TypeCoveragePanel', () => {
  it('returns null when no slots are filled', () => {
    const { container } = render(<TypeCoveragePanel slots={emptySlots} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when at least one slot is filled', () => {
    const slots = [{ pokemon_types: ['fire', 'flying'] }, ...Array(5).fill(null)]
    render(<TypeCoveragePanel slots={slots} />)
    expect(screen.getByText('Type Coverage')).toBeInTheDocument()
  })

  it('shows warning banner when ≥3 members share a weakness', () => {
    // 3 fire/flying all weak to rock
    const slots = [
      { pokemon_types: ['fire', 'flying'] },
      { pokemon_types: ['fire', 'flying'] },
      { pokemon_types: ['fire', 'flying'] },
      null, null, null,
    ]
    render(<TypeCoveragePanel slots={slots} />)
    expect(screen.getByText(/Critical weaknesses/i)).toBeInTheDocument()
    expect(screen.getByText(/3\+ members/i)).toBeInTheDocument()
  })

  it('does not show warning banner when fewer than 3 members share a weakness', () => {
    const slots = [
      { pokemon_types: ['fire', 'flying'] },
      { pokemon_types: ['water', 'steel'] },
      null, null, null, null,
    ]
    render(<TypeCoveragePanel slots={slots} />)
    expect(screen.queryByText(/Critical weaknesses/i)).toBeNull()
  })

  it('renders 18 type rows', () => {
    const slots = [{ pokemon_types: ['fire'] }, ...Array(5).fill(null)]
    const { container } = render(<TypeCoveragePanel slots={slots} />)
    const rows = container.querySelectorAll('.type-coverage-row')
    expect(rows).toHaveLength(18)
  })

  it('handles mixed null/filled slots without crashing', () => {
    const slots = [null, { pokemon_types: ['water'] }, null, null, null, null]
    expect(() => render(<TypeCoveragePanel slots={slots} />)).not.toThrow()
  })
})
