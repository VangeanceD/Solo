"use client"

import { useState } from "react"
import type { Player, MuscleGroup, MuscleRank } from "@/lib/player"
import { getMuscleRankColor } from "@/lib/player"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface MuscleVisualizationProps {
  player: Player
}

export function MuscleVisualization({ player }: MuscleVisualizationProps) {
  const [activeView, setActiveView] = useState<"front" | "back">("front")
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null)

  const handleMuscleClick = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle === selectedMuscle ? null : muscle)
  }

  const getMuscleInfo = (muscle: MuscleGroup) => {
    const muscleProgress = player.muscleProgress.find((m) => m.group === muscle)
    return {
      rank: player.muscles[muscle],
      progress: muscleProgress?.progress || 0,
    }
  }

  return (
    <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
      <div className="holographic-header">Muscle Ranks</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {["SSS", "SS", "S", "A", "B", "C", "D", "E", "F"].map((rank) => (
          <div
            key={rank}
            className={`${getMuscleRankColor(rank as MuscleRank)} text-center py-1 px-2 font-michroma text-sm`}
          >
            {rank} Rank
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <Tabs defaultValue="front" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger
              value="front"
              onClick={() => setActiveView("front")}
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Front View
            </TabsTrigger>
            <TabsTrigger
              value="back"
              onClick={() => setActiveView("back")}
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Back View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="front" className="mt-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-[300px] h-[500px] bg-black/50 border border-primary/30 p-4 rounded-none">
                  {/* Front view muscle diagram */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=480&width=280"
                      alt="Front Muscle View"
                      width={280}
                      height={480}
                      className="opacity-90"
                    />
                  </div>

                  <svg viewBox="0 0 100 200" className="w-full h-full relative z-10">
                    {/* Shoulders */}
                    <path
                      d="M50,15 C55,15 58,18 58,25 C58,32 55,35 55,40 L55,45 C55,48 53,50 50,50 C47,50 45,48 45,45 L45,40 C45,35 42,32 42,25 C42,18 45,15 50,15 Z"
                      fill={`rgba(${selectedMuscle === "shoulders" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("shoulders")}
                    />

                    {/* Chest */}
                    <path
                      d="M40,50 L40,70 C40,75 42,80 45,80 L55,80 C58,80 60,75 60,70 L60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z"
                      fill={`rgba(${selectedMuscle === "chest" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("chest")}
                    />

                    {/* Arms */}
                    <path
                      d="M35,75 L40,60 L40,80 L35,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                    />

                    <path
                      d="M65,75 L60,60 L60,80 L65,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                    />

                    {/* Abs */}
                    <path
                      d="M40,80 L60,80 L60,110 L40,110 Z"
                      fill={`rgba(${selectedMuscle === "abs" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("abs")}
                    />

                    {/* Legs */}
                    <path
                      d="M40,110 L60,110 L65,120 L60,140 L40,140 L35,120 Z"
                      fill={`rgba(${selectedMuscle === "legs" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                    />

                    <path
                      d="M40,140 L60,140 L60,180 C60,185 55,190 50,190 C45,190 40,185 40,180 Z"
                      fill={`rgba(${selectedMuscle === "legs" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma">Muscle Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(player.muscles).map(([muscle, rank]) => (
                    <div
                      key={muscle}
                      className={`p-3 rounded-none border transition-colors ${
                        selectedMuscle === muscle ? "border-primary animate-border-glow" : "border-primary/30"
                      } ${getMuscleRankColor(rank as MuscleRank)}`}
                      onClick={() => handleMuscleClick(muscle as MuscleGroup)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-electrolize">{muscle}</span>
                        <span className="font-bold font-orbitron">{rank} Rank</span>
                      </div>

                      {selectedMuscle === muscle && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2"
                        >
                          <div className="progress-bar mt-1">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${getMuscleInfo(muscle as MuscleGroup).progress}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-right">
                            {getMuscleInfo(muscle as MuscleGroup).progress}%
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="back" className="mt-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-[300px] h-[500px] bg-black/50 border border-primary/30 p-4 rounded-none">
                  {/* Back view muscle diagram */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=480&width=280"
                      alt="Back Muscle View"
                      width={280}
                      height={480}
                      className="opacity-90"
                    />
                  </div>

                  <svg viewBox="0 0 100 200" className="w-full h-full relative z-10">
                    {/* Shoulders */}
                    <path
                      d="M50,15 C55,15 58,18 58,25 C58,32 55,35 55,40 L55,45 C55,48 53,50 50,50 C47,50 45,48 45,45 L45,40 C45,35 42,32 42,25 C42,18 45,15 50,15 Z"
                      fill={`rgba(${selectedMuscle === "shoulders" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("shoulders")}
                    />

                    {/* Back */}
                    <path
                      d="M40,50 L40,70 C40,75 42,80 45,80 L55,80 C58,80 60,75 60,70 L60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z"
                      fill={`rgba(${selectedMuscle === "back" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("back")}
                    />

                    {/* Arms */}
                    <path
                      d="M35,75 L40,60 L40,80 L35,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                    />

                    <path
                      d="M65,75 L60,60 L60,80 L65,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                    />

                    {/* Lower Back */}
                    <path
                      d="M40,80 L60,80 L60,110 L40,110 Z"
                      fill={`rgba(${selectedMuscle === "back" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("back")}
                    />

                    {/* Legs */}
                    <path
                      d="M40,110 L60,110 L65,120 L60,140 L40,140 L35,120 Z"
                      fill={`rgba(${selectedMuscle === "legs" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                    />

                    <path
                      d="M40,140 L60,140 L60,180 C60,185 55,190 50,190 C45,190 40,185 40,180 Z"
                      fill={`rgba(${selectedMuscle === "legs" ? "0, 168, 255, 0.5" : "0, 168, 255, 0.2"})`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma">Muscle Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(player.muscles).map(([muscle, rank]) => (
                    <div
                      key={muscle}
                      className={`p-3 rounded-none border transition-colors ${
                        selectedMuscle === muscle ? "border-primary animate-border-glow" : "border-primary/30"
                      } ${getMuscleRankColor(rank as MuscleRank)}`}
                      onClick={() => handleMuscleClick(muscle as MuscleGroup)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-electrolize">{muscle}</span>
                        <span className="font-bold font-orbitron">{rank} Rank</span>
                      </div>

                      {selectedMuscle === muscle && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2"
                        >
                          <div className="progress-bar mt-1">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${getMuscleInfo(muscle as MuscleGroup).progress}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-right">
                            {getMuscleInfo(muscle as MuscleGroup).progress}%
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
