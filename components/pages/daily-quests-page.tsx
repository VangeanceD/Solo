"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Star, Plus, CheckCircle, Play, Zap } from "lucide-react"
import { CreateDailyMissionModal } from "@/components/create-daily-mission-modal"
import type { Player } from "@/lib/player"
import { computeSkipPenalty } from "@/lib/xp"

interface DailyQuestsPageProps {
  player: Player
  activeQuest: any
  onStartQuest: (quest: any) => void
  setPlayer: (player: Player) => void
}

export function DailyQuestsPage({ player, activeQuest, onStartQuest, setPlayer }: DailyQuestsPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const completedCount = player.dailyQuests.filter((q) => q.completed).length
  const totalCount = player.dailyQuests.length

  return (
    <>
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary font-orbitron">{completedCount}</div>
              <div className="text-xs text-white/70 font-michroma mt-1">COMPLETED</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary font-orbitron">{totalCount - completedCount}</div>
              <div className="text-xs text-white/70 font-michroma mt-1">ACTIVE</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Mission Button */}
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full py-6 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 text-primary rounded-none border border-primary/30 transition-all tracking-wider btn-primary font-michroma"
        >
          <Plus className="w-5 h-5 mr-2" />
          CREATE DAILY MISSION
        </Button>

        {/* Daily Missions Grid */}
        {player.dailyQuests.length === 0 ? (
          <div className="text-center py-16 bg-black/40 border border-primary/20 rounded-none">
            <div className="text-primary/30 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">No Daily Missions</h3>
            <p className="text-white/50 font-electrolize mb-6">Create your first daily mission!</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              Create Mission
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {player.dailyQuests.map((quest) => {
              const dynamicPenalty = computeSkipPenalty(quest.xp)
              const isCompleted = quest.completed
              const isActive = activeQuest?.id === quest.id

              return (
                <Card
                  key={quest.id}
                  className={`quest-card border bg-black/60 backdrop-blur-md transition-all duration-300 ${
                    isCompleted
                      ? "border-green-500/30 bg-green-900/10"
                      : isActive
                        ? "border-amber-500/50 bg-amber-900/10 animate-border-glow"
                        : "border-primary/30 hover:border-primary/60"
                  }`}
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
                            onClick={() => onStartQuest(quest)}
                            size="sm"
                            variant="ghost"
                            className="text-primary/70 hover:text-primary p-2"
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
                      <div className="text-xs text-red-400 font-orbitron">-{dynamicPenalty} XP</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <CreateDailyMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        player={player}
        setPlayer={setPlayer}
      />
    </>
  )
}
