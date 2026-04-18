import { useState } from 'react'
import TopBar from './TopBar'
import Drawer from './Drawer'
import AuthModal from '../auth/AuthModal'

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

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
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <main className="layout__main">
        {children}
      </main>
    </div>
  )
}
