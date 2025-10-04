"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Gift } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Player } from "@/lib/player"

interface CreateRewardModalProps {
  isOpen: boolean
  onClose: () => void
  player: Player
  setPlayer: (player: Player) => void
}

export function CreateRewardModal({ isOpen, onClose, player, setPlayer }: CreateRewardModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("50")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newReward = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      description,
      cost: Number.parseInt(cost) || 50,
      used: false,
    }

    const updatedPlayer = {
      ...player,
      rewards: [...player.rewards, newReward],
    }

    setPlayer(updatedPlayer)

    // Dispatch custom event for player update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("playerUpdate", { detail: updatedPlayer }))
    }

    // Reset form
    setTitle("")
    setDescription("")
    setCost("50")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-black/95 border border-primary/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto cyberpunk-border relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-black/95 border-b border-primary/30 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-primary font-audiowide">CREATE REWARD</h2>
              </div>
              <button
                onClick={onClose}
                className="text-primary/70 hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reward-title" className="text-primary font-michroma">
                  Reward Title
                </Label>
                <Input
                  id="reward-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Movie Night, Gaming Session"
                  required
                  className="bg-black/60 border-primary/30 text-white placeholder:text-white/30 font-electrolize"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-description" className="text-primary font-michroma">
                  Description
                </Label>
                <Textarea
                  id="reward-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this reward includes..."
                  required
                  rows={3}
                  className="bg-black/60 border-primary/30 text-white placeholder:text-white/30 font-electrolize resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-cost" className="text-primary font-michroma">
                  XP Cost
                </Label>
                <Input
                  id="reward-cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="50"
                  required
                  min="1"
                  className="bg-black/60 border-primary/30 text-white placeholder:text-white/30 font-electrolize"
                />
                <p className="text-xs text-white/50 font-electrolize">Set how much XP this reward will cost to claim</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 bg-transparent border-primary/30 text-white hover:bg-primary/10 font-michroma"
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-michroma"
                >
                  CREATE REWARD
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
