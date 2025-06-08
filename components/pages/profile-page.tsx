"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Calendar, Clock } from "lucide-react"
import type { Player } from "@/lib/player"

interface ProfilePageProps {
  player: Player
}

export function ProfilePage({ player }: ProfilePageProps) {
  const xpPercentage = (player.xp / player.xpToNextLevel) * 100
  const completedQuests = player.quests.filter((quest) => quest.completed).length
  const totalQuests = player.quests.length
  const completionRate = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">PROFILE</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui h-full">
            <CardContent className="p-6">
              <div className="holographic-header">Hunter Identity</div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50 mb-4 animate-pulse-glow">
                  <img
                    src={player.avatar || "/placeholder.svg?height=128&width=128"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-1 font-michroma">{player.name}</h2>
                <div className="text-white/70 mb-4 font-electrolize text-center">{player.title}</div>

                <div className="bg-primary/20 px-3 py-2 text-primary text-lg font-orbitron level-badge mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  LEVEL {player.level}
                </div>

                <div className="w-full mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm font-michroma">Experience</span>
                    <span className="text-primary/70 text-sm font-orbitron">
                      {player.xp} / {player.xpToNextLevel}
                    </span>
                  </div>
                  <Progress value={xpPercentage} className="progress-bar h-2">
                    <div className="progress-fill h-full" style={{ width: `${xpPercentage}%` }}></div>
                  </Progress>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center p-2 bg-primary/10 border border-primary/20">
                    <div className="text-white/70 text-xs mb-1 font-michroma">Joined</div>
                    <div className="text-primary/80 text-sm font-electrolize">{formatDate(player.createdAt)}</div>
                  </div>
                  <div className="text-center p-2 bg-primary/10 border border-primary/20">
                    <div className="text-white/70 text-xs mb-1 font-michroma">Last Login</div>
                    <div className="text-primary/80 text-sm font-electrolize">{formatDate(player.lastLogin)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
              <CardContent className="p-6">
                <div className="holographic-header">Stats</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(player.stats).map(([stat, value]) => (
                    <div key={stat} className="text-center p-3 bg-primary/10 border border-primary/20">
                      <div className="text-white/70 text-sm mb-1 font-michroma capitalize">{stat}</div>
                      <div className="text-primary text-2xl font-orbitron">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
              <CardContent className="p-6">
                <div className="holographic-header">Progress</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/10 border border-primary/20">
                    <div className="flex justify-center mb-2">
                      <Star className="w-8 h-8 text-primary/70" />
                    </div>
                    <div className="text-white/70 text-sm mb-1 font-michroma">Total XP</div>
                    <div className="text-primary text-2xl font-orbitron">{player.xp}</div>
                  </div>

                  <div className="text-center p-4 bg-primary/10 border border-primary/20">
                    <div className="flex justify-center mb-2">
                      <Calendar className="w-8 h-8 text-primary/70" />
                    </div>
                    <div className="text-white/70 text-sm mb-1 font-michroma">Quests Completed</div>
                    <div className="text-primary text-2xl font-orbitron">
                      {completedQuests}/{totalQuests}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-primary/10 border border-primary/20">
                    <div className="flex justify-center mb-2">
                      <Clock className="w-8 h-8 text-primary/70" />
                    </div>
                    <div className="text-white/70 text-sm mb-1 font-michroma">Completion Rate</div>
                    <div className="text-primary text-2xl font-orbitron">{completionRate.toFixed(0)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
