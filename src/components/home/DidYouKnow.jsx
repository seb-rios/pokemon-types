import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FACTS = [
  'Normal is the only type that deals no super effective damage to any other type.',
  'Steel has 12 resistances — more than any other type in the game.',
  'Ghost and Normal are mutually immune to each other.',
  'Fairy was added in Gen 6 specifically to counter the Dragon type.',
  'Bug is the most resisted type, with 7 types resisting it.',
  'Ice hits Dragon super effectively but resists almost nothing in return.',
  'Ground is immune to Electric and hits Steel super effectively — two usually dominant types.',
  'Dragon resists Fire, Water, Grass, and Electric — the four main starter types.',
  'In Gen 1, Psychic had no weakness to Ghost due to a programming bug.',
  'Electric has only one immunity: Ground. No other type has fewer immunities against it.',
]

export default function DidYouKnow() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  function prev() {
    setDirection(-1)
    setIndex(i => (i - 1 + FACTS.length) % FACTS.length)
  }

  function next() {
    setDirection(1)
    setIndex(i => (i + 1) % FACTS.length)
  }

  return (
    <div className="home-did-you-know">
      <div className="home-did-you-know__body">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.p
            key={index}
            className="home-did-you-know__fact"
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25 }}
          >
            {FACTS[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="home-did-you-know__nav">
        <button className="home-did-you-know__btn" onClick={prev} aria-label="Previous fact">
          <ChevronLeft size={16} />
        </button>
        <span className="home-did-you-know__counter">{index + 1} / {FACTS.length}</span>
        <button className="home-did-you-know__btn" onClick={next} aria-label="Next fact">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
