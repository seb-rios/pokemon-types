import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <UIProvider>
          <App />
          <SpeedInsights />
          <Analytics />
        </UIProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
