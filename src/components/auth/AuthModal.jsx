import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SocialButton from './SocialButton'

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { signInWithEmail, signUpWithEmail, signInWithProvider, resetPassword } = useAuth()

  function reset() {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setLoading(false)
  }

  function switchView(next) {
    reset()
    setView(next)
  }

  async function handleSocial(provider) {
    setError('')
    setLoading(true)
    const { error } = await signInWithProvider(provider)
    if (error) { setError(error.message); setLoading(false) }
    // on success the page redirects — no need to close modal
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signInWithEmail(email, password)
    setLoading(false)
    if (error) { setError(error.message); return }
    reset()
    onClose()
  }

  async function handleSignup(e) {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setError('')
    setLoading(true)
    const { error } = await signUpWithEmail(email, password)
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('Check your email to confirm your account.')
  }

  async function handleForgot(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('Check your email for a password reset link.')
  }

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            <button className="auth-modal__close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            {/* ── Login ── */}
            {view === 'login' && (
              <>
                <h2 className="auth-modal__title">Sign in</h2>
                <div className="auth-social-btns">
                  <SocialButton provider="google" onClick={() => handleSocial('google')} disabled={loading} />
                </div>
                <div className="auth-divider"><span>or</span></div>
                <form onSubmit={handleLogin} className="auth-form">
                  <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                  <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                  {error && <p className="auth-error">{error}</p>}
                  <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </button>
                </form>
                <div className="auth-footer">
                  <button className="auth-link" onClick={() => switchView('forgot')}>Forgot password?</button>
                  <span className="auth-footer__sep" />
                  <span className="auth-footer__text">No account?</span>
                  <button className="auth-link" onClick={() => switchView('signup')}>Sign up</button>
                </div>
              </>
            )}

            {/* ── Sign Up ── */}
            {view === 'signup' && (
              <>
                <h2 className="auth-modal__title">Create account</h2>
                <div className="auth-social-btns">
                  <SocialButton provider="google" onClick={() => handleSocial('google')} disabled={loading} />
                </div>
                <div className="auth-divider"><span>or</span></div>
                {success ? (
                  <p className="auth-success">{success}</p>
                ) : (
                  <form onSubmit={handleSignup} className="auth-form">
                    <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                    <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
                    <input className="auth-input" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
                    {error && <p className="auth-error">{error}</p>}
                    <button className="auth-submit" type="submit" disabled={loading}>
                      {loading ? 'Creating account…' : 'Create account'}
                    </button>
                  </form>
                )}
                <div className="auth-footer">
                  <span className="auth-footer__text">Already have an account?</span>
                  <button className="auth-link" onClick={() => switchView('login')}>Sign in</button>
                </div>
              </>
            )}

            {/* ── Forgot Password ── */}
            {view === 'forgot' && (
              <>
                <h2 className="auth-modal__title">Reset password</h2>
                <p className="auth-modal__subtitle">Enter your email and we'll send you a reset link.</p>
                {success ? (
                  <p className="auth-success">{success}</p>
                ) : (
                  <form onSubmit={handleForgot} className="auth-form">
                    <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                    {error && <p className="auth-error">{error}</p>}
                    <button className="auth-submit" type="submit" disabled={loading}>
                      {loading ? 'Sending…' : 'Send reset link'}
                    </button>
                  </form>
                )}
                <div className="auth-footer">
                  <button className="auth-link" onClick={() => switchView('login')}>← Back to sign in</button>
                </div>
              </>
            )}
          </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
  )
}
