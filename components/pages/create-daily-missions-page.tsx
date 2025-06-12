"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, DailyQuest } from "@/lib/player"

interface CreateDailyMissionsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function CreateDailyMissionsPage({ player, setPlayer }: CreateDailyMissionsPageProps) {
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

    const updatedPlayer = {
      ...player,
      dailyQuests: [...player.dailyQuests, newDailyQuest],
    }

    setPlayer(updatedPlayer)
    addNotification("Daily mission created successfully!", "success")

    // Reset form
    setTitle("")
    setDescription("")
    setTimeLimit([60])
    setXp([25])
    setPenalty([10])
  }

  const handleDeleteDailyMission = (missionId: string) => {
    const updatedPlayer = {
      ...player,
      dailyQuests: player.dailyQuests.filter((mission) => mission.id !== missionId),
    }

    setPlayer(updatedPlayer)
    addNotification("Daily mission deleted", "success")
  }

  const customMissions = player.dailyQuests.filter((mission) => mission.isCustom)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">CREATE DAILY MISSIONS</h1>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
        <div className="holographic-header">Mission Configuration</div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-white/70 font-michroma mb-2 block">
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
            <Label htmlFor="description" className="text-white/70 font-michroma mb-2 block">
              Mission Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/60 border-primary/30 text-white font-electrolize min-h-[100px]"
              placeholder="Enter mission description"
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
              max={720}
              step={5}
              onValueChange={setTimeLimit}
              className="my-4"
            />
          </div>

          <div>
            <Label htmlFor="xp" className="text-white/70 font-michroma mb-2 block">
              XP Reward: {xp[0]} XP
            </Label>
            <Slider id="xp" value={xp} min={5} max={100} step={5} onValueChange={setXp} className="my-4" />
          </div>

          <div>
            <Label htmlFor="penalty" className="text-white/70 font-michroma mb-2 block">
              XP Penalty: {penalty[0]} XP
            </Label>
            <Slider
              id="penalty"
              value={penalty}
              min={5}
              max={50}
              step={5}
              onValueChange={setPenalty}
              className="my-4"
            />
          </div>

          <Button
            onClick={handleCreateDailyMission}
            className="w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary mt-6 font-michroma"
          >
            CREATE DAILY MISSION
          </Button>
        </div>
      </div>

      {customMissions.length > 0 && (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
          <div className="holographic-header">Your Custom Daily Missions</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customMissions.map((mission) => (
              <Card key={mission.id} className="bg-black/40 border border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-primary font-michroma">{mission.title}</h3>
                    <Button
                      onClick={() => handleDeleteDailyMission(mission.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-white/70 mb-3 text-sm font-electrolize">{mission.description}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-primary/70 font-orbitron">+{mission.xp} XP</span>
                    <span className="text-red-400 font-orbitron">-{mission.penalty} XP penalty</span>
                    <span className="text-white/50 font-electrolize">{mission.timeLimit} min</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
