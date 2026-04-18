import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import TypesPage from './pages/TypesPage'
import PokemonPage from './pages/PokemonPage'
import BattlePage from './pages/BattlePage'
import TeamsPage from './pages/TeamsPage'
import TeamBuilderPage from './pages/TeamBuilderPage'
import SharedTeamPage from './pages/SharedTeamPage'

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
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/new" element={<TeamBuilderPage />} />
              <Route path="/teams/:id/edit" element={<TeamBuilderPage />} />
              <Route path="/teams/share/:shareToken" element={<SharedTeamPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
