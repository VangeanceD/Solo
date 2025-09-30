"use client"

import { Trophy } from "lucide-react"

interface HunterRankBadgeProps {
  level: number
  className?: string
}

export function HunterRankBadge({ level, className = "" }: HunterRankBadgeProps) {
  const getRank = (level: number) => {
    if (level >= 100) return { rank: "SSS", color: "from-yellow-400 to-orange-500", glow: "shadow-yellow-500/50" }
    if (level >= 80) return { rank: "SS", color: "from-purple-400 to-pink-500", glow: "shadow-purple-500/50" }
    if (level >= 60) return { rank: "S", color: "from-red-400 to-pink-500", glow: "shadow-red-500/50" }
    if (level >= 45) return { rank: "A", color: "from-orange-400 to-red-500", glow: "shadow-orange-500/50" }
    if (level >= 30) return { rank: "B", color: "from-blue-400 to-cyan-500", glow: "shadow-blue-500/50" }
    if (level >= 20) return { rank: "C", color: "from-green-400 to-emerald-500", glow: "shadow-green-500/50" }
    if (level >= 10) return { rank: "D", color: "from-gray-400 to-gray-500", glow: "shadow-gray-500/50" }
    return { rank: "E", color: "from-gray-500 to-gray-600", glow: "shadow-gray-600/50" }
  }

  const { rank, color, glow } = getRank(level)

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${color} rounded-sm shadow-lg ${glow} ${className}`}
    >
      <Trophy className="w-4 h-4 text-white" />
      <span className="font-audiowide text-white font-bold text-sm tracking-wider">{rank}-RANK</span>
    </div>
  )
}
