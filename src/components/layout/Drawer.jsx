import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Grid3X3, Search, Sun, Moon, Swords, Home, Users, Lock } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'

export default function Drawer({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { openAuthModal } = useUI()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.nav
            className="drawer"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="drawer__header">
              <div className="drawer__logo">
                <div className="drawer__pokeball">
                  <div className="drawer__pokeball-line" />
                  <div className="drawer__pokeball-btn" />
                </div>
                <span className="drawer__title">PokéTypeDex</span>
              </div>
            </div>

            <ul className="drawer__nav">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Home size={18} />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/types"
                  className={({ isActive }) =>
                    `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Grid3X3 size={18} />
                  <span>Type Chart</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pokemon"
                  className={({ isActive }) =>
                    `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Search size={18} />
                  <span>Pokédex Search</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/battle"
                  className={({ isActive }) =>
                    `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Swords size={18} />
                  <span>Battle</span>
                </NavLink>
              </li>
              <li>
                {user ? (
                  <NavLink
                    to="/teams"
                    className={({ isActive }) =>
                      `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <Users size={18} />
                    <span>My Teams</span>
                  </NavLink>
                ) : (
                  <button
                    className="drawer__link drawer__link--locked"
                    onClick={() => { openAuthModal(); onClose() }}
                  >
                    <Users size={18} />
                    <span>My Teams</span>
                    <Lock size={14} className="drawer__lock-icon" />
                  </button>
                )}
              </li>
            </ul>

            <div className="drawer__footer">
              <button className="drawer__theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
