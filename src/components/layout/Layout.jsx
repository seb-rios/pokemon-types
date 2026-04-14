import { useState } from 'react'
import TopBar from './TopBar'
import Drawer from './Drawer'

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="layout">
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="layout__main">
        {children}
      </main>
    </div>
  )
}
