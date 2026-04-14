import { motion } from 'framer-motion'
import { TYPES } from '../../data/typeChart'
import { TYPE_COLORS } from '../../data/typeColors'
import { TYPE_ICONS } from '../../data/typeIcons'

export default function MiniTypeGrid({ onSelect }) {
  return (
    <div className="home-mini-grid">
      {TYPES.map(type => {
        const color = TYPE_COLORS[type]
        const icon = TYPE_ICONS[type]
        return (
          <div key={type} className="home-mini-grid__cell">
            <motion.button
              className="home-mini-grid__card"
              style={{ background: color, boxShadow: `0 0 14px ${color}` }}
              onClick={() => onSelect(type)}
              whileHover={{ scale: 1.12, filter: 'saturate(200%)' }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {icon && <img src={icon} alt="" className="home-mini-grid__icon" />}
            </motion.button>
            <span className="home-mini-grid__label">{type.toUpperCase()}</span>
          </div>
        )
      })}
    </div>
  )
}
