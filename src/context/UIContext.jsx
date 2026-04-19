import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false)
  return (
    <UIContext.Provider value={{
      authOpen,
      openAuthModal: () => setAuthOpen(true),
      closeAuthModal: () => setAuthOpen(false),
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
