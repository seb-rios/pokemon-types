import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Grid3X3, Search, Swords } from 'lucide-react'
import { motion } from 'framer-motion'
import MiniTypeGrid from '../components/home/MiniTypeGrid'
import FeaturedMatchup from '../components/home/FeaturedMatchup'
import DidYouKnow from '../components/home/DidYouKnow'
import SEO from '../components/SEO'

const SILHOUETTES = [
  { id: 94,  alt: 'Gengar',   style: { top: '-20px', right: '-40px', width: '300px', opacity: 1 } },
  { id: 448, alt: 'Lucario',  style: { bottom: '40px', left: '-30px', width: '200px', opacity: 1 } },
  { id: 445, alt: 'Garchomp', style: { top: '50%', right: '15%', width: '160px', opacity: 1 } },
]

const NAV_CARDS = [
  {
    to: '/types',
    icon: Grid3X3,
    title: 'Type Chart',
    desc: 'Explore all 18 type matchups, offensive and defensive.',
  },
  {
    to: '/pokemon',
    icon: Search,
    title: 'Pokédex',
    desc: 'Search any Pokémon and see its full type breakdown.',
  },
  {
    to: '/battle',
    icon: Swords,
    title: 'Battle',
    desc: 'Compare two Pokémon and see who has the type edge.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  function handleTypeSelect(type) {
    navigate(`/types?type=${type}`)
  }

  return (
    <>
      <SEO
        description="TypeDex is a Pokémon type effectiveness tool. Explore the 18-type chart, look up any Pokémon's weaknesses and resistances, and simulate type-advantage battles."
      />
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__silhouettes" aria-hidden="true">
          {SILHOUETTES.map(({ id, alt, style }) => (
            <img
              key={id}
              className="home-hero__silhouette"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
              alt={alt}
              style={style}
            />
          ))}
        </div>

        <div className="home-hero__content">
          <p className="home-hero__eyebrow">TYPEDEX</p>
          <h1 className="home-hero__title">Know your matchups.</h1>
          <p className="home-hero__subtitle">
            Type effectiveness for trainers who actually read the chart.
          </p>

          <div className="home-nav-cards">
            {NAV_CARDS.map(({ to, icon: Icon, title, desc }) => (
              <motion.div
                key={to}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link to={to} className="home-nav-card">
                  <Icon size={22} className="home-nav-card__icon" />
                  <span className="home-nav-card__title">{title}</span>
                  <span className="home-nav-card__desc">{desc}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Type Lookup */}
      <section className="home-section">
        <p className="home-section__label">Quick Lookup</p>
        <h2 className="home-section__title">Pick a type</h2>
        <p className="home-section__subtitle">Jump straight to its offensive and defensive matchups.</p>
        <MiniTypeGrid onSelect={handleTypeSelect} />
      </section>

      {/* Featured Matchup + Did You Know side by side */}
      <div className="home-two-col">
        <section className="home-section home-section--card">
          <p className="home-section__label">Type Spotlight</p>
          <h2 className="home-section__title">Featured matchup</h2>
          <FeaturedMatchup />
        </section>

        <section className="home-section home-section--card">
          <p className="home-section__label">Trainer's Corner</p>
          <h2 className="home-section__title">Did you know?</h2>
          <DidYouKnow />
        </section>
      </div>
    </div>
    </>
  )
}
