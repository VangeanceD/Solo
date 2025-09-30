"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star, CheckCircle, Play, Plus, Zap } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { CreateQuestModal } from "@/components/create-quest-modal"
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
  const quests = player.quests || []
  const completedQuests = quests.filter((q) => q.completed).length
  const totalQuests = quests.length

  return (
    <>
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary font-orbitron">{completedQuests}</div>
              <div className="text-xs text-white/70 font-michroma mt-1">COMPLETED</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary font-orbitron">{totalQuests - completedQuests}</div>
              <div className="text-xs text-white/70 font-michroma mt-1">ACTIVE</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Quest Button */}
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full py-6 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 text-primary rounded-none border border-primary/30 transition-all tracking-wider btn-primary font-michroma"
        >
          <Plus className="w-5 h-5 mr-2" />
          CREATE NEW QUEST
        </Button>

        {/* Quests Grid */}
        {quests.length === 0 ? (
          <div className="text-center py-16 bg-black/40 border border-primary/20 rounded-none">
            <div className="text-primary/30 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">No Quests Available</h3>
            <p className="text-white/50 font-electrolize mb-6">Create your first quest to begin your journey!</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              Create Quest
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {quests.map((quest) => {
              const isCompleted = quest.completed
              const isActive = activeQuestId === quest.id
              const isSelected = selectedQuest?.id === quest.id

              return (
                <Card
                  key={quest.id}
                  className={`quest-card border bg-black/60 backdrop-blur-md cursor-pointer transition-all duration-300 ${
                    isCompleted
                      ? "border-green-500/30 bg-green-900/10"
                      : isActive
                        ? "border-amber-500/50 bg-amber-900/10 animate-border-glow"
                        : isSelected
                          ? "border-primary/50 bg-primary/10"
                          : "border-primary/30 hover:border-primary/60"
                  }`}
                  onClick={() => handleSelectQuest(quest)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-primary font-michroma line-clamp-1 mb-1">
                          {quest.title}
                        </h3>
                        <p className="text-white/60 text-xs font-electrolize line-clamp-2">{quest.description}</p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {isCompleted ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        ) : isActive ? (
                          <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-sm">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-xs text-amber-400 font-orbitron">ACTIVE</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary/70 hover:text-primary p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectQuest(quest)
                            }}
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/10">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-white/50">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-orbitron">{quest.timeLimit}m</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary/70">
                          <Star className="w-3.5 h-3.5" />
                          <span className="font-orbitron">{quest.xp} XP</span>
                        </div>
                      </div>

                      {quest.statIncreases && Object.keys(quest.statIncreases).length > 0 && (
                        <div className="flex gap-1">
                          {Object.entries(quest.statIncreases)
                            .slice(0, 2)
                            .map(([stat, value]) => (
                              <span
                                key={stat}
                                className="text-xs bg-primary/20 text-primary px-2 py-0.5 font-orbitron rounded-sm"
                              >
                                {stat.charAt(0).toUpperCase()}+{value}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Quest Details Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
          <div className="max-w-md w-full bg-black/95 border border-primary/30 animate-border-glow cyberpunk-border holographic-ui overflow-hidden">
            <div className="p-6">
              <div className="holographic-header mb-4">Quest Details</div>

              <h2 className="text-2xl font-bold text-primary mb-3 font-michroma">{selectedQuest.title}</h2>
              <p className="text-white/70 mb-6 font-electrolize">{selectedQuest.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20">
                  <span className="text-white/70 font-electrolize">Time Limit</span>
                  <span className="text-primary font-orbitron">{selectedQuest.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20">
                  <span className="text-white/70 font-electrolize">XP Reward</span>
                  <span className="text-primary font-orbitron">{selectedQuest.xp} XP</span>
                </div>

                {selectedQuest.statIncreases && Object.keys(selectedQuest.statIncreases).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-white/70 font-electrolize mb-2">Stat Increases:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedQuest.statIncreases).map(([stat, value]) => (
                        <div
                          key={stat}
                          className="flex justify-between items-center p-2 bg-primary/5 border border-primary/20"
                        >
                          <span className="text-white/70 font-electrolize capitalize text-sm">{stat}</span>
                          <span className="text-primary font-orbitron text-sm">+{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleStartQuest}
                  className="flex-1 py-4 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
                >
                  START QUEST
                </Button>
                <Button
                  onClick={() => setSelectedQuest(null)}
                  variant="ghost"
                  className="py-4 px-6 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        player={player}
        setPlayer={(updatedPlayer) => {
          // This is a workaround since we're passing setPlayer through props
          const event = new CustomEvent("playerUpdate", { detail: updatedPlayer })
          window.dispatchEvent(event)
        }}
      />
    </>
  )
}
