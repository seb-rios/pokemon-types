import { useState, useRef, useEffect } from 'react'
import { Menu, Sun, Moon, LogIn, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ onMenuClick, onSignInClick }) {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

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
        <span className="topbar__title">PokéTypeDex</span>
      </Link>

      <div className="topbar__right">
        {user ? (
          <div className="topbar__user-wrap" ref={menuRef}>
            <button
              className="topbar__avatar"
              onClick={() => setUserMenuOpen(v => !v)}
              aria-label="User menu"
            >
              {user.email[0].toUpperCase()}
            </button>
            {userMenuOpen && (
              <div className="topbar__user-menu">
                <span className="topbar__user-email">{user.email}</span>
                <button
                  className="topbar__sign-out"
                  onClick={() => { signOut(); setUserMenuOpen(false) }}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="topbar__sign-in" onClick={onSignInClick} aria-label="Sign in">
            <LogIn size={18} />
            <span className="topbar__sign-in-text">Sign in</span>
          </button>
        )}

        <button className="topbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
