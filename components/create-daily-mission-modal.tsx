"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotification } from "@/components/notification-provider"
import type { Player, DailyQuest } from "@/lib/player"

interface CreateDailyMissionModalProps {
  isOpen: boolean
  onClose: () => void
  player: Player
  setPlayer: (player: Player) => void
}

export function CreateDailyMissionModal({ isOpen, onClose, player, setPlayer }: CreateDailyMissionModalProps) {
  const { addNotification } = useNotification()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState([60])
  const [xp, setXp] = useState([25])
  const [penalty, setPenalty] = useState([10])

  const handleCreateDailyMission = () => {
    if (!title.trim()) {
      addNotification("Please enter a mission title", "error")
      return
    }

    if (!description.trim()) {
      addNotification("Please enter a mission description", "error")
      return
    }

    const newDailyQuest: DailyQuest = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title: title.trim(),
      description: description.trim(),
      timeLimit: timeLimit[0],
      xp: xp[0],
      penalty: penalty[0],
      completed: false,
      isCustom: true,
      createdAt: new Date().toISOString(),
    }

    setPlayer({
      ...player,
      dailyQuests: [...player.dailyQuests, newDailyQuest],
    })

    addNotification("Daily mission created!", "success")

    // Reset form
    setTitle("")
    setDescription("")
    setTimeLimit([60])
    setXp([25])
    setPenalty([10])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-black/95 border border-primary/30 overflow-hidden animate-border-glow cyberpunk-border holographic-ui"
          >
            <div className="flex items-center justify-between p-4 border-b border-primary/30">
              <h2 className="text-xl font-bold text-primary font-audiowide glow-text">CREATE DAILY MISSION</h2>
              <button onClick={onClose} className="text-primary/70 hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-12rem)] p-4 scrollbar-thin">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white/70 font-michroma mb-2 block text-sm">
                    Mission Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-black/60 border-primary/30 text-white font-electrolize"
                    placeholder="Enter daily mission title"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white/70 font-michroma mb-2 block text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-black/60 border-primary/30 text-white font-electrolize min-h-[80px]"
                    placeholder="Enter mission description"
                  />
                </div>

                <div>
                  <Label htmlFor="timeLimit" className="text-white/70 font-michroma mb-2 block text-sm">
                    Time Limit: {timeLimit[0]} minutes
                  </Label>
                  <Slider
                    id="timeLimit"
                    value={timeLimit}
                    min={5}
                    max={720}
                    step={5}
                    onValueChange={setTimeLimit}
                    className="my-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="xp" className="text-white/70 font-michroma mb-2 block text-sm">
                      XP Reward: {xp[0]}
                    </Label>
                    <Slider id="xp" value={xp} min={5} max={100} step={5} onValueChange={setXp} className="my-2" />
                  </div>

                  <div>
                    <Label htmlFor="penalty" className="text-white/70 font-michroma mb-2 block text-sm">
                      Penalty: {penalty[0]}
                    </Label>
                    <Slider
                      id="penalty"
                      value={penalty}
                      min={5}
                      max={50}
                      step={5}
                      onValueChange={setPenalty}
                      className="my-2"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateDailyMission}
                  className="w-full py-6 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma text-base"
                >
                  CREATE MISSION
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
