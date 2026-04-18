import { ChevronLeft, ChevronRight } from 'lucide-react'
import SlotEditor from './SlotEditor'

export default function SlotWizard({ slots, currentStep, onStepChange, onSlotChange }) {
  const total = 6

  return (
    <div className="slot-wizard">
      {/* Progress */}
      <div className="slot-wizard__progress">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            className={`slot-wizard__dot ${i === currentStep ? 'slot-wizard__dot--active' : ''} ${slots[i]?.pokemon_name ? 'slot-wizard__dot--filled' : ''}`}
            onClick={() => onStepChange(i)}
            aria-label={`Go to slot ${i + 1}`}
          />
        ))}
      </div>

      <p className="slot-wizard__step-label">Slot {currentStep + 1} of {total}</p>

      <SlotEditor
        slotIndex={currentStep}
        slot={slots[currentStep]}
        onChange={onSlotChange}
        onClose={() => {}}
      />

      {/* Navigation */}
      <div className="slot-wizard__nav">
        <button
          className="slot-wizard__nav-btn"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          className="slot-wizard__nav-btn slot-wizard__nav-btn--next"
          onClick={() => onStepChange(currentStep + 1)}
          disabled={currentStep === total - 1}
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
