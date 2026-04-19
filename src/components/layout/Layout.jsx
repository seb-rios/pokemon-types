import { useState } from 'react'
import TopBar from './TopBar'
import Drawer from './Drawer'
import AuthModal from '../auth/AuthModal'
import OnboardingModal from '../onboarding/OnboardingModal'

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(
    () => !localStorage.getItem('pokemon-types-onboarding-seen')
  )

  function handleOnboardingClose() {
    localStorage.setItem('pokemon-types-onboarding-seen', '1')
    setOnboardingOpen(false)
  }

  return (
    <div className="layout">
      <TopBar
        onMenuClick={() => setDrawerOpen(true)}
        onSignInClick={() => setAuthOpen(true)}
      />
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <OnboardingModal isOpen={onboardingOpen} onClose={handleOnboardingClose} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <main className="layout__main">
        {children}
      </main>
    </div>
  )
}
