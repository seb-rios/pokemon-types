import { Menu, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function TopBar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <Link to="/" className="topbar__brand">
        <div className="topbar__pokeball">
          <div className="topbar__pokeball-line" />
          <div className="topbar__pokeball-btn" />
        </div>
        <span className="topbar__title">TypeDex</span>
      </Link>

      <button className="topbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  )
}
