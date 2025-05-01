"use client"

import type React from "react"

import type { Player } from "@/lib/player"
import { getRatingLabel } from "@/lib/player"
import { getRankDescription } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Sword, Shield, Brain, Heart, Dumbbell, Lightbulb, Trophy, Award, UserCircle } from "lucide-react"
import { motion } from "framer-motion"
import { MuscleVisualization } from "@/components/muscle-visualization"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ProfilePageProps {
  player: Player
}

export function ProfilePage({ player }: ProfilePageProps) {
  const router = useRouter()

  const getOverallRating = () => {
    const stats = player.stats
    const average = (stats.strength + stats.endurance + stats.agility) / 3
    return getRatingLabel(average)
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Hunter Profile</div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow animate-scan-effect overflow-hidden border-2 border-primary">
              {player.profilePicture ? (
                <Image
                  src={player.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-primary solo-text font-michroma">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center font-bold font-orbitron text-lg border-2 border-black">
              {player.level}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-primary glow-text solo-text font-michroma">{player.name}</h2>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className="level-badge px-3 py-1 rounded-none">
                  <span className="text-primary font-orbitron">Level {player.level}</span>
                </div>
                <div className="text-primary/70 font-electrolize">Rank {player.rank}</div>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-primary/70 font-orbitron">{player.xp} XP</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-white/70 font-electrolize">{getRankDescription(player.rank)}</div>

            <Button
              onClick={() => router.push("/customize-profile")}
              className="mt-3 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma flex items-center"
            >
              <UserCircle className="w-4 h-4 mr-2" /> CUSTOMIZE PROFILE
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma flex items-center">
            <Trophy className="w-5 h-5 mr-2" /> Character Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {renderStatCard("Strength", player.stats.strength, <Sword className="w-5 h-5" />)}
            {renderStatCard("Endurance", player.stats.endurance, <Shield className="w-5 h-5" />)}
            {renderStatCard("Focus", player.stats.focus, <Brain className="w-5 h-5" />)}
            {renderStatCard("Discipline", player.stats.discipline, <Heart className="w-5 h-5" />)}
            {renderStatCard("Agility", player.stats.agility, <Dumbbell className="w-5 h-5" />)}
            {renderStatCard("Intelligence", player.stats.intelligence, <Lightbulb className="w-5 h-5" />)}
          </div>
        </div>

        <MuscleVisualization player={player} />

        <div className="mt-6">
          <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma flex items-center">
            <Award className="w-5 h-5 mr-2" /> Achievement Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderAchievement("Early Riser", "Complete 5 morning quests", 0, 5)}
            {renderAchievement("Mind Master", "Reach level 5 in Focus", player.stats.focus, 5)}
            {renderAchievement(
              "Iron Will",
              "Complete 10 quests",
              player.completedQuests ? player.completedQuests.length : 0,
              10,
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Recent Activity</div>
        <div className="space-y-3">
          {player.completedQuests && player.completedQuests.length > 0 ? (
            player.completedQuests.slice(0, 3).map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-black/60 p-3 rounded-none border border-primary/30 flex justify-between items-center quest-card"
              >
                <div>
                  <h4 className="text-primary font-michroma">{quest.title}</h4>
                  <p className="text-primary/60 text-sm font-electrolize">
                    {new Date(quest.completedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-primary font-orbitron">+{quest.xp} XP</div>
              </motion.div>
            ))
          ) : (
            <p className="text-primary/60 font-electrolize">No completed quests yet. Start your journey!</p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

function renderStatCard(label: string, value: number, icon: React.ReactNode) {
  return (
    <div className="bg-black/60 p-4 rounded-none border border-primary/30 quest-card holographic-ui">
      <div className="flex items-center space-x-2 text-primary/80">
        {icon}
        <span className="font-electrolize">{label}</span>
      </div>
      <p className="text-2xl font-bold text-primary mt-2 font-orbitron">{value}</p>
    </div>
  )
}

function renderAchievement(title: string, description: string, current: number, target: number) {
  const percentage = Math.min(100, (current / target) * 100)

  return (
    <div className="bg-black/60 p-4 rounded-none border border-primary/30 quest-card holographic-ui">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-primary font-michroma">{title}</h4>
        <span className="text-primary/70 font-orbitron">
          {current}/{target}
        </span>
      </div>
      <p className="text-primary/60 text-sm mb-2 font-electrolize">{description}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
