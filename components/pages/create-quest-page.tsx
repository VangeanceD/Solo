"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useNotification } from "@/components/notification-provider"
import type { Player, Quest } from "@/lib/player"

interface CreateQuestPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function CreateQuestPage({ player, setPlayer }: CreateQuestPageProps) {
  const { addNotification } = useNotification()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState([30])
  const [xp, setXp] = useState([50])
  const [statIncreases, setStatIncreases] = useState({
    strength: 0,
    agility: 0,
    endurance: 0,
    intelligence: 0,
    charisma: 0,
  })

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

    // Filter out stats with 0 value
    const filteredStatIncreases: Partial<typeof statIncreases> = {}
    Object.entries(statIncreases).forEach(([key, value]) => {
      if (value > 0) {
        filteredStatIncreases[key as keyof typeof statIncreases] = value
      }
    })

    const newQuest: Quest = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title: title.trim(),
      description: description.trim(),
      timeLimit: timeLimit[0],
      xp: xp[0],
      completed: false,
      statIncreases: filteredStatIncreases,
    }

    const updatedPlayer = {
      ...player,
      quests: [...player.quests, newQuest],
    }

    setPlayer(updatedPlayer)

    addNotification("Quest created successfully!", "success")

    // Reset form
    setTitle("")
    setDescription("")
    setTimeLimit([30])
    setXp([50])
    setStatIncreases({
      strength: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0,
      charisma: 0,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">CREATE QUEST</h1>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
        <div className="holographic-header">Quest Configuration</div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-white/70 font-michroma mb-2 block">
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
            <Label htmlFor="description" className="text-white/70 font-michroma mb-2 block">
              Quest Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/60 border-primary/30 text-white font-electrolize min-h-[100px]"
              placeholder="Enter quest description"
            />
          </div>

          <div>
            <Label htmlFor="timeLimit" className="text-white/70 font-michroma mb-2 block">
              Time Limit: {timeLimit[0]} minutes
            </Label>
            <Slider
              id="timeLimit"
              value={timeLimit}
              min={5}
              max={180}
              step={5}
              onValueChange={setTimeLimit}
              className="my-4"
            />
          </div>

          <div>
            <Label htmlFor="xp" className="text-white/70 font-michroma mb-2 block">
              XP Reward: {xp[0]} XP
            </Label>
            <Slider id="xp" value={xp} min={10} max={500} step={5} onValueChange={setXp} className="my-4" />
          </div>

          <div className="space-y-4">
            <Label className="text-white/70 font-michroma">Stat Increases</Label>

            {Object.entries(statIncreases).map(([stat, value]) => (
              <div key={stat} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={stat} className="text-white/70 font-electrolize capitalize">
                    {stat}
                  </Label>
                  <span className="text-primary font-orbitron">+{value}</span>
                </div>
                <Slider
                  id={stat}
                  value={[value]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={(val) => handleStatChange(stat as keyof typeof statIncreases, val)}
                  className="my-2"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleCreateQuest}
            className="w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary mt-6 font-michroma"
          >
            CREATE QUEST
          </Button>
        </div>
      </div>
    </div>
  )
}
