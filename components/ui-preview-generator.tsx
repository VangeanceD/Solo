"use client"
import { Star, Home, Trophy, Calendar } from "lucide-react"

interface UIPreviewProps {
  variant: "cyberpunk" | "minimal-dark" | "anime-vibrant" | "solo-leveling" | "glass-morphism" | "retro-game"
}

export function UIPreview({ variant }: UIPreviewProps) {
  const styles = {
    cyberpunk: {
      bg: "from-blue-950 via-cyan-950 to-purple-950",
      primary: "text-cyan-400",
      accent: "bg-cyan-500/20 border-cyan-500/50",
      card: "bg-black/60 border-cyan-500/30",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    },
    "minimal-dark": {
      bg: "from-gray-900 via-gray-800 to-gray-900",
      primary: "text-blue-400",
      accent: "bg-blue-500/10 border-blue-500/30",
      card: "bg-gray-800/80 border-gray-700",
      glow: "shadow-lg",
    },
    "anime-vibrant": {
      bg: "from-pink-950 via-purple-950 to-blue-950",
      primary: "text-pink-400",
      accent: "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/50",
      card: "bg-black/70 border-pink-500/40",
      glow: "shadow-[0_0_25px_rgba(236,72,153,0.4)]",
    },
    "solo-leveling": {
      bg: "from-violet-950 via-purple-950 to-fuchsia-950",
      primary: "text-purple-400",
      accent: "bg-purple-500/20 border-purple-500/50",
      card: "bg-black/80 border-purple-500/30",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    },
    "glass-morphism": {
      bg: "from-cyan-950 via-blue-950 to-indigo-950",
      primary: "text-cyan-300",
      accent: "bg-white/5 backdrop-blur-xl border-white/20",
      card: "bg-white/10 backdrop-blur-md border-white/20",
      glow: "shadow-[0_8px_32px_rgba(31,38,135,0.37)]",
    },
    "retro-game": {
      bg: "from-black via-green-950 to-black",
      primary: "text-green-400",
      accent: "bg-green-500/20 border-green-500/50",
      card: "bg-black/90 border-green-500/50",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    },
  }

  const style = styles[variant]

  return (
    <div className={`w-full h-full bg-gradient-to-br ${style.bg} p-4 overflow-hidden`}>
      {/* Header */}
      <div className={`${style.card} ${style.glow} rounded-lg p-3 mb-3`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-sm font-bold ${style.primary}`}>HUNTER</div>
            <div className="text-xs text-white/60">Level 15</div>
          </div>
          <div className={`${style.accent} px-3 py-1 rounded-full text-xs font-bold ${style.primary}`}>2,450 XP</div>
        </div>
        <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${style.primary.replace("text-", "from-")} to-white/50 w-3/4`} />
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-2">
        <div className={`${style.card} ${style.glow} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <Star className={`w-4 h-4 ${style.primary}`} />
            <span className={`text-sm font-bold ${style.primary}`}>Active Quest</span>
          </div>
          <div className="text-xs text-white/80">Complete Daily Workout</div>
          <div className="text-xs text-white/50 mt-1">30 minutes remaining</div>
        </div>

        <div className={`${style.card} ${style.glow} rounded-lg p-3`}>
          <div className="text-xs text-white/70 mb-2">Daily Progress</div>
          <div className="flex gap-2">
            <div className={`${style.accent} flex-1 p-2 rounded text-center`}>
              <div className={`text-lg font-bold ${style.primary}`}>3/5</div>
              <div className="text-xs text-white/60">Tasks</div>
            </div>
            <div className={`${style.accent} flex-1 p-2 rounded text-center`}>
              <div className={`text-lg font-bold ${style.primary}`}>75%</div>
              <div className="text-xs text-white/60">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Preview */}
      <div className={`${style.card} ${style.glow} rounded-lg mt-3 p-2 flex justify-around`}>
        <Home className={`w-5 h-5 ${style.primary}`} />
        <Star className="w-5 h-5 text-white/40" />
        <Calendar className="w-5 h-5 text-white/40" />
        <Trophy className="w-5 h-5 text-white/40" />
      </div>
    </div>
  )
}
