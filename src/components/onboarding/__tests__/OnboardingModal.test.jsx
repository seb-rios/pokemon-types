import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OnboardingModal from '../OnboardingModal'

function renderModal(props = {}) {
  return render(<OnboardingModal isOpen={true} onClose={vi.fn()} {...props} />)
}

describe('OnboardingModal', () => {
  it('renders step 1 content by default', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: 'Type Chart' })).toBeInTheDocument()
    expect(screen.getByText('🗂️')).toBeInTheDocument()
  })

  it('does not render when isOpen=false', () => {
    const { container } = render(<OnboardingModal isOpen={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('"Next" advances to step 2', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByRole('heading', { name: 'Pokédex Search' })).toBeInTheDocument()
  })

  it('"Back" is absent on step 1', () => {
    renderModal()
    expect(screen.queryByRole('button', { name: /back/i })).toBeNull()
  })

  it('"Back" is present on step 2', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('"Back" returns to step 1', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await screen.findByRole('heading', { name: 'Pokédex Search' })
    await userEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(await screen.findByRole('heading', { name: 'Type Chart' })).toBeInTheDocument()
  })

  it('"Get Started" appears only on step 4', async () => {
    renderModal()
    expect(screen.queryByRole('button', { name: /get started/i })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^next$/i })).toBeNull()
  })

  it('"Get Started" calls onClose', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    for (let i = 0; i < 3; i++) {
      await userEvent.click(screen.getByRole('button', { name: /next/i }))
    }
    await userEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('"Skip" calls onClose', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    await userEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('X button calls onClose', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking the overlay calls onClose', async () => {
    const onClose = vi.fn()
    const { container } = renderModal({ onClose })
    await userEvent.click(container.querySelector('.onboarding-modal-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking inside the modal does NOT call onClose', async () => {
    const onClose = vi.fn()
    const { container } = renderModal({ onClose })
    await userEvent.click(container.querySelector('.onboarding-modal'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('clicking a dot navigates to that step', async () => {
    renderModal()
    const dots = screen.getAllByRole('button', { name: /go to step/i })
    await userEvent.click(dots[2])
    expect(await screen.findByRole('heading', { name: 'Battle Simulator' })).toBeInTheDocument()
  })

  it('renders 4 step indicator dots', () => {
    renderModal()
    const dots = screen.getAllByRole('button', { name: /go to step/i })
    expect(dots).toHaveLength(4)
  })
})
