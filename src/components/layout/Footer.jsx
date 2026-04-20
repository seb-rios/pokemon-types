import { MessageSquare } from 'lucide-react'
import { useUI } from '../../context/UIContext'

export default function Footer() {
  const { openFeedbackModal } = useUI()

  return (
    <footer className="app-footer">
      <span className="app-footer__brand">PokéTypeDex</span>
      <div className="app-footer__links">
        <button className="app-footer__link app-footer__feedback-btn" onClick={openFeedbackModal}>
          <MessageSquare size={13} /> Feedback
        </button>
      </div>
      <span className="app-footer__copy">© 2026</span>
    </footer>
  )
}
