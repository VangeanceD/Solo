"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star, CheckCircle, Play } from "lucide-react"
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
      try {
        onStartQuest(selectedQuest)
        setSelectedQuest(null)
        addNotification(`Started quest: ${selectedQuest.title}`, "success")
      } catch (error) {
        console.error("Error starting quest:", error)
        addNotification("Failed to start quest", "error")
      }
    }
  }

  const activeQuestId = activeQuest?.id

  // Ensure we have quests array
  const quests = player.quests || []
  const completedQuests = quests.filter((q) => q.completed).length
  const totalQuests = quests.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">QUESTS</h1>
        <div className="text-white/70 font-electrolize">
          {completedQuests} / {totalQuests} Completed
        </div>
      </div>

      {quests.length === 0 ? (
        <div className="text-center py-12 bg-black/40 border border-primary/20 rounded-none">
          <div className="text-primary/30 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">No Quests Available</h3>
          <p className="text-white/50 font-electrolize mb-4">Create your first quest to begin your journey!</p>
          <Button
            onClick={() => (window.location.hash = "create-quest")}
            className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
          >
            CREATE QUEST
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((quest) => {
            const isCompleted = quest.completed
            const isActive = activeQuestId === quest.id
            const isSelected = selectedQuest?.id === quest.id

            return (
              <Card
                key={quest.id}
                className={`quest-card border border-primary/30 bg-black/60 backdrop-blur-md cursor-pointer transition-all duration-300 ${
                  isCompleted
                    ? "border-green-500/30 bg-green-900/10"
                    : isActive
                      ? "border-amber-500/30 bg-amber-900/10"
                      : isSelected
                        ? "border-primary/50 bg-primary/10"
                        : "hover:border-primary/60 hover:bg-primary/5"
                }`}
                onClick={() => handleSelectQuest(quest)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-primary font-michroma line-clamp-2">{quest.title}</h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="w-4 h-4 text-primary/70 flex-shrink-0" />
                      <span className="text-primary/70 font-orbitron text-sm">{quest.xp}</span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4 text-sm font-electrolize line-clamp-3">{quest.description}</p>

                  {quest.statIncreases && Object.keys(quest.statIncreases).length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-white/50 mb-1 font-michroma">Stat Bonuses:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(quest.statIncreases).map(([stat, value]) => (
                          <span
                            key={stat}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 font-orbitron rounded-sm"
                          >
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

                    {isCompleted ? (
                      <div className="flex items-center text-green-500 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="font-michroma">COMPLETED</span>
                      </div>
                    ) : isActive ? (
                      <div className="text-amber-500 text-sm font-orbitron">IN PROGRESS</div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary/70 hover:text-primary p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectQuest(quest)
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Quest Details Modal */}
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

              {selectedQuest.statIncreases && Object.keys(selectedQuest.statIncreases).length > 0 && (
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
