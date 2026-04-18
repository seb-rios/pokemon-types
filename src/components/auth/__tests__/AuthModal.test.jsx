import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthModal from '../AuthModal'

const mockSignInWithEmail = vi.fn().mockResolvedValue({ error: null })
const mockSignUpWithEmail = vi.fn().mockResolvedValue({ error: null })
const mockSignInWithProvider = vi.fn().mockResolvedValue({ error: null })
const mockResetPassword = vi.fn().mockResolvedValue({ error: null })

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    signInWithEmail: mockSignInWithEmail,
    signUpWithEmail: mockSignUpWithEmail,
    signInWithProvider: mockSignInWithProvider,
    resetPassword: mockResetPassword,
    user: null,
    loading: false,
  }),
}))

function renderModal(props = {}) {
  return render(<AuthModal isOpen={true} onClose={vi.fn()} {...props} />)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AuthModal', () => {
  it('renders sign-in form by default', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('does not render when isOpen=false', () => {
    const { container } = render(<AuthModal isOpen={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('"Forgot password?" switches to reset view', async () => {
    renderModal()
    await userEvent.click(screen.getByText('Forgot password?'))
    expect(screen.getByText('Reset password')).toBeInTheDocument()
  })

  it('"Sign up" link switches to signup view', async () => {
    renderModal()
    await userEvent.click(screen.getByText('Sign up'))
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
  })

  it('submit login form calls signInWithEmail with correct values', async () => {
    renderModal()
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(mockSignInWithEmail).toHaveBeenCalledWith('user@test.com', 'password123'))
  })

  it('displays error from Supabase on login failure', async () => {
    mockSignInWithEmail.mockResolvedValueOnce({ error: { message: 'Invalid login credentials' } })
    renderModal()
    await userEvent.type(screen.getByPlaceholderText('Email'), 'bad@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('Invalid login credentials')).toBeInTheDocument())
  })

  it('submit reset form calls resetPassword', async () => {
    renderModal()
    await userEvent.click(screen.getByText('Forgot password?'))
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => expect(mockResetPassword).toHaveBeenCalledWith('user@test.com'))
  })

  it('shows success message after reset link sent', async () => {
    renderModal()
    await userEvent.click(screen.getByText('Forgot password?'))
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => expect(screen.getByText(/Check your email/i)).toBeInTheDocument())
  })

  it('signup shows password mismatch error', async () => {
    renderModal()
    await userEvent.click(screen.getByText('Sign up'))
    await userEvent.type(screen.getByPlaceholderText('Email'), 'new@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'abc123')
    await userEvent.type(screen.getByPlaceholderText('Confirm password'), 'different')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })
})
