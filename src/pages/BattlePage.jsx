import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePokemon } from '../hooks/usePokemon'
import PokemonSlot from '../components/battle/PokemonSlot'
import BattleResult from '../components/battle/BattleResult'

export default function BattlePage() {
  const [nameA, setNameA] = useState(null)
  const [nameB, setNameB] = useState(null)

  const { data: pokemonA } = usePokemon(nameA)
  const { data: pokemonB } = usePokemon(nameB)

  const bothReady = pokemonA && pokemonB

  return (
    <div className="page battle-page">
      <div className="page__header">
        <h1 className="page__title">Battle</h1>
        <p className="page__subtitle">Pick two Pokémon to see who has the type edge</p>
      </div>

      <div className="battle-slots">
        <PokemonSlot
          label="Your Pokémon"
          selectedName={nameA}
          onSelect={setNameA}
        />
        <div className="battle-slots__vs">VS</div>
        <PokemonSlot
          label="Opponent"
          selectedName={nameB}
          onSelect={setNameB}
        />
      </div>

      <AnimatePresence>
        {bothReady && (
          <BattleResult key={`${nameA}-${nameB}`} pokemonA={pokemonA} pokemonB={pokemonB} />
        )}
      </AnimatePresence>
    </div>
  )
}
