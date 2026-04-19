import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const STEPS = [
  {
    id: 'types',
    emoji: '🗂️',
    title: 'Type Chart',
    description: 'See offensive and defensive matchups for all 18 Pokémon types at a glance. Tap any type to instantly filter its strengths, weaknesses, and immunities.',
    accentColor: '#6390f0',
  },
  {
    id: 'pokemon',
    emoji: '🔍',
    title: 'Pokédex Search',
    description: 'Look up any Pokémon by name to see its types, base stats, and learnset. Matchup panels update in real time as you search.',
    accentColor: '#f97316',
  },
  {
    id: 'battle',
    emoji: '⚔️',
    title: 'Battle Simulator',
    description: 'Pick two Pokémon and compare them head-to-head with a full type-advantage breakdown and stat bars. Find out who wins before the battle starts.',
    accentColor: '#ef4444',
  },
  {
    id: 'teams',
    emoji: '🏆',
    title: 'Team Builder',
    description: 'Build a 6-Pokémon team, get AI-powered coverage recommendations, and share your roster with a single link. Sign in to save teams permanently.',
    accentColor: '#22c55e',
  },
]

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir * 20 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir * -20 }),
}

function hexToRgba(hex, alpha) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
  return `rgba(${r},${g},${b},${alpha})`
}

export default function OnboardingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  function handleNext() {
    setDirection(1)
    setStep(s => s + 1)
  }

  function handleBack() {
    setDirection(-1)
    setStep(s => s - 1)
  }

  function goToStep(i) {
    setDirection(i > step ? 1 : -1)
    setStep(i)
  }

  const current = STEPS[step]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="onboarding-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="onboarding-modal"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="onboarding-modal__accent-bar"
              style={{ background: current.accentColor }}
            />

            <div className="onboarding-modal__header">
              <span className="onboarding-modal__logo">PokéTypeDex</span>
              <button
                className="onboarding-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="onboarding-modal__body">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  className="onboarding-modal__step"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <div
                    className="onboarding-modal__icon-wrap"
                    style={{ background: hexToRgba(current.accentColor, 0.12) }}
                  >
                    <span className="onboarding-modal__emoji" role="img" aria-hidden="true">
                      {current.emoji}
                    </span>
                  </div>
                  <h2 id="onboarding-title" className="onboarding-modal__title">
                    {current.title}
                  </h2>
                  <p className="onboarding-modal__desc">{current.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="onboarding-modal__footer">
              <div className="onboarding-modal__dots">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    className={`onboarding-modal__dot${i === step ? ' onboarding-modal__dot--active' : ''}`}
                    onClick={() => goToStep(i)}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              <div className="onboarding-modal__nav">
                <button className="onboarding-modal__skip" onClick={onClose}>
                  Skip
                </button>

                <div className="onboarding-modal__nav-right">
                  {step > 0 && (
                    <button
                      className="onboarding-modal__btn onboarding-modal__btn--back"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      className="onboarding-modal__btn onboarding-modal__btn--next"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="onboarding-modal__btn onboarding-modal__btn--primary"
                      onClick={onClose}
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
