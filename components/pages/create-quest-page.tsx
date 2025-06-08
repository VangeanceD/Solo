"use client"

import type { Player, Quest } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNotification } from "@/components/notification-provider"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface CreateQuestPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function CreateQuestPage({ player, setPlayer }: CreateQuestPageProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [xp, setXp] = useState("100")
  const [timeLimit, setTimeLimit] = useState("30")
  const [category, setCategory] = useState("physical")
  const [punishment, setPunishment] = useState("You failed to complete the quest in time!")
  const [selectedStats, setSelectedStats] = useState<string[]>([])

  const { showNotification } = useNotification()
  const router = useRouter()

  const handleStatChange = (stat: string, checked: boolean) => {
    if (checked) {
      setSelectedStats([...selectedStats, stat])
    } else {
      setSelectedStats(selectedStats.filter((s) => s !== stat))
    }
  }

  const handleSubmit = () => {
    if (!title || !description) {
      showNotification({
        title: "MISSING INFORMATION",
        message: "Please fill in the title and description fields.",
        type: "warning",
      })
      return
    }

    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      description,
      xp: Number.parseInt(xp) || 100,
      timeLimit: Number.parseInt(timeLimit) || 30,
      category: category as any,
      stats: selectedStats as any[],
      punishment,
      completed: false,
    }

    const updatedPlayer = { ...player }
    updatedPlayer.quests.push(newQuest)
    setPlayer(updatedPlayer)

    // Show success notification
    showNotification({
      title: "QUEST CREATED",
      message: `Your new quest "${title}" has been created successfully!`,
      type: "success",
    })

    // Navigate to quests page
    router.push("/quests")
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Create New Quest</div>

        <div className="space-y-4">
          <div>
            <Label className="text-primary/80 block mb-2 font-michroma">Quest Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-electrolize"
              placeholder="Enter quest title"
            />
          </div>

          <div>
            <Label className="text-primary/80 block mb-2 font-michroma">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 font-electrolize"
              placeholder="Enter quest description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">XP Reward</Label>
              <Input
                type="number"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-orbitron"
                min="0"
              />
            </div>

            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Time Limit (minutes)</Label>
              <Input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-orbitron"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label className="text-primary/80 block mb-2 font-michroma">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-electrolize">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border border-primary/30 text-primary font-electrolize">
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="mental">Mental</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-primary/80 block mb-2 font-michroma">Punishment (if quest fails)</Label>
            <Textarea
              value={punishment}
              onChange={(e) => setPunishment(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 font-electrolize"
              placeholder="Enter punishment for failing the quest"
            />
          </div>

          <div>
            <Label className="text-primary/80 block mb-2 font-michroma">Stats to Improve</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                <Checkbox
                  id="stat-strength"
                  checked={selectedStats.includes("strength")}
                  onCheckedChange={(checked) => handleStatChange("strength", checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="stat-strength" className="text-primary/80 font-electrolize cursor-pointer">
                  Strength
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                <Checkbox
                  id="stat-endurance"
                  checked={selectedStats.includes("endurance")}
                  onCheckedChange={(checked) => handleStatChange("endurance", checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="stat-endurance" className="text-primary/80 font-electrolize cursor-pointer">
                  Endurance
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                <Checkbox
                  id="stat-focus"
                  checked={selectedStats.includes("focus")}
                  onCheckedChange={(checked) => handleStatChange("focus", checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="stat-focus" className="text-primary/80 font-electrolize cursor-pointer">
                  Focus
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                <Checkbox
                  id="stat-discipline"
                  checked={selectedStats.includes("discipline")}
                  onCheckedChange={(checked) => handleStatChange("discipline", checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="stat-discipline" className="text-primary/80 font-electrolize cursor-pointer">
                  Discipline
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                <Checkbox
                  id="stat-agility"
                  checked={selectedStats.includes("agility")}
                  onCheckedChange={(checked) => handleStatChange("agility", checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="stat-agility" className="text-primary/80 font-electrolize cursor-pointer">
                  Agility
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                <Checkbox
                  id="stat-intelligence"
                  checked={selectedStats.includes("intelligence")}
                  onCheckedChange={(checked) => handleStatChange("intelligence", checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="stat-intelligence" className="text-primary/80 font-electrolize cursor-pointer">
                  Intelligence
                </Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="mt-4 w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
          >
            CREATE QUEST
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
