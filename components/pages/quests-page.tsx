"use client"

import type { Player, Quest, DailyQuest } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star, Timer, Dumbbell, Brain, Heart, List } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface QuestsPageProps {
  player: Player
  activeQuest: (Quest | DailyQuest) | null
  onStartQuest: (quest: Quest) => void
  onCompleteQuest: () => void
  onCancelQuest: () => void
}

export function QuestsPage({ player, activeQuest, onStartQuest, onCompleteQuest, onCancelQuest }: QuestsPageProps) {
  const router = useRouter()

  // Group quests by category
  const categories = {
    physical: { icon: Dumbbell, name: "Physical" },
    mental: { icon: Brain, name: "Mental" },
    health: { icon: Heart, name: "Health" },
    other: { icon: List, name: "Other" },
  }

  const questsByCategory: Record<string, Quest[]> = {}

  player.quests.forEach((quest) => {
    const category = quest.category || "other"
    if (!questsByCategory[category]) {
      questsByCategory[category] = []
    }
    questsByCategory[category].push(quest)
  })

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary glow-text solo-text font-audiowide">Available Quests</h2>
        <Button
          onClick={() => router.push("/create-quest")}
          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider flex items-center space-x-2 btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>NEW QUEST</span>
        </Button>
      </div>

      {Object.entries(questsByCategory).map(([category, quests], categoryIndex) => {
        if (quests.filter((q) => !q.completed).length === 0) return null

        const categoryInfo = categories[category as keyof typeof categories] || categories.other
        const CategoryIcon = categoryInfo.icon

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
          >
            <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border mt-4 holographic-ui">
              <div className="holographic-header">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="text-primary w-5 h-5" />
                  <span className="font-michroma">{categoryInfo.name} Quests</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests
                  .filter((q) => !q.completed)
                  .map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.05 }}
                      className="bg-black/60 p-4 rounded-none border border-primary/30 quest-card holographic-ui"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-primary font-michroma">{quest.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-primary/70" />
                          <span className="text-primary/70 font-orbitron">{quest.xp} XP</span>
                        </div>
                      </div>
                      <p className="text-primary/60 mt-2 font-electrolize">{quest.description}</p>
                      <div className="flex flex-wrap items-center mt-2 space-x-3">
                        <div className="flex items-center">
                          <Timer className="text-primary/70 w-4 h-4 mr-1" />
                          <span className="text-primary/60 font-orbitron">{quest.timeLimit} min</span>
                        </div>
                        {quest.stats && (
                          <div className="flex items-center space-x-1">
                            {quest.stats.map((stat) => (
                              <span
                                key={stat}
                                className="px-2 py-0.5 bg-primary/10 text-primary/70 rounded-none text-xs font-electrolize"
                              >
                                {stat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => onStartQuest(quest)}
                        className={`mt-4 w-full py-2 rounded-none border transition-colors tracking-wider btn-primary ${
                          activeQuest
                            ? "bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed"
                            : "bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                        }`}
                        disabled={!!activeQuest}
                      >
                        {activeQuest ? "QUEST IN PROGRESS" : "START QUEST"}
                      </Button>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
