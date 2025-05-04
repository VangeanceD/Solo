"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

interface LevelUpContextType {
  showLevelUp: (level: number, stats: Record<string, number>) => void
}

const LevelUpContext = createContext<LevelUpContextType | undefined>(undefined)

export function LevelUpProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ level: number; stats: Record<string, number> } | null>(null)

  const showLevelUp = (level: number, stats: Record<string, number>) => {
    setLevelUpData({ level, stats })
    setIsVisible(true)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <LevelUpContext.Provider value={{ showLevelUp }}>
      {children}
      <AnimatePresence>
        {isVisible && levelUpData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="max-w-md w-full mx-4 relative overflow-hidden"
              style={{
                background: "rgba(0, 20, 40, 0.9)",
                border: "1px solid rgba(0, 168, 255, 0.5)",
                boxShadow: "0 0 30px rgba(0, 168, 255, 0.3)",
              }}
            >
              <div className="animate-rotate absolute -z-10 inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.3),transparent_70%)]"></div>
              </div>

              <div className="my-4 flex justify-center">
                <Trophy className="w-16 h-16 text-yellow-500 animate-pulse-glow" />
              </div>

              <h2 className="text-3xl font-bold text-primary mb-4 text-center font-audiowide pt-2">LEVEL UP!</h2>
              <p className="text-2xl text-white mb-6 text-center font-electrolize">
                You reached level {levelUpData.level}
              </p>

              <div className="px-6 pb-4">
                <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">Stat Increases:</h3>
                <ul className="space-y-2 mb-6">
                  {Object.entries(levelUpData.stats).map(([stat, value]) => (
                    <li key={stat} className="flex justify-between items-center">
                      <span className="text-white/80 font-electrolize capitalize">{stat}</span>
                      <span className="text-primary font-orbitron">+{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-center pb-6">
                <Button
                  onClick={handleClose}
                  className="px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider font-michroma"
                >
                  CONTINUE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LevelUpContext.Provider>
  )
}

export function useLevelUp() {
  const context = useContext(LevelUpContext)
  if (context === undefined) {
    throw new Error("useLevelUp must be used within a LevelUpProvider")
  }
  return context
}
