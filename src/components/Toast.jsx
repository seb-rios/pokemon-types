import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function useToast() {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(message)
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return { toast, showToast }
}

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span className="toast__icon">⚠️</span>
          <span className="toast__message">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
