import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useUI } from '../../context/UIContext'

export default function FeedbackModal() {
  const { feedbackOpen, closeFeedbackModal } = useUI()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')

  if (!feedbackOpen) return null

  async function submit(e) {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('sending')
    const { error } = await supabase.from('feedback').insert({
      message: message.trim(),
      page: window.location.pathname,
    })
    setStatus(error ? 'error' : 'done')
    if (!error) setTimeout(closeFeedbackModal, 1500)
  }

  function handleClose() {
    closeFeedbackModal()
    setMessage('')
    setStatus('idle')
  }

  return (
    <div className="feedback-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        <div className="feedback-modal__header">
          <span>Send feedback</span>
          <button onClick={handleClose} aria-label="Close"><X size={16} /></button>
        </div>
        {status === 'done' ? (
          <p className="feedback-modal__thanks">Thanks! Your feedback was sent ✓</p>
        ) : (
          <form onSubmit={submit}>
            <textarea
              className="feedback-modal__textarea"
              placeholder="Bug, idea, or just a thought…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              autoFocus
            />
            {status === 'error' && (
              <p className="feedback-modal__error">Failed to send. Try again.</p>
            )}
            <button
              type="submit"
              className="feedback-modal__submit"
              disabled={status === 'sending' || !message.trim()}
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
