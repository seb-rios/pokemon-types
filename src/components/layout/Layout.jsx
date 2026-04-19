import { useState } from 'react'
import TopBar from './TopBar'
import Drawer from './Drawer'
import AuthModal from '../auth/AuthModal'
import OnboardingModal from '../onboarding/OnboardingModal'
import { useUI } from '../../context/UIContext'
import Footer from './Footer'
import FeedbackModal from '../feedback/FeedbackModal'

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(
    () => !localStorage.getItem('pokemon-types-onboarding-seen')
  )
  const { authOpen, openAuthModal, closeAuthModal } = useUI()

  function handleOnboardingClose() {
    localStorage.setItem('pokemon-types-onboarding-seen', '1')
    setOnboardingOpen(false)
  }

  return (
    <div className="layout">
      <TopBar
        onMenuClick={() => setDrawerOpen(true)}
        onSignInClick={openAuthModal}
      />
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <OnboardingModal isOpen={onboardingOpen} onClose={handleOnboardingClose} />
      <AuthModal isOpen={authOpen} onClose={closeAuthModal} />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
      <FeedbackModal />
    </div>
  )
}
