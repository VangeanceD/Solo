"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LevelUpContextType {
  showLevelUp: (level: number) => void
}

const LevelUpContext = createContext<LevelUpContextType>({
  showLevelUp: () => {},
})

export function LevelUpProvider({ children }: { children: ReactNode }) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [level, setLevel] = useState(0)

  const showLevelUp = (newLevel: number) => {
    setLevel(newLevel)
    setShowAnimation(true)

    // Hide after animation
    setTimeout(() => {
      setShowAnimation(false)
    }, 4000)
  }

  return (
    <LevelUpContext.Provider value={{ showLevelUp }}>
      {children}

      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
          >
            <div className="relative">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.1, opacity: 0.9 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 2 + i * 0.5,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full border-[5px] border-primary/70 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    boxShadow: "0 0 30px rgba(0, 168, 255, 0.5), inset 0 0 30px rgba(0, 168, 255, 0.5)",
                  }}
                />
              ))}

              <div className="flex flex-col items-center justify-center text-center z-10 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-5xl font-audiowide text-white glow-text solo-text"
                >
                  LEVEL UP!
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-2xl text-primary glow-text font-rajdhani mt-4"
                >
                  Level {level}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LevelUpContext.Provider>
  )
}

export const useLevelUp = () => useContext(LevelUpContext)
