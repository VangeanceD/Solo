"use client"

import { type Player, XP_PER_LEVEL, getRankDescription } from "@/lib/player"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Settings, Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface HeaderInfoProps {
  player: Player
}

export function HeaderInfo({ player }: HeaderInfoProps) {
  const router = useRouter()

  // Calculate XP progress
  const xpForCurrentLevel = (player.level - 1) * XP_PER_LEVEL
  const xpForNextLevel = player.level * XP_PER_LEVEL
  const currentLevelProgress = player.xp - xpForCurrentLevel
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel
  const progressPercentage = (currentLevelProgress / xpNeededForNextLevel) * 100

  return (
    <motion.div
      className="mb-6 bg-black/40 p-4 rounded-none border border-primary/30 flex flex-col md:flex-row justify-between items-center holographic-ui"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4 md:mb-0">
        <div className="relative mr-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow overflow-hidden border-2 border-primary">
            {player.profilePicture ? (
              <Image
                src={player.profilePicture || "/placeholder.svg"}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary solo-text font-michroma">
                {player.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-black w-8 h-8 rounded-full flex items-center justify-center font-bold font-orbitron text-sm border-2 border-black">
            {player.level}
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-white solo-text font-michroma mr-2 glow-text">{player.name}</h2>
            {player.selectedTitle && (
              <span className="text-xs bg-primary/20 px-2 py-1 text-primary/80 font-electrolize">
                {player.selectedTitle}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-primary/70 mr-2 font-electrolize">Rank {player.rank}</span>
            <span className="text-primary/70 font-electrolize">{player.xp} XP</span>
          </div>
          <div className="text-xs text-primary/50 font-electrolize">{getRankDescription(player.rank)}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-yellow-900/30 px-3 py-1 rounded-none border border-yellow-500/30">
          <Coins className="text-yellow-500 w-5 h-5 mr-2" />
          <span className="text-yellow-500 font-bold font-orbitron">{player.coins}</span>
        </div>

        <button
          onClick={() => router.push("/settings")}
          className="bg-primary/10 p-2 rounded-none hover:bg-primary/20 transition-colors border border-primary/30"
        >
          <Settings className="text-primary w-5 h-5" />
        </button>
      </div>

      <div className="w-full md:w-1/3 mt-4 md:mt-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-primary/70 text-sm font-michroma">Level Progress</span>
          <span className="text-primary/70 text-sm font-orbitron">
            {currentLevelProgress}/{xpNeededForNextLevel}
          </span>
        </div>
        <Progress value={progressPercentage} className="progress-bar h-2">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </Progress>
      </div>
    </motion.div>
  )
}
