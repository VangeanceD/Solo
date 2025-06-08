"use client"

import { useState } from "react"
import type { Player, DailyQuest } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Timer, Star, Edit, Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNotification } from "@/components/notification-provider"

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
        </div>
      </div>

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
                        <Button
                          onClick={() => startEditing(quest)}
                          className="py-2 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
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
            <span className="text-primary font-bold">TIP:</span> You can edit urgent quests by clicking the edit button.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
