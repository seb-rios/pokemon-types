import { motion } from 'framer-motion'
import { TYPES } from '../data/typeChart'
import { TYPE_COLORS } from '../data/typeColors'
import { TYPE_ICONS } from '../data/typeIcons'

export default function TypeGrid({ selectedTypes, onSelect, onToast }) {
  const handleClick = (type) => {
    if (selectedTypes.includes(type)) {
      onSelect(selectedTypes.filter(t => t !== type))
    } else if (selectedTypes.length >= 2) {
      onToast('Max 2 types — deselect one first')
    } else {
      onSelect([...selectedTypes, type])
    }
  }

  return (
    <div className="type-grid">
      {TYPES.map(type => {
        const isSelected = selectedTypes.includes(type)
        const isDimmed = selectedTypes.length >= 2 && !isSelected
        const color = TYPE_COLORS[type]
        const icon = TYPE_ICONS[type]

        return (
          <div key={type} className="type-grid__cell">
            <motion.button
              className={`type-grid__card ${isSelected ? 'type-grid__card--selected' : ''} ${isDimmed ? 'type-grid__card--dimmed' : ''}`}
              onClick={() => handleClick(type)}
              style={{
                background: color,
                boxShadow: `0 0 20px ${color}`,
              }}
              whileHover={{ scale: isDimmed ? 1 : 1.1, filter: 'saturate(200%)' }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isSelected ? 1.1 : 1,
                outline: isSelected ? `3px solid white` : '3px solid transparent',
                outlineOffset: '2px',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {icon && (
                <img
                  src={icon}
                  alt=""
                  className="type-grid__icon"
                />
              )}
            </motion.button>
            <span className="type-grid__label">{type.toUpperCase()}</span>
          </div>
        )
      })}
    </div>
  )
}
