"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import type { Player, DailyQuest } from "@/lib/player"

interface DailyQuestsPageProps {
  player: Player
  activeQuest: any
  onStartQuest: (quest: DailyQuest) => void
  setPlayer: (player: Player) => void
}

export function DailyQuestsPage({ player, activeQuest, onStartQuest, setPlayer }: DailyQuestsPageProps) {
  const [selectedQuest, setSelectedQuest] = useState<DailyQuest | null>(null)

  const handleSelectQuest = (quest: DailyQuest) => {
    setSelectedQuest(quest)
  }

  const handleStartQuest = () => {
    if (selectedQuest) {
      onStartQuest(selectedQuest)
      setSelectedQuest(null)
    }
  }

  const handleResetDailyQuests = () => {
    const resetQuests = player.dailyQuests.map((quest) => ({
      ...quest,
      completed: false,
    }))

    setPlayer({
      ...player,
      dailyQuests: resetQuests,
    })
  }

  const activeQuestId = activeQuest?.id
  const allCompleted = player.dailyQuests.every((quest) => quest.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">DAILY MISSIONS</h1>
        {allCompleted && (
          <Button
            onClick={handleResetDailyQuests}
            className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
          >
            RESET MISSIONS
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.dailyQuests.map((quest) => (
          <Card
            key={quest.id}
            className={`quest-card border border-primary/30 bg-black/60 backdrop-blur-md ${
              quest.completed
                ? "border-green-500/30 bg-green-900/10"
                : activeQuestId === quest.id
                  ? "border-amber-500/30 bg-amber-900/10"
                  : selectedQuest?.id === quest.id
                    ? "border-primary/50 bg-primary/10"
                    : ""
            }`}
            onClick={() => !quest.completed && activeQuestId !== quest.id && handleSelectQuest(quest)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-primary font-michroma">{quest.title}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-primary/70" />
                  <span className="text-primary/70 font-orbitron">{quest.xp}</span>
                </div>
              </div>
              <p className="text-white/70 mb-4 text-sm font-electrolize">{quest.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1 text-white/50 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{quest.timeLimit} min</span>
                </div>
                {quest.completed ? (
                  <div className="flex items-center text-green-500 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Completed</span>
                  </div>
                ) : activeQuestId === quest.id ? (
                  <div className="text-amber-500 text-sm">In Progress</div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary/70 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectQuest(quest)
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedQuest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
          <div className="max-w-md w-full bg-black/90 border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
            <div className="holographic-header">Mission Details</div>
            <h2 className="text-2xl font-bold text-primary mb-2 font-michroma">{selectedQuest.title}</h2>
            <p className="text-white/70 mb-4 font-electrolize">{selectedQuest.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-electrolize">Time Limit</span>
                <span className="text-primary font-orbitron">{selectedQuest.timeLimit} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-electrolize">XP Reward</span>
                <span className="text-primary font-orbitron">{selectedQuest.xp} XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-electrolize">Failure Penalty</span>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500 font-orbitron">-{selectedQuest.penalty} XP</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleStartQuest}
                className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
              >
                START MISSION
              </Button>
              <Button
                onClick={() => setSelectedQuest(null)}
                variant="ghost"
                className="py-2 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
