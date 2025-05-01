"use client"

import type { Quest, DailyQuest } from "@/lib/player"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

interface QuestCompleteOverlayProps {
  show: boolean
  onClose: () => void
  quest: Quest | DailyQuest | null
  statIncreases: Record<string, number>
}

export function QuestCompleteOverlay({ show, onClose, quest, statIncreases }: QuestCompleteOverlayProps) {
  useEffect(() => {
    if (show) {
      createCompletionParticles()
    }
  }, [show])

  const createCompletionParticles = () => {
    const overlay = document.getElementById("quest-complete-overlay")
    if (!overlay) return

    const content = overlay.querySelector(".quest-complete-content")
    if (!content) return

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement("div")
        particle.style.position = "absolute"
        particle.style.width = "8px"
        particle.style.height = "8px"
        particle.style.backgroundColor = "rgba(0, 168, 255, 0.6)"
        particle.style.borderRadius = "50%"

        // Position at center of content
        const rect = content.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        particle.style.left = `${centerX}px`
        particle.style.top = `${centerY}px`

        // Random direction
        const angle = Math.random() * Math.PI * 2
        const distance = 100 + Math.random() * 150
        const speedFactor = 0.5 + Math.random() * 0.5

        // Animate
        particle.animate(
          [
            {
              transform: "translate(-50%, -50%) scale(0)",
              opacity: 0,
            },
            {
              transform: "translate(-50%, -50%) scale(1)",
              opacity: 1,
              offset: 0.1,
            },
            {
              transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
              opacity: 0,
            },
          ],
          {
            duration: 1500 * speedFactor,
            easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
          },
        )

        overlay.appendChild(particle)

        // Remove particle after animation
        setTimeout(() => {
          particle.remove()
        }, 1500)
      }, Math.random() * 500)
    }
  }

  if (!quest) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="quest-complete-overlay"
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
            className="quest-complete-content holographic-ui max-w-md w-full mx-4 relative overflow-hidden"
          >
            <div className="animate-rotate absolute -z-10 inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.3),transparent_70%)]"></div>
            </div>

            <h2 className="text-3xl font-bold text-primary glow-text solo-text font-audiowide text-center mb-4">
              Quest Complete!
            </h2>

            <div className="my-4 flex justify-center">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>

            <p className="text-xl text-white mb-2 font-electrolize text-center">{quest.title}</p>

            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent my-4 font-orbitron text-center">
              +{quest.xp} XP
            </div>

            <div className="mt-4">
              <p className="text-primary/70 mb-2 font-michroma text-center">Stats Increased:</p>
              <div className="grid grid-cols-2 gap-2 px-4">
                {Object.keys(statIncreases).length > 0 ? (
                  Object.entries(statIncreases).map(([stat, value]) => (
                    <div key={stat} className="flex items-center justify-between bg-primary/10 p-2 rounded-none">
                      <span className="text-primary/80 capitalize font-electrolize">{stat}</span>
                      <span className="text-primary font-bold font-orbitron">+1 ({value})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-primary/60 col-span-2 text-center">No stats increased</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={onClose}
                className="px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
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
