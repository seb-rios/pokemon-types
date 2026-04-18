import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TypeBadge from '../TypeBadge'

describe('TypeBadge', () => {
  it('renders the type label uppercased', () => {
    render(<TypeBadge type="fire" />)
    expect(screen.getByText('FIRE')).toBeInTheDocument()
  })

  it('applies the md size class by default', () => {
    const { container } = render(<TypeBadge type="water" />)
    expect(container.firstChild).toHaveClass('type-badge--md')
  })

  it('applies sm size class when size="sm"', () => {
    const { container } = render(<TypeBadge type="water" size="sm" />)
    expect(container.firstChild).toHaveClass('type-badge--sm')
  })

  it('applies lg size class when size="lg"', () => {
    const { container } = render(<TypeBadge type="water" size="lg" />)
    expect(container.firstChild).toHaveClass('type-badge--lg')
  })

  it('renders type-badge base class', () => {
    const { container } = render(<TypeBadge type="grass" />)
    expect(container.firstChild).toHaveClass('type-badge')
  })

  it('renders without crashing for all 18 types', () => {
    const types = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy']
    types.forEach(type => {
      expect(() => render(<TypeBadge type={type} />)).not.toThrow()
    })
  })
})
