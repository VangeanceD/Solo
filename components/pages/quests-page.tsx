"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star, ArrowRight, CheckCircle } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, Quest } from "@/lib/player"

interface QuestsPageProps {
  player: Player
  activeQuest: any
  onStartQuest: (quest: Quest) => void
  onCompleteQuest: () => void
  onCancelQuest: () => void
}

export function QuestsPage({ player, activeQuest, onStartQuest, onCompleteQuest, onCancelQuest }: QuestsPageProps) {
  const { addNotification } = useNotification()
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)

  const handleSelectQuest = (quest: Quest) => {
    if (!quest.completed && activeQuest?.id !== quest.id) {
      setSelectedQuest(quest)
    }
  }

  const handleStartQuest = () => {
    if (selectedQuest) {
      onStartQuest(selectedQuest)
      setSelectedQuest(null)
      addNotification(`Started quest: ${selectedQuest.title}`, "success")
    }
  }

  const activeQuestId = activeQuest?.id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">QUESTS</h1>
        <div className="text-white/70 font-electrolize">
          {player.quests.filter((q) => q.completed).length} / {player.quests.length} Completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.quests.map((quest) => (
          <Card
            key={quest.id}
            className={`quest-card border border-primary/30 bg-black/60 backdrop-blur-md cursor-pointer ${
              quest.completed
                ? "border-green-500/30 bg-green-900/10"
                : activeQuestId === quest.id
                  ? "border-amber-500/30 bg-amber-900/10"
                  : selectedQuest?.id === quest.id
                    ? "border-primary/50 bg-primary/10"
                    : "hover:border-primary/60"
            }`}
            onClick={() => handleSelectQuest(quest)}
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

              {Object.keys(quest.statIncreases).length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-white/50 mb-1 font-michroma">Stat Bonuses:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(quest.statIncreases).map(([stat, value]) => (
                      <span key={stat} className="text-xs bg-primary/20 text-primary px-2 py-1 font-orbitron">
                        {stat.charAt(0).toUpperCase()}
                        {stat.slice(1)} +{value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                  <div className="text-amber-500 text-sm font-orbitron">In Progress</div>
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
            <div className="holographic-header">Quest Details</div>
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
              {Object.keys(selectedQuest.statIncreases).length > 0 && (
                <div className="space-y-2">
                  <div className="text-white/70 font-electrolize">Stat Increases:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedQuest.statIncreases).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between items-center">
                        <span className="text-white/70 font-electrolize capitalize">{stat}</span>
                        <span className="text-primary font-orbitron">+{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleStartQuest}
                className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
              >
                START QUEST
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
