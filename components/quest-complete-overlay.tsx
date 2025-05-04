"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Quest, DailyQuest } from "@/lib/player"

interface QuestCompleteOverlayProps {
  show: boolean
  onClose: () => void
  quest: Quest | DailyQuest | null
  statIncreases: Record<string, number>
}

export function QuestCompleteOverlay({ show, onClose, quest, statIncreases }: QuestCompleteOverlayProps) {
  if (!quest) return null

  return (
    <AnimatePresence>
      {show && (
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
              <CheckCircle className="w-16 h-16 text-green-500 animate-pulse-glow" />
            </div>

            <h2 className="text-3xl font-bold text-primary mb-4 text-center font-audiowide pt-2">QUEST COMPLETE</h2>
            <p className="text-xl text-white mb-6 text-center font-electrolize px-6">{quest.title}</p>

            <div className="px-6 pb-4">
              <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">Rewards:</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80 font-electrolize">Experience</span>
                <span className="text-primary font-orbitron">+{quest.xp} XP</span>
              </div>

              {"statIncreases" in quest && Object.keys(quest.statIncreases).length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">Stat Increases:</h3>
                  <ul className="space-y-2 mb-6">
                    {Object.entries(statIncreases).map(([stat, value]) => (
                      <li key={stat} className="flex justify-between items-center">
                        <span className="text-white/80 font-electrolize capitalize">{stat}</span>
                        <span className="text-primary font-orbitron">+{value}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-center pb-6">
              <Button
                onClick={onClose}
                className="px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider font-michroma"
              >
                CONTINUE
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
