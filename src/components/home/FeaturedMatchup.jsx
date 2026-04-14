import { useState, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import TypeBadge from '../TypeBadge'

const MATCHUPS = [
  { atk: 'fire', def: 'steel', multiplier: 2, desc: 'Fire melts through Steel defenses.' },
  { atk: 'ground', def: 'electric', multiplier: 2, desc: 'Ground shorts out Electric completely.' },
  { atk: 'dragon', def: 'fairy', multiplier: 0, desc: 'Fairy repels Dragon energy outright.' },
  { atk: 'fighting', def: 'dark', multiplier: 2, desc: 'Fighting overpowers the Dark type.' },
  { atk: 'ice', def: 'dragon', multiplier: 2, desc: "Ice is Dragon's most notable weakness." },
  { atk: 'psychic', def: 'poison', multiplier: 2, desc: 'Psychic cuts through Poison with ease.' },
  { atk: 'ghost', def: 'psychic', multiplier: 2, desc: 'Ghost haunts Psychic-type defenses.' },
  { atk: 'bug', def: 'dark', multiplier: 2, desc: 'Bug is one of the few things Dark fears.' },
  { atk: 'fairy', def: 'fighting', multiplier: 2, desc: 'Fairy deflects Fighting effortlessly.' },
  { atk: 'water', def: 'ground', multiplier: 2, desc: 'Water washes away Ground-type terrain.' },
  { atk: 'electric', def: 'flying', multiplier: 2, desc: 'Lightning always finds Flying targets.' },
  { atk: 'steel', def: 'fairy', multiplier: 2, desc: 'Steel is one of the few answers to Fairy.' },
]

function formatMultiplier(m) {
  if (m === 0) return '0×'
  if (m === 0.25) return '¼×'
  if (m === 0.5) return '½×'
  if (m === 2) return '2×'
  if (m === 4) return '4×'
  return `${m}×`
}

function getMultiplierClass(m) {
  if (m === 0) return 'matchup-group__multiplier--immune'
  if (m === 0.5 || m === 0.25) return 'matchup-group__multiplier--half'
  if (m === 2) return 'matchup-group__multiplier--double'
  if (m === 4) return 'matchup-group__multiplier--quad'
  return ''
}

export default function FeaturedMatchup() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MATCHUPS.length))

  const matchup = MATCHUPS[index]

  function refresh() {
    setIndex(i => {
      let next = Math.floor(Math.random() * MATCHUPS.length)
      if (next === i) next = (i + 1) % MATCHUPS.length
      return next
    })
  }

  return (
    <div className="home-featured">
      <div className="home-featured__matchup">
        <TypeBadge type={matchup.atk} size="md" />
        <span className="home-featured__arrow">→</span>
        <TypeBadge type={matchup.def} size="md" />
        <span className="home-featured__equals">=</span>
        <span className={`matchup-group__multiplier ${getMultiplierClass(matchup.multiplier)}`}>
          {formatMultiplier(matchup.multiplier)}
        </span>
      </div>
      <p className="home-featured__desc">{matchup.desc}</p>
      <button className="home-featured__refresh" onClick={refresh}>
        <RefreshCw size={14} />
        New matchup
      </button>
    </div>
  )
}
