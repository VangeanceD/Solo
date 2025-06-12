"use client"

import { useEffect } from "react"
import type { Quest, DailyQuest, Player } from "@/lib/player"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { X, Star, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useNotification } from "@/components/notification-provider"
import { useLevelUp } from "@/components/level-up-provider"

interface QuestTimerProps {
  quest: Quest | DailyQuest
  timeRemaining: number | null
  setTimeRemaining: (time: number) => void
  onComplete: () => void
  onFailure: () => void
  player?: Player
  setPlayer?: (player: Player) => void
}

export function QuestTimer({
  quest,
  timeRemaining,
  setTimeRemaining,
  onComplete,
  onFailure,
  player,
  setPlayer,
}: QuestTimerProps) {
  const { addNotification } = useNotification()
  const { showLevelUp } = useLevelUp()

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1)

      if (timeRemaining <= 1) {
        clearInterval(timer)
        onFailure()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, setTimeRemaining, onFailure])

  if (timeRemaining === null) return null

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const totalSeconds = quest.timeLimit * 60
  const percentRemaining = (timeRemaining / totalSeconds) * 100
  const isLowTime = percentRemaining < 25
  const isWarningTime = percentRemaining < 50 && percentRemaining >= 25

  const handleCompleteQuest = () => {
    if (!player || !setPlayer) {
      onComplete()
      return
    }

    try {
      const oldLevel = player.level
      const oldXP = player.xp

      // Calculate new XP
      const newXP = oldXP + quest.xp

      // Calculate new level (simple formula: level = floor(xp / 100) + 1)
      const newLevel = Math.floor(newXP / 100) + 1

      // Update quest as completed
      let updatedQuests = player.quests
      if ("statIncreases" in quest) {
        updatedQuests = player.quests.map((q) => (q.id === quest.id ? { ...q, completed: true } : q))
      }

      // Update daily quests if it's a daily quest
      let updatedDailyQuests = player.dailyQuests
      if ("penalty" in quest) {
        updatedDailyQuests = player.dailyQuests.map((q) => (q.id === quest.id ? { ...q, completed: true } : q))
      }

      // Create updated player
      const updatedPlayer = {
        ...player,
        quests: updatedQuests,
        dailyQuests: updatedDailyQuests,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newLevel * 100, // Next level threshold
      }

      // Add stat increases if it's a regular quest
      if ("statIncreases" in quest && quest.statIncreases) {
        const newStats = { ...player.stats }
        const statIncreases: Record<string, number> = {}

        Object.entries(quest.statIncreases).forEach(([stat, increase]) => {
          if (stat in newStats && increase) {
            newStats[stat as keyof typeof newStats] += increase
            statIncreases[stat] = increase
          }
        })
        updatedPlayer.stats = newStats

        // Show level up if player leveled up
        if (newLevel > oldLevel) {
          showLevelUp(newLevel, statIncreases)
        }
      }

      setPlayer(updatedPlayer)
      addNotification(`Quest completed! +${quest.xp} XP`, "success")
    } catch (error) {
      console.error("Error completing quest:", error)
      addNotification("Error completing quest", "error")
    }

    onComplete()
  }

  return (
    <motion.div
      className="bg-black/80 backdrop-blur-lg p-4 sm:p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] mb-4 sm:mb-6 animate-border-glow cyberpunk-border holographic-ui"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="holographic-header">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="font-michroma text-sm">Active {"penalty" in quest ? "Daily Mission" : "Quest"}</span>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-primary/70" />
            <span className="text-primary/70 font-orbitron text-sm">{quest.xp} XP</span>
          </div>
        </div>
      </div>

      <h4 className="text-base sm:text-lg font-semibold text-primary mb-2 font-michroma">{quest.title}</h4>
      <p className="text-primary/60 mb-4 font-electrolize text-sm">{quest.description}</p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-primary/70 text-xs sm:text-sm font-michroma">Time Remaining</span>
          <span
            className={`text-sm font-orbitron ${isLowTime ? "text-red-500" : isWarningTime ? "text-amber-500" : "text-primary/70"}`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
        <Progress value={percentRemaining} className="progress-bar h-2">
          <div
            className={`h-full rounded-sm transition-all duration-500 ${
              isLowTime
                ? "bg-gradient-to-r from-red-500/50 to-red-500/80"
                : isWarningTime
                  ? "bg-gradient-to-r from-amber-500/50 to-amber-500/80"
                  : "bg-gradient-to-r from-primary/50 to-secondary/80"
            }`}
            style={{ width: `${percentRemaining}%` }}
          ></div>
        </Progress>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCompleteQuest}
          className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary flex items-center justify-center text-sm"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          COMPLETE {"penalty" in quest ? "MISSION" : "QUEST"}
        </Button>
        <Button
          onClick={onFailure}
          variant="ghost"
          className="py-2 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  )
}
