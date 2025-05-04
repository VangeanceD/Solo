"use client"

import { Progress } from "@/components/ui/progress"
import type { Player } from "@/lib/player"

interface HeaderInfoProps {
  player: Player
}

export function HeaderInfo({ player }: HeaderInfoProps) {
  const xpPercentage = (player.xp / player.xpToNextLevel) * 100

  return (
    <div className="mb-6 p-4 bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
      <div className="holographic-header">
        <div className="flex justify-between items-center">
          <span className="font-michroma">Hunter Status</span>
          <span className="text-primary/70 font-orbitron">{player.title}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="flex-1 flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 mr-4">
            <img
              src={player.avatar || "/placeholder.svg?height=48&width=48"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary mb-1 font-michroma">{player.name}</h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/20 px-2 py-1 text-primary text-sm font-orbitron level-badge">
                LVL {player.level}
              </div>
              <div className="text-white/70 text-sm font-electrolize">
                {player.xp} / {player.xpToNextLevel} XP
              </div>
            </div>

            <div className="mb-4">
              <Progress value={xpPercentage} className="progress-bar h-2">
                <div className="progress-fill h-full" style={{ width: `${xpPercentage}%` }}></div>
              </Progress>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 md:grid-cols-5 gap-2">
          {Object.entries(player.stats).map(([stat, value]) => (
            <div key={stat} className="text-center">
              <div className="text-white/70 text-xs uppercase mb-1 font-michroma">{stat}</div>
              <div className="text-primary text-lg font-orbitron">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
