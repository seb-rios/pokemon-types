import { TYPE_COLORS } from '../data/typeColors'
import { TYPE_ICONS } from '../data/typeIcons'

const SIZE_CONFIG = {
  sm: { className: 'type-badge--sm', iconHeight: 14 },
  md: { className: 'type-badge--md', iconHeight: 18 },
  lg: { className: 'type-badge--lg', iconHeight: 24 },
}

export default function TypeBadge({ type, size = 'md', iconOnly = false }) {
  const color = TYPE_COLORS[type] || '#888'
  const icon = TYPE_ICONS[type]
  const { className, iconHeight } = SIZE_CONFIG[size] || SIZE_CONFIG.md

  return (
    <span
      className={`type-badge ${className}${iconOnly ? ' type-badge--icon-only' : ''}`}
      style={{ backgroundColor: color }}
      title={iconOnly ? type : undefined}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          className="type-badge__icon"
          style={{ height: iconHeight, width: 'auto' }}
        />
      )}
      {!iconOnly && <span className="type-badge__label">{type.toUpperCase()}</span>}
    </span>
  )
}
