import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ItemRecommendations from '../ItemRecommendations'
import { charizardFixture } from '../../../test/fixtures/pokemon'

vi.mock('../../../hooks/useItemRecommendations', () => ({
  useItemRecommendations: vi.fn(),
}))

import { useItemRecommendations } from '../../../hooks/useItemRecommendations'

const mockItems = [
  { id: 87,  name: 'Choice Specs', sprite: 'https://example.com/specs.png',  effect: 'Boosts Special Attack.' },
  { id: 10016, name: 'Choice Band', sprite: null, effect: 'Boosts Attack.' },
  { id: 234, name: 'Leftovers',    sprite: 'https://example.com/leftovers.png', effect: 'Restores HP each turn.' },
]

beforeEach(() => {
  useItemRecommendations.mockReturnValue({ recommendations: mockItems, isLoading: false })
})

describe('ItemRecommendations', () => {
  it('returns null when pokemon is null', () => {
    const { container } = render(<ItemRecommendations pokemon={null} onSelect={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows skeleton chips while loading', () => {
    useItemRecommendations.mockReturnValueOnce({ recommendations: [], isLoading: true })
    const { container } = render(<ItemRecommendations pokemon={charizardFixture} onSelect={vi.fn()} />)
    const skeletons = container.querySelectorAll('.item-chip--skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders item chips when loaded', () => {
    render(<ItemRecommendations pokemon={charizardFixture} onSelect={vi.fn()} />)
    expect(screen.getByText('Choice Specs')).toBeInTheDocument()
    expect(screen.getByText('Choice Band')).toBeInTheDocument()
    expect(screen.getByText('Leftovers')).toBeInTheDocument()
  })

  it('clicking a chip calls onSelect with the item', async () => {
    const onSelect = vi.fn()
    render(<ItemRecommendations pokemon={charizardFixture} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Choice Specs'))
    expect(onSelect).toHaveBeenCalledWith(mockItems[0])
  })

  it('shows sprite when sprite URL is present', () => {
    const { container } = render(<ItemRecommendations pokemon={charizardFixture} onSelect={vi.fn()} />)
    const sprites = container.querySelectorAll('.item-chip__sprite')
    expect(sprites[0]).toHaveAttribute('src', 'https://example.com/specs.png')
  })

  it('does not render an img when sprite is null', () => {
    const { container } = render(<ItemRecommendations pokemon={charizardFixture} onSelect={vi.fn()} />)
    // Choice Band has null sprite — only specs and leftovers have sprites
    const sprites = container.querySelectorAll('.item-chip__sprite')
    expect(sprites).toHaveLength(2)
  })

  it('chip title contains the item effect', () => {
    render(<ItemRecommendations pokemon={charizardFixture} onSelect={vi.fn()} />)
    const chip = screen.getByTitle('Boosts Special Attack.')
    expect(chip).toBeInTheDocument()
  })

  it('shows "Suggested" label', () => {
    render(<ItemRecommendations pokemon={charizardFixture} onSelect={vi.fn()} />)
    expect(screen.getByText('Suggested')).toBeInTheDocument()
  })
})
