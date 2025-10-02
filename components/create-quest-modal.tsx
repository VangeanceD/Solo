"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotification } from "@/components/notification-provider"
import type { Player, Quest } from "@/lib/player"

interface CreateQuestModalProps {
  isOpen: boolean
  onClose: () => void
  player: Player
  setPlayer: (player: Player) => void
}

export function CreateQuestModal({ isOpen, onClose, player, setPlayer }: CreateQuestModalProps) {
  const { addNotification } = useNotification()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState([30])
  const [xp, setXp] = useState([50])
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "extreme">("medium")
  const [statIncreases, setStatIncreases] = useState({
    strength: 0,
    agility: 0,
    endurance: 0,
    intelligence: 0,
    charisma: 0,
  })

  const difficulties = {
    easy: { xpMultiplier: 0.8, color: "text-green-400", label: "Easy" },
    medium: { xpMultiplier: 1, color: "text-blue-400", label: "Medium" },
    hard: { xpMultiplier: 1.3, color: "text-orange-400", label: "Hard" },
    extreme: { xpMultiplier: 1.6, color: "text-red-400", label: "Extreme" },
  }

  const handleStatChange = (stat: keyof typeof statIncreases, value: number[]) => {
    setStatIncreases({
      ...statIncreases,
      [stat]: value[0],
    })
  }

  const handleCreateQuest = () => {
    if (!title.trim()) {
      addNotification("Please enter a quest title", "error")
      return
    }

    if (!description.trim()) {
      addNotification("Please enter a quest description", "error")
      return
    }

    const filteredStatIncreases: Partial<typeof statIncreases> = {}
    Object.entries(statIncreases).forEach(([key, value]) => {
      if (value > 0) {
        filteredStatIncreases[key as keyof typeof statIncreases] = value
      }
    })

    const adjustedXp = Math.round(xp[0] * difficulties[difficulty].xpMultiplier)

    const newQuest: Quest = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title: title.trim(),
      description: description.trim(),
      timeLimit: timeLimit[0],
      xp: adjustedXp,
      completed: false,
      statIncreases: filteredStatIncreases,
    }

    setPlayer({
      ...player,
      quests: [...player.quests, newQuest],
    })

    addNotification(`Quest created! +${adjustedXp} XP reward 🎯`, "success")

    // Reset form
    setTitle("")
    setDescription("")
    setTimeLimit([30])
    setXp([50])
    setDifficulty("medium")
    setStatIncreases({
      strength: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0,
      charisma: 0,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
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
          <h2 className="text-xl font-bold text-primary font-audiowide glow-text">CREATE QUEST</h2>
          <button onClick={onClose} className="text-primary/70 hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-12rem)] p-4 scrollbar-thin">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white/70 font-michroma mb-2 block text-sm">
                Quest Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/60 border-primary/30 text-white font-electrolize"
                placeholder="Enter quest title"
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
                placeholder="Enter quest description"
              />
            </div>

            <div>
              <Label htmlFor="difficulty" className="text-white/70 font-michroma mb-2 block text-sm">
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger className="bg-black/60 border-primary/30 text-white font-electrolize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-primary/30">
                  {Object.entries(difficulties).map(([key, { color, label }]) => (
                    <SelectItem key={key} value={key} className={color}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeLimit" className="text-white/70 font-michroma mb-2 block text-sm">
                  Time: {timeLimit[0]} min
                </Label>
                <Slider
                  id="timeLimit"
                  value={timeLimit}
                  min={5}
                  max={180}
                  step={5}
                  onValueChange={setTimeLimit}
                  className="my-2"
                />
              </div>

              <div>
                <Label htmlFor="xp" className="text-white/70 font-michroma mb-2 block text-sm">
                  Base XP: {Math.round(xp[0] * difficulties[difficulty].xpMultiplier)}
                </Label>
                <Slider id="xp" value={xp} min={10} max={500} step={5} onValueChange={setXp} className="my-2" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white/70 font-michroma text-sm">Stat Rewards</Label>
              {Object.entries(statIncreases).map(([stat, value]) => (
                <div key={stat} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={stat} className="text-white/60 font-electrolize capitalize text-xs">
                      {stat}
                    </Label>
                    <span className="text-primary font-orbitron text-sm">+{value}</span>
                  </div>
                  <Slider
                    id={stat}
                    value={[value]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(val) => handleStatChange(stat as keyof typeof statIncreases, val)}
                    className="my-1"
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={handleCreateQuest}
              className="w-full py-6 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma text-base"
            >
              CREATE QUEST
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
