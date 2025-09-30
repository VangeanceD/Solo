"use client"

import { Menu, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { Player } from "@/lib/player"

interface MobileHeaderProps {
  player: Player
  onMenuToggle: () => void
  isMenuOpen: boolean
}

export function MobileHeader({ player, onMenuToggle, isMenuOpen }: MobileHeaderProps) {
  const xpPercentage = (player.xp / player.xpToNextLevel) * 100

  return (
    <header className="sticky top-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-lg border-b border-primary/30 shadow-[0_4px_12px_rgba(0,168,255,0.2)]">
      <div className="flex items-center justify-between p-3">
        {/* Menu Button */}
        <button onClick={onMenuToggle} className="p-2 text-primary hover:bg-primary/10 rounded-sm transition-colors">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Player Info */}
        <div className="flex-1 mx-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-michroma text-primary truncate max-w-[120px]">{player.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/20 px-2 py-1 text-primary font-orbitron rounded-sm">
                LVL {player.level}
              </span>
              <span className="text-xs text-white/70 font-orbitron">
                {player.xp}/{player.xpToNextLevel}
              </span>
            </div>
          </div>
          <Progress value={xpPercentage} className="h-1.5">
            <div
              className="h-full bg-gradient-to-r from-primary/60 to-secondary/60 transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </Progress>
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 flex-shrink-0">
          <img
            src={player.avatar || "/placeholder.svg?height=40&width=40"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
