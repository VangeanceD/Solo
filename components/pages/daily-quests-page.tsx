"use client"

import { useState } from "react"
import type { Player, DailyQuest, Category, Stat } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Timer, Star, Edit, Check, X, Plus, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNotification } from "@/components/notification-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DailyQuestsPageProps {
  player: Player
  activeQuest: DailyQuest | null
  onStartQuest: (quest: DailyQuest) => void
  setPlayer: (player: Player) => void
}

export function DailyQuestsPage({ player, activeQuest, onStartQuest, setPlayer }: DailyQuestsPageProps) {
  const [editingQuest, setEditingQuest] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [showCreateQuest, setShowCreateQuest] = useState(false)
  const [newQuest, setNewQuest] = useState<{
    title: string
    description: string
    xp: string
    penalty: string
    timeLimit: string
    category: Category
    stats: Stat[]
    muscleGroups: string[]
  }>({
    title: "",
    description: "",
    xp: "50",
    penalty: "100",
    timeLimit: "30",
    category: "physical",
    stats: [],
    muscleGroups: [],
  })
  const { showNotification } = useNotification()

  // Count completed and total daily quests
  const completedDailyQuests = player.dailyQuests.filter((q) => q.completed).length
  const totalDailyQuests = player.dailyQuests.length

  // Calculate time until reset
  const now = new Date()
  const nextReset = new Date(player.nextDailyReset)
  const timeUntilReset = nextReset.getTime() - now.getTime()
  const hoursUntilReset = Math.floor(timeUntilReset / (1000 * 60 * 60))
  const minutesUntilReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))

  const startEditing = (quest: DailyQuest) => {
    setEditingQuest(quest.id)
    setEditTitle(quest.title)
    setEditDescription(quest.description)
  }

  const saveEdit = (questId: string) => {
    if (!editTitle.trim()) {
      showNotification({
        title: "VALIDATION ERROR",
        message: "Quest title cannot be empty",
        type: "error",
      })
      return
    }

    const updatedPlayer = { ...player }
    const questIndex = updatedPlayer.dailyQuests.findIndex((q) => q.id === questId)

    if (questIndex !== -1) {
      updatedPlayer.dailyQuests[questIndex] = {
        ...updatedPlayer.dailyQuests[questIndex],
        title: editTitle,
        description: editDescription,
      }

      setPlayer(updatedPlayer)
      setEditingQuest(null)

      showNotification({
        title: "QUEST UPDATED",
        message: "Daily mission has been updated successfully",
        type: "success",
      })
    }
  }

  const cancelEdit = () => {
    setEditingQuest(null)
  }

  const handleStatChange = (stat: Stat, checked: boolean) => {
    if (checked) {
      setNewQuest({ ...newQuest, stats: [...newQuest.stats, stat] })
    } else {
      setNewQuest({ ...newQuest, stats: newQuest.stats.filter((s) => s !== stat) })
    }
  }

  const handleMuscleGroupChange = (muscle: string, checked: boolean) => {
    if (checked) {
      setNewQuest({ ...newQuest, muscleGroups: [...newQuest.muscleGroups, muscle] })
    } else {
      setNewQuest({ ...newQuest, muscleGroups: newQuest.muscleGroups.filter((m) => m !== muscle) })
    }
  }

  const handleCreateQuest = () => {
    if (!newQuest.title || !newQuest.description) {
      showNotification({
        title: "MISSING INFORMATION",
        message: "Please fill in the title and description fields.",
        type: "warning",
      })
      return
    }

    const xp = Number.parseInt(newQuest.xp)
    const penalty = Number.parseInt(newQuest.penalty)
    const timeLimit = Number.parseInt(newQuest.timeLimit)

    if (isNaN(xp) || xp <= 0 || isNaN(penalty) || penalty <= 0 || isNaN(timeLimit) || timeLimit <= 0) {
      showNotification({
        title: "INVALID VALUES",
        message: "Please enter valid values for XP, penalty, and time limit.",
        type: "warning",
      })
      return
    }

    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)

    const newDailyQuest: DailyQuest = {
      id: `daily-${Date.now()}`,
      title: newQuest.title,
      description: newQuest.description,
      xp: xp,
      penalty: penalty,
      timeLimit: timeLimit,
      category: newQuest.category,
      completed: false,
      stats: newQuest.stats,
      punishment: "You failed to complete the mission in time!",
      expires: tomorrow.getTime(),
      urgent: false,
      editable: true,
      muscleGroups: newQuest.muscleGroups.length > 0 ? (newQuest.muscleGroups as any[]) : undefined,
    }

    const updatedPlayer = { ...player }
    updatedPlayer.dailyQuests.push(newDailyQuest)
    setPlayer(updatedPlayer)

    // Reset form
    setNewQuest({
      title: "",
      description: "",
      xp: "50",
      penalty: "100",
      timeLimit: "30",
      category: "physical",
      stats: [],
      muscleGroups: [],
    })
    setShowCreateQuest(false)

    showNotification({
      title: "MISSION CREATED",
      message: "Your new daily mission has been created successfully!",
      type: "success",
    })
  }

  const deleteQuest = (questId: string) => {
    showNotification({
      title: "DELETE MISSION",
      message: "Are you sure you want to delete this daily mission?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        const updatedPlayer = { ...player }
        updatedPlayer.dailyQuests = updatedPlayer.dailyQuests.filter((q) => q.id !== questId)
        setPlayer(updatedPlayer)
      },
    })
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary glow-text solo-text font-audiowide">Daily Missions</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-none">
            <Star className="text-primary w-5 h-5" />
            <span className="text-primary font-bold font-orbitron">
              {completedDailyQuests}/{totalDailyQuests}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-none">
            <Timer className="text-primary w-5 h-5" />
            <span className="text-primary font-bold font-orbitron">
              Reset: {hoursUntilReset}h {minutesUntilReset}m
            </span>
          </div>
          <Button
            onClick={() => setShowCreateQuest(!showCreateQuest)}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider flex items-center space-x-2 btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>NEW MISSION</span>
          </Button>
        </div>
      </div>

      {/* Create Daily Mission Form */}
      {showCreateQuest && (
        <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
          <div className="holographic-header">Create New Daily Mission</div>

          <div className="space-y-4">
            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Mission Title</Label>
              <Input
                type="text"
                value={newQuest.title}
                onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-electrolize"
                placeholder="Enter mission title"
              />
            </div>

            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Description</Label>
              <Textarea
                value={newQuest.description}
                onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 font-electrolize"
                placeholder="Enter mission description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-primary/80 block mb-2 font-michroma">XP Reward</Label>
                <Input
                  type="number"
                  value={newQuest.xp}
                  onChange={(e) => setNewQuest({ ...newQuest, xp: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-orbitron"
                  min="0"
                />
              </div>

              <div>
                <Label className="text-primary/80 block mb-2 font-michroma">XP Penalty</Label>
                <Input
                  type="number"
                  value={newQuest.penalty}
                  onChange={(e) => setNewQuest({ ...newQuest, penalty: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-orbitron"
                  min="0"
                />
              </div>

              <div>
                <Label className="text-primary/80 block mb-2 font-michroma">Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={newQuest.timeLimit}
                  onChange={(e) => setNewQuest({ ...newQuest, timeLimit: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-orbitron"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Category</Label>
              <Select
                value={newQuest.category}
                onValueChange={(value) => setNewQuest({ ...newQuest, category: value as Category })}
              >
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
              <Label className="text-primary/80 block mb-2 font-michroma">Stats to Improve</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="stat-strength"
                    checked={newQuest.stats.includes("strength")}
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
                    checked={newQuest.stats.includes("endurance")}
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
                    checked={newQuest.stats.includes("focus")}
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
                    checked={newQuest.stats.includes("discipline")}
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
                    checked={newQuest.stats.includes("agility")}
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
                    checked={newQuest.stats.includes("intelligence")}
                    onCheckedChange={(checked) => handleStatChange("intelligence", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="stat-intelligence" className="text-primary/80 font-electrolize cursor-pointer">
                    Intelligence
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Muscle Groups (Optional)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="muscle-chest"
                    checked={newQuest.muscleGroups.includes("chest")}
                    onCheckedChange={(checked) => handleMuscleGroupChange("chest", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="muscle-chest" className="text-primary/80 font-electrolize cursor-pointer">
                    Chest
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="muscle-back"
                    checked={newQuest.muscleGroups.includes("back")}
                    onCheckedChange={(checked) => handleMuscleGroupChange("back", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="muscle-back" className="text-primary/80 font-electrolize cursor-pointer">
                    Back
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="muscle-shoulders"
                    checked={newQuest.muscleGroups.includes("shoulders")}
                    onCheckedChange={(checked) => handleMuscleGroupChange("shoulders", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="muscle-shoulders" className="text-primary/80 font-electrolize cursor-pointer">
                    Shoulders
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="muscle-arms"
                    checked={newQuest.muscleGroups.includes("arms")}
                    onCheckedChange={(checked) => handleMuscleGroupChange("arms", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="muscle-arms" className="text-primary/80 font-electrolize cursor-pointer">
                    Arms
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="muscle-abs"
                    checked={newQuest.muscleGroups.includes("abs")}
                    onCheckedChange={(checked) => handleMuscleGroupChange("abs", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="muscle-abs" className="text-primary/80 font-electrolize cursor-pointer">
                    Abs
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-none cursor-pointer hover:bg-black/60">
                  <Checkbox
                    id="muscle-legs"
                    checked={newQuest.muscleGroups.includes("legs")}
                    onCheckedChange={(checked) => handleMuscleGroupChange("legs", checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="muscle-legs" className="text-primary/80 font-electrolize cursor-pointer">
                    Legs
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleCreateQuest}
                className="flex-1 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                CREATE MISSION
              </Button>
              <Button
                onClick={() => setShowCreateQuest(false)}
                className="py-3 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors font-michroma"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Mission Status</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {player.dailyQuests.map((quest, index) => {
            const now = new Date()
            const expireDate = new Date(quest.expires)
            const timeLeft = expireDate.getTime() - now.getTime()
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

            // Check if quest is urgent (less than 3 hours left)
            const isUrgent = timeLeft < 3 * 60 * 60 * 1000 || quest.urgent

            const isEditing = editingQuest === quest.id

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`relative bg-black/90 border ${isUrgent && !quest.completed ? "border-red-500/50" : "border-primary/50"} rounded-none overflow-hidden`}
              >
                {isUrgent && !quest.completed ? (
                  <div className="absolute top-0 right-0 bg-red-500/30 text-red-400 font-michroma text-xs px-2 py-1 z-10">
                    URGENT
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 bg-primary/30 text-primary font-michroma text-xs px-2 py-1 z-10">
                    DAILY
                  </div>
                )}

                <div className="p-4 border-b border-primary/30 flex justify-between items-center">
                  {isEditing ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-electrolize"
                    />
                  ) : (
                    <div className="font-michroma text-primary">{quest.title}</div>
                  )}
                  <div
                    className={`font-orbitron text-sm ${quest.completed ? "text-green-400" : isUrgent ? "text-red-400" : "text-primary"}`}
                  >
                    {quest.completed ? "COMPLETED" : `Expires: ${hoursLeft}h ${minutesLeft}m`}
                  </div>
                </div>

                <div className="p-4">
                  {isEditing ? (
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 font-electrolize mb-4"
                    />
                  ) : (
                    <div className="font-electrolize text-primary/60 mb-4">{quest.description}</div>
                  )}

                  <div className="flex flex-wrap items-center mt-2 space-x-3">
                    <div className="flex items-center">
                      <Timer className="text-primary/70 w-4 h-4 mr-1" />
                      <span className="text-primary/60 font-orbitron">{quest.timeLimit} min</span>
                    </div>
                    {quest.stats && (
                      <div className="flex items-center space-x-1">
                        {quest.stats.map((stat) => (
                          <span
                            key={stat}
                            className="px-2 py-0.5 bg-primary/10 text-primary/70 rounded-none text-xs font-electrolize"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    )}

                    {quest.muscleGroups && (
                      <div className="flex items-center space-x-1 ml-2">
                        {quest.muscleGroups.map((muscle) => (
                          <span
                            key={muscle}
                            className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-none text-xs font-electrolize"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary/20">
                    <div className="text-primary font-orbitron">Reward: +{quest.xp} XP</div>
                    <div className="text-red-400 font-orbitron">Penalty: -{quest.penalty} XP</div>
                  </div>

                  {isEditing ? (
                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => saveEdit(quest.id)}
                        className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
                      >
                        <Check className="w-4 h-4 mr-2" /> SAVE
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        className="py-2 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-4">
                      {!quest.completed && (
                        <Button
                          onClick={() => onStartQuest(quest)}
                          className={`flex-1 py-2 rounded-none border transition-colors tracking-wider btn-primary ${
                            activeQuest
                              ? "bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed"
                              : "bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                          }`}
                          disabled={!!activeQuest}
                        >
                          {activeQuest ? "QUEST IN PROGRESS" : "START MISSION"}
                        </Button>
                      )}

                      {quest.editable && !quest.completed && (
                        <>
                          <Button
                            onClick={() => startEditing(quest)}
                            className="py-2 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteQuest(quest.id)}
                            className="py-2 px-4 bg-black/60 hover:bg-red-900/30 text-primary/70 hover:text-red-400 rounded-none border border-primary/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>

      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Mission Briefing</div>
        <div className="p-4 border border-primary/30 bg-black/60">
          <p className="text-primary/80 mb-4 font-electrolize">
            Daily missions are critical tasks that must be completed before the daily reset. Failure to complete these
            missions will result in XP penalties.
          </p>
          <p className="text-primary/80 mb-4 font-electrolize">
            Complete all daily missions to maintain optimal progress and avoid setbacks in your training.
          </p>
          <div className="flex items-center space-x-2 text-primary/80">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 font-electrolize">
              WARNING: Missions marked as URGENT are close to expiration and should be prioritized.
            </span>
          </div>
          <p className="text-primary/80 mt-4 font-electrolize">
            <span className="text-primary font-bold">TIP:</span> You can create custom daily missions and edit existing
            ones.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
