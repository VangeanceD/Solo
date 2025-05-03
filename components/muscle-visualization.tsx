"use client"

import { useState, useEffect } from "react"
import type { Player, MuscleGroup, MuscleRank } from "@/lib/player"
import { getMuscleRankColor } from "@/lib/player"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Award, ChevronRight } from "lucide-react"

interface MuscleVisualizationProps {
  player: Player
}

export function MuscleVisualization({ player }: MuscleVisualizationProps) {
  const [activeView, setActiveView] = useState<"front" | "back">("front")
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null)
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroup | null>(null)

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

  // Add a glow effect to the selected muscle
  useEffect(() => {
    if (selectedMuscle) {
      const interval = setInterval(() => {
        const muscleElement = document.getElementById(`muscle-${selectedMuscle}`)
        if (muscleElement) {
          muscleElement.classList.toggle("animate-pulse-glow")
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [selectedMuscle])

  return (
    <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
      <div className="holographic-header flex items-center">
        <Award className="w-5 h-5 text-primary mr-2" />
        Muscle Ranks
      </div>

      <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-4">
        {["SSS", "SS", "S", "A", "B", "C", "D", "E", "F"].map((rank) => (
          <div
            key={rank}
            className={`${getMuscleRankColor(rank as MuscleRank)} text-center py-1 px-2 font-michroma text-sm border border-primary/10`}
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
                      id="muscle-shoulders"
                      d="M50,15 C55,15 58,18 58,25 C58,32 55,35 55,40 L55,45 C55,48 53,50 50,50 C47,50 45,48 45,45 L45,40 C45,35 42,32 42,25 C42,18 45,15 50,15 Z"
                      fill={`rgba(${selectedMuscle === "shoulders" || hoveredMuscle === "shoulders" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("shoulders")}
                      onMouseEnter={() => setHoveredMuscle("shoulders")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Chest */}
                    <path
                      id="muscle-chest"
                      d="M40,50 L40,70 C40,75 42,80 45,80 L55,80 C58,80 60,75 60,70 L60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z"
                      fill={`rgba(${selectedMuscle === "chest" || hoveredMuscle === "chest" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("chest")}
                      onMouseEnter={() => setHoveredMuscle("chest")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Arms */}
                    <path
                      id="muscle-arms-left"
                      d="M35,75 L40,60 L40,80 L35,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" || hoveredMuscle === "arms" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                      onMouseEnter={() => setHoveredMuscle("arms")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    <path
                      id="muscle-arms-right"
                      d="M65,75 L60,60 L60,80 L65,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" || hoveredMuscle === "arms" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                      onMouseEnter={() => setHoveredMuscle("arms")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Abs */}
                    <path
                      id="muscle-abs"
                      d="M40,80 L60,80 L60,110 L40,110 Z"
                      fill={`rgba(${selectedMuscle === "abs" || hoveredMuscle === "abs" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("abs")}
                      onMouseEnter={() => setHoveredMuscle("abs")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Legs */}
                    <path
                      id="muscle-legs-upper"
                      d="M40,110 L60,110 L65,120 L60,140 L40,140 L35,120 Z"
                      fill={`rgba(${selectedMuscle === "legs" || hoveredMuscle === "legs" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                      onMouseEnter={() => setHoveredMuscle("legs")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    <path
                      id="muscle-legs-lower"
                      d="M40,140 L60,140 L60,180 C60,185 55,190 50,190 C45,190 40,185 40,180 Z"
                      fill={`rgba(${selectedMuscle === "legs" || hoveredMuscle === "legs" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                      onMouseEnter={() => setHoveredMuscle("legs")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Muscle Stats
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(player.muscles).map(([muscle, rank]) => (
                    <div
                      key={muscle}
                      className={`p-3 rounded-none border transition-colors ${
                        selectedMuscle === muscle ? "border-primary animate-border-glow" : "border-primary/30"
                      } ${getMuscleRankColor(rank as MuscleRank)} hover:border-primary/60 cursor-pointer`}
                      onClick={() => handleMuscleClick(muscle as MuscleGroup)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-electrolize">{muscle}</span>
                        <span className="font-bold font-orbitron">{rank} Rank</span>
                      </div>

                      <AnimatePresence>
                        {selectedMuscle === muscle && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
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
                            <div className="text-xs mt-1 text-right flex items-center justify-end">
                              <span>{getMuscleInfo(muscle as MuscleGroup).progress}%</span>
                              {getMuscleInfo(muscle as MuscleGroup).progress >= 90 && (
                                <span className="ml-2 text-xs text-primary/80">Almost ready to rank up!</span>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-primary/70 font-electrolize">
                              <div className="flex items-center">
                                <ChevronRight className="w-3 h-3 mr-1" />
                                <span>Train this muscle with targeted workouts</span>
                              </div>
                              <div className="flex items-center">
                                <ChevronRight className="w-3 h-3 mr-1" />
                                <span>Reach 100% to rank up to the next level</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                      id="muscle-shoulders-back"
                      d="M50,15 C55,15 58,18 58,25 C58,32 55,35 55,40 L55,45 C55,48 53,50 50,50 C47,50 45,48 45,45 L45,40 C45,35 42,32 42,25 C42,18 45,15 50,15 Z"
                      fill={`rgba(${selectedMuscle === "shoulders" || hoveredMuscle === "shoulders" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("shoulders")}
                      onMouseEnter={() => setHoveredMuscle("shoulders")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Back */}
                    <path
                      id="muscle-back-upper"
                      d="M40,50 L40,70 C40,75 42,80 45,80 L55,80 C58,80 60,75 60,70 L60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z"
                      fill={`rgba(${selectedMuscle === "back" || hoveredMuscle === "back" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("back")}
                      onMouseEnter={() => setHoveredMuscle("back")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Arms */}
                    <path
                      id="muscle-arms-left-back"
                      d="M35,75 L40,60 L40,80 L35,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" || hoveredMuscle === "arms" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                      onMouseEnter={() => setHoveredMuscle("arms")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    <path
                      id="muscle-arms-right-back"
                      d="M65,75 L60,60 L60,80 L65,95 Z"
                      fill={`rgba(${selectedMuscle === "arms" || hoveredMuscle === "arms" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("arms")}
                      onMouseEnter={() => setHoveredMuscle("arms")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Lower Back */}
                    <path
                      id="muscle-back-lower"
                      d="M40,80 L60,80 L60,110 L40,110 Z"
                      fill={`rgba(${selectedMuscle === "back" || hoveredMuscle === "back" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("back")}
                      onMouseEnter={() => setHoveredMuscle("back")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    {/* Legs */}
                    <path
                      id="muscle-legs-upper-back"
                      d="M40,110 L60,110 L65,120 L60,140 L40,140 L35,120 Z"
                      fill={`rgba(${selectedMuscle === "legs" || hoveredMuscle === "legs" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                      onMouseEnter={() => setHoveredMuscle("legs")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />

                    <path
                      id="muscle-legs-lower-back"
                      d="M40,140 L60,140 L60,180 C60,185 55,190 50,190 C45,190 40,185 40,180 Z"
                      fill={`rgba(${selectedMuscle === "legs" || hoveredMuscle === "legs" ? "0, 168, 255, 0.7" : "0, 168, 255, 0.3"})`}
                      stroke="rgba(0, 168, 255, 0.8)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/60 cursor-pointer"
                      onClick={() => handleMuscleClick("legs")}
                      onMouseEnter={() => setHoveredMuscle("legs")}
                      onMouseLeave={() => setHoveredMuscle(null)}
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Muscle Stats
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(player.muscles).map(([muscle, rank]) => (
                    <div
                      key={muscle}
                      className={`p-3 rounded-none border transition-colors ${
                        selectedMuscle === muscle ? "border-primary animate-border-glow" : "border-primary/30"
                      } ${getMuscleRankColor(rank as MuscleRank)} hover:border-primary/60 cursor-pointer`}
                      onClick={() => handleMuscleClick(muscle as MuscleGroup)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-electrolize">{muscle}</span>
                        <span className="font-bold font-orbitron">{rank} Rank</span>
                      </div>

                      <AnimatePresence>
                        {selectedMuscle === muscle && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
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
                            <div className="text-xs mt-1 text-right flex items-center justify-end">
                              <span>{getMuscleInfo(muscle as MuscleGroup).progress}%</span>
                              {getMuscleInfo(muscle as MuscleGroup).progress >= 90 && (
                                <span className="ml-2 text-xs text-primary/80">Almost ready to rank up!</span>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-primary/70 font-electrolize">
                              <div className="flex items-center">
                                <ChevronRight className="w-3 h-3 mr-1" />
                                <span>Train this muscle with targeted workouts</span>
                              </div>
                              <div className="flex items-center">
                                <ChevronRight className="w-3 h-3 mr-1" />
                                <span>Reach 100% to rank up to the next level</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
