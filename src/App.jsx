import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import TypesPage from './pages/TypesPage'
import PokemonPage from './pages/PokemonPage'
import BattlePage from './pages/BattlePage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/types" element={<TypesPage />} />
              <Route path="/pokemon" element={<PokemonPage />} />
              <Route path="/battle" element={<BattlePage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
