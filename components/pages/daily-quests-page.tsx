"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Star } from "lucide-react"
import type { Player } from "@/lib/player"
import { computeSkipPenalty } from "@/lib/xp"

interface DailyQuestsPageProps {
  player: Player
  activeQuest: any
  onStartQuest: (quest: any) => void
  setPlayer: (player: Player) => void
}

export function DailyQuestsPage({ player, activeQuest, onStartQuest }: DailyQuestsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">DAILY MISSIONS</h1>
        <div className="text-white/70 font-electrolize">
          {player.dailyQuests.filter((q) => q.completed).length} / {player.dailyQuests.length} Completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {player.dailyQuests.map((quest) => {
          const dynamicPenalty = computeSkipPenalty(quest.xp)
          return (
            <Card
              key={quest.id}
              className={`quest-card border border-primary/30 bg-black/60 backdrop-blur-md ${
                quest.completed
                  ? "border-green-500/30 bg-green-900/10"
                  : activeQuest?.id === quest.id
                    ? "border-amber-500/30 bg-amber-900/10"
                    : "hover:border-primary/60"
              }`}
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

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-1 text-white/50 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{quest.timeLimit} min</span>
                  </div>
                  <div className="text-red-400 text-sm font-orbitron">-{dynamicPenalty} XP penalty</div>
                </div>

                {!quest.completed && activeQuest?.id !== quest.id && (
                  <Button
                    onClick={() => onStartQuest(quest)}
                    className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
                  >
                    START MISSION
                  </Button>
                )}

                {quest.completed && <div className="text-center text-green-500 font-michroma">COMPLETED</div>}

                {activeQuest?.id === quest.id && (
                  <div className="text-center text-amber-500 font-michroma">IN PROGRESS</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
