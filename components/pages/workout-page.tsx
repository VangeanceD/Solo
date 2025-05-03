"use client"

import { useState, useEffect } from "react"
import type { Player, MuscleGroup, MuscleRank } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { useNotification } from "@/components/notification-provider"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Star,
  AlertTriangle,
  X,
  Check,
  Dumbbell,
  CalendarIcon,
  Activity,
  Flame,
  Award,
  TrendingUp,
  BarChart,
  Clock,
  Zap,
  Target,
} from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface WorkoutPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

// Define workout types
type WorkoutType = "strength" | "cardio" | "flexibility" | "balance" | "endurance"
type MuscleTarget = MuscleGroup | "cardio" | "core" | "forearms" | "biceps" | "triceps"

interface Exercise {
  id: string
  name: string
  muscleTargets: MuscleTarget[]
  sets?: number
  reps?: number
  duration?: number
  xpReward: number
  description: string
  image?: string
}

interface Workout {
  id: string
  name: string
  type: WorkoutType
  exercises: Exercise[]
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced" | "elite"
  xpReward: number
  muscleTargets: MuscleTarget[]
  completed?: boolean
  completedAt?: Date
  custom: boolean
  image?: string
}

// Default exercises with improved descriptions
const defaultExercises: Exercise[] = [
  {
    id: "ex1",
    name: "Push-ups",
    muscleTargets: ["chest", "arms", "shoulders"],
    sets: 3,
    reps: 10,
    xpReward: 50,
    description:
      "Standard push-ups targeting chest, triceps, and shoulders. Keep your body straight and core engaged throughout the movement.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex2",
    name: "Pull-ups",
    muscleTargets: ["back", "arms"],
    sets: 3,
    reps: 8,
    xpReward: 70,
    description:
      "Pull-ups targeting back and biceps. Grip the bar with hands shoulder-width apart and pull your body up until your chin clears the bar.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex3",
    name: "Squats",
    muscleTargets: ["legs"],
    sets: 4,
    reps: 12,
    xpReward: 60,
    description:
      "Bodyweight squats targeting quadriceps, hamstrings, and glutes. Keep your chest up and back straight as you lower your body.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex4",
    name: "Plank",
    muscleTargets: ["core", "abs"],
    duration: 60,
    xpReward: 40,
    description:
      "Plank position held for time to strengthen core. Maintain a straight line from head to heels and engage your core muscles.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex5",
    name: "Running",
    muscleTargets: ["cardio", "legs"],
    duration: 1800,
    xpReward: 100,
    description:
      "30-minute run for cardiovascular endurance. Maintain a steady pace that challenges you but allows you to complete the full duration.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex6",
    name: "Bicep Curls",
    muscleTargets: ["biceps", "arms"],
    sets: 3,
    reps: 12,
    xpReward: 40,
    description:
      "Bicep curls with dumbbells. Keep your elbows close to your sides and focus on controlled movements throughout the exercise.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex7",
    name: "Tricep Dips",
    muscleTargets: ["triceps", "arms"],
    sets: 3,
    reps: 12,
    xpReward: 40,
    description:
      "Tricep dips on a bench or chair. Lower your body with control and push back up by extending your elbows fully.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex8",
    name: "Shoulder Press",
    muscleTargets: ["shoulders"],
    sets: 3,
    reps: 10,
    xpReward: 50,
    description:
      "Overhead press targeting shoulders. Press the weights directly overhead, keeping your core engaged and avoiding arching your back.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex9",
    name: "Crunches",
    muscleTargets: ["abs", "core"],
    sets: 3,
    reps: 15,
    xpReward: 30,
    description:
      "Abdominal crunches for core strength. Focus on the contraction of your abdominal muscles rather than the range of motion.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "ex10",
    name: "Deadlifts",
    muscleTargets: ["back", "legs"],
    sets: 3,
    reps: 8,
    xpReward: 80,
    description:
      "Deadlifts targeting lower back, hamstrings, and glutes. Maintain a neutral spine and engage your core throughout the movement.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Default workouts with improved descriptions and images
const defaultWorkouts: Workout[] = [
  {
    id: "w1",
    name: "Full Body Strength",
    type: "strength",
    exercises: [defaultExercises[0], defaultExercises[1], defaultExercises[2], defaultExercises[8]],
    duration: 45,
    difficulty: "beginner",
    xpReward: 200,
    muscleTargets: ["chest", "back", "legs", "core"],
    custom: false,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "w2",
    name: "Upper Body Focus",
    type: "strength",
    exercises: [
      defaultExercises[0],
      defaultExercises[1],
      defaultExercises[5],
      defaultExercises[6],
      defaultExercises[7],
    ],
    duration: 40,
    difficulty: "intermediate",
    xpReward: 250,
    muscleTargets: ["chest", "back", "arms", "shoulders"],
    custom: false,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "w3",
    name: "Cardio Blast",
    type: "cardio",
    exercises: [defaultExercises[4]],
    duration: 30,
    difficulty: "intermediate",
    xpReward: 150,
    muscleTargets: ["cardio", "legs"],
    custom: false,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "w4",
    name: "Leg Day",
    type: "strength",
    exercises: [defaultExercises[2], defaultExercises[9]],
    duration: 35,
    difficulty: "advanced",
    xpReward: 300,
    muscleTargets: ["legs", "back"],
    custom: false,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "w5",
    name: "Core Crusher",
    type: "strength",
    exercises: [defaultExercises[3], defaultExercises[8]],
    duration: 25,
    difficulty: "beginner",
    xpReward: 120,
    muscleTargets: ["core", "abs"],
    custom: false,
    image: "/placeholder.svg?height=300&width=500",
  },
]

export function WorkoutPage({ player, setPlayer }: WorkoutPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("calendar")
  const [workouts, setWorkouts] = useState<Workout[]>(defaultWorkouts)
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [workoutProgress, setWorkoutProgress] = useState(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseTimer, setExerciseTimer] = useState<NodeJS.Timeout | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isHighStakes, setIsHighStakes] = useState(false)
  const [workoutFilter, setWorkoutFilter] = useState<WorkoutType | "all">("all")

  const { showNotification } = useNotification()

  // Load completed workouts from player data
  useEffect(() => {
    if (player.completedWorkouts) {
      setCompletedWorkouts(player.completedWorkouts)
    }

    // Try to load workouts from Supabase
    const fetchWorkouts = async () => {
      try {
        const { data, error } = await supabase.from("workouts").select("*").eq("user_id", player.id)

        if (error) {
          console.error("Error fetching workouts:", error)
        } else if (data && data.length > 0) {
          // Merge with default workouts
          const customWorkouts = data.map((w) => ({
            ...w,
            custom: true,
          }))
          setWorkouts([...defaultWorkouts, ...customWorkouts])
        }
      } catch (err) {
        console.error("Failed to fetch workouts:", err)
      }
    }

    fetchWorkouts()
  }, [player])

  // Get workouts for selected date
  const getWorkoutsForDate = (date: Date) => {
    return completedWorkouts.filter((workout) => {
      if (!workout.completedAt) return false
      const workoutDate = new Date(workout.completedAt)
      return (
        workoutDate.getDate() === date.getDate() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Get filtered workouts
  const getFilteredWorkouts = () => {
    if (workoutFilter === "all") return workouts
    return workouts.filter((workout) => workout.type === workoutFilter)
  }

  // Start workout
  const startWorkout = (workout: Workout) => {
    if (isHighStakes) {
      showNotification({
        title: "HIGH STAKES MODE",
        message:
          "You've activated high stakes mode! Complete this workout to earn DOUBLE XP, but failing will cost you TRIPLE XP. Are you sure you want to continue?",
        type: "warning",
        confirmText: "Accept Challenge",
        cancelText: "Cancel",
        onConfirm: () => {
          setActiveWorkout(workout)
          setCurrentExerciseIndex(0)
          setWorkoutProgress(0)
          setShowWorkoutModal(true)
          startExerciseTimer(workout.exercises[0])
        },
      })
    } else {
      setActiveWorkout(workout)
      setCurrentExerciseIndex(0)
      setWorkoutProgress(0)
      setShowWorkoutModal(true)
      startExerciseTimer(workout.exercises[0])
    }
  }

  // Start exercise timer
  const startExerciseTimer = (exercise: Exercise) => {
    if (exercise.duration) {
      setRemainingTime(exercise.duration)
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setExerciseTimer(timer)
    }
  }

  // Complete current exercise
  const completeExercise = () => {
    if (!activeWorkout) return

    if (exerciseTimer) {
      clearInterval(exerciseTimer)
      setExerciseTimer(null)
    }

    const nextExerciseIndex = currentExerciseIndex + 1
    const progress = (nextExerciseIndex / activeWorkout.exercises.length) * 100

    setWorkoutProgress(progress)

    if (nextExerciseIndex >= activeWorkout.exercises.length) {
      completeWorkout()
    } else {
      setCurrentExerciseIndex(nextExerciseIndex)
      startExerciseTimer(activeWorkout.exercises[nextExerciseIndex])
    }
  }

  // Fail workout
  const failWorkout = () => {
    if (!activeWorkout) return

    if (exerciseTimer) {
      clearInterval(exerciseTimer)
      setExerciseTimer(null)
    }

    // Calculate XP penalty - triple if high stakes
    const xpPenalty = isHighStakes ? activeWorkout.xpReward * 3 : activeWorkout.xpReward

    // Update player XP
    const updatedPlayer = { ...player }
    updatedPlayer.xp = Math.max(0, updatedPlayer.xp - xpPenalty)
    setPlayer(updatedPlayer)

    showNotification({
      title: "WORKOUT FAILED",
      message: `You failed to complete the workout. You lost ${xpPenalty} XP!`,
      type: "error",
    })

    setShowWorkoutModal(false)
    setActiveWorkout(null)
    setIsHighStakes(false)
  }

  // Complete workout
  const completeWorkout = () => {
    if (!activeWorkout) return

    // Calculate XP reward - double if high stakes
    const xpReward = isHighStakes ? activeWorkout.xpReward * 2 : activeWorkout.xpReward

    // Update player XP and muscles
    const updatedPlayer = { ...player }
    updatedPlayer.xp += xpReward

    // Update muscle progress
    activeWorkout.muscleTargets.forEach((target) => {
      if (target in updatedPlayer.muscles) {
        const muscleGroup = target as MuscleGroup
        const muscleProgressIndex = updatedPlayer.muscleProgress.findIndex((m) => m.group === muscleGroup)

        if (muscleProgressIndex !== -1) {
          updatedPlayer.muscleProgress[muscleProgressIndex].progress += 5

          // Check if progress is enough to rank up
          if (updatedPlayer.muscleProgress[muscleProgressIndex].progress >= 100) {
            updatedPlayer.muscleProgress[muscleProgressIndex].progress = 0

            // Find current rank index
            const currentRank = updatedPlayer.muscles[muscleGroup]
            const rankIndex = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"].indexOf(currentRank)

            // Rank up if not already at max
            if (rankIndex < 8) {
              const newRank = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"][rankIndex + 1] as MuscleRank
              updatedPlayer.muscles[muscleGroup] = newRank
            }
          }
        }
      }
    })

    // Add to completed workouts
    const completedWorkout = {
      ...activeWorkout,
      completed: true,
      completedAt: new Date(),
    }

    if (!updatedPlayer.completedWorkouts) {
      updatedPlayer.completedWorkouts = []
    }

    updatedPlayer.completedWorkouts.unshift(completedWorkout)
    setCompletedWorkouts([completedWorkout, ...completedWorkouts])

    // Save to player
    setPlayer(updatedPlayer)

    // Try to save to Supabase
    const saveWorkoutHistory = async () => {
      try {
        await supabase.from("workout_history").insert({
          user_id: player.id,
          workout_id: activeWorkout.id,
          completed_at: new Date().toISOString(),
          xp_earned: xpReward,
        })
      } catch (err) {
        console.error("Failed to save workout history:", err)
      }
    }

    saveWorkoutHistory()

    showNotification({
      title: "WORKOUT COMPLETE",
      message: `Congratulations! You completed the workout and earned ${xpReward} XP!`,
      type: "success",
    })

    setShowWorkoutModal(false)
    setActiveWorkout(null)
    setIsHighStakes(false)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-900/30 text-green-400"
      case "intermediate":
        return "bg-blue-900/30 text-blue-400"
      case "advanced":
        return "bg-purple-900/30 text-purple-400"
      case "elite":
        return "bg-red-900/30 text-red-400"
      default:
        return "bg-primary/10 text-primary/70"
    }
  }

  // Get workout type icon
  const getWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="w-4 h-4" />
      case "cardio":
        return <Activity className="w-4 h-4" />
      case "flexibility":
        return <TrendingUp className="w-4 h-4" />
      case "balance":
        return <Target className="w-4 h-4" />
      case "endurance":
        return <Flame className="w-4 h-4" />
      default:
        return <Dumbbell className="w-4 h-4" />
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary glow-text solo-text font-audiowide">Workout System</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-none">
            <Trophy className="text-primary w-5 h-5" />
            <span className="text-primary font-bold font-orbitron">{completedWorkouts.length} Completed</span>
          </div>
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-none">
            <Star className="text-primary w-5 h-5" />
            <span className="text-primary font-bold font-orbitron">{player.xp} XP</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger
            value="workouts"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            Workouts
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
          >
            <BarChart className="w-4 h-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-0">
          <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
            <div className="holographic-header flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Workout Calendar
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-primary/30 bg-black/60 p-3"
                  classNames={{
                    day_today: "bg-primary/20 text-primary",
                    day_selected: "bg-primary text-primary-foreground",
                    day: "text-primary/70 hover:bg-primary/10 focus:bg-primary/20 rounded-sm",
                    day_range_middle: "bg-primary/10 text-primary",
                    day_hidden: "invisible",
                    nav_button: "text-primary hover:bg-primary/10",
                    caption: "text-primary font-michroma",
                    table: "font-electrolize",
                    head_cell: "text-primary/50 font-michroma",
                    cell: "text-primary/70 p-0",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    caption_label: "text-primary",
                  }}
                  components={{
                    DayContent: ({ day, date }) => {
                      // Check if there are workouts on this date
                      const hasWorkouts = getWorkoutsForDate(date).length > 0

                      return (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {day}
                          {hasWorkouts && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                          )}
                        </div>
                      )
                    },
                  }}
                />
              </div>

              <div className="w-full md:w-1/2">
                <div className="bg-black/60 p-4 rounded-none border border-primary/30 h-full">
                  <h3 className="text-lg font-bold text-primary mb-3 font-michroma flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                  </h3>

                  {selectedDate && (
                    <>
                      <div className="mb-4">
                        <h4 className="text-primary/80 font-electrolize mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary/80" />
                          Completed Workouts:
                        </h4>
                        {getWorkoutsForDate(selectedDate).length > 0 ? (
                          <div className="space-y-2">
                            {getWorkoutsForDate(selectedDate).map((workout, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-primary/10 p-3 rounded-none border border-primary/30 flex justify-between items-center hover:bg-primary/20 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-none bg-primary/20 flex items-center justify-center">
                                    {getWorkoutTypeIcon(workout.type)}
                                  </div>
                                  <div>
                                    <div className="text-primary font-michroma">{workout.name}</div>
                                    <div className="text-primary/60 text-sm font-electrolize flex items-center gap-2">
                                      <span className={`px-2 py-0.5 text-xs ${getDifficultyColor(workout.difficulty)}`}>
                                        {workout.difficulty}
                                      </span>
                                      <span>•</span>
                                      <Clock className="w-3 h-3 text-primary/60" />
                                      <span>{workout.duration} min</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-primary font-orbitron flex items-center gap-1">
                                  <Zap className="w-4 h-4 text-primary" />+{workout.xpReward} XP
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-primary/60 font-electrolize p-4 border border-dashed border-primary/30 text-center bg-black/30">
                            No workouts completed on this date.
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => setActiveTab("workouts")}
                        className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary flex items-center justify-center gap-2"
                      >
                        <Dumbbell className="w-4 h-4" />
                        START NEW WORKOUT
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="mt-0">
          <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
            <div className="holographic-header flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              Available Workouts
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full ${isHighStakes ? "bg-red-500" : "bg-primary/20"} flex items-center justify-center cursor-pointer transition-colors duration-300`}
                  onClick={() => setIsHighStakes(!isHighStakes)}
                >
                  {isHighStakes && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`font-michroma ${isHighStakes ? "text-red-500" : "text-primary/70"}`}>
                  HIGH STAKES MODE
                </span>
              </div>

              {isHighStakes && (
                <div className="text-red-500 text-sm font-electrolize flex items-center">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Double XP rewards, triple XP penalties!
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-primary/70 font-michroma text-sm">Filter:</span>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWorkoutFilter("all")}
                    className={`px-3 py-1 rounded-none border ${workoutFilter === "all" ? "bg-primary/20 text-primary border-primary" : "border-primary/30 text-primary/70"}`}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWorkoutFilter("strength")}
                    className={`px-3 py-1 rounded-none border ${workoutFilter === "strength" ? "bg-primary/20 text-primary border-primary" : "border-primary/30 text-primary/70"}`}
                  >
                    Strength
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWorkoutFilter("cardio")}
                    className={`px-3 py-1 rounded-none border ${workoutFilter === "cardio" ? "bg-primary/20 text-primary border-primary" : "border-primary/30 text-primary/70"}`}
                  >
                    Cardio
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredWorkouts().map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-black/60 p-4 rounded-none border border-primary/30 quest-card holographic-ui overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-primary font-michroma">{workout.name}</h3>
                    <Badge className={`${getDifficultyColor(workout.difficulty)} rounded-none`}>
                      {workout.difficulty}
                    </Badge>
                  </div>

                  <div className="mt-2 text-primary/60 font-electrolize">
                    <div className="flex items-center gap-2 mb-1">
                      {getWorkoutTypeIcon(workout.type)}
                      <span className="capitalize">{workout.type}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-primary/60" />
                      <span>{workout.duration} minutes</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {workout.muscleTargets.map((target) => (
                        <span
                          key={target}
                          className="px-2 py-0.5 bg-primary/10 text-primary/70 text-xs font-electrolize"
                        >
                          {target}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-primary/80 font-orbitron">
                      {isHighStakes ? (
                        <span className="text-red-500 flex items-center gap-1">
                          <Flame className="w-4 h-4" />+{workout.xpReward * 2} XP
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-primary" />+{workout.xpReward} XP
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedWorkout(workout)
                        startWorkout(workout)
                      }}
                      className="py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary flex items-center gap-2"
                    >
                      <Dumbbell className="w-4 h-4" />
                      START
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
            <div className="holographic-header flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Muscle Progress
            </div>

            <div className="flex flex-col md:flex-row gap-6">
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
                      d="M50,15 C55,15 58,18 58,25 C58,32 55,35 55,40 L55,45 C55,48 53,50 50,50 C47,50 45,48 45,45 L45,40 C45,35 42,32 42,25 C42,18 45,15 50,15 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "shoulders")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />

                    {/* Chest */}
                    <path
                      d="M40,50 L40,70 C40,75 42,80 45,80 L55,80 C58,80 60,75 60,70 L60,50 C60,45 55,40 50,40 C45,40 40,45 40,50 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "chest")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />

                    {/* Arms */}
                    <path
                      d="M35,75 L40,60 L40,80 L35,95 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "arms")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />

                    <path
                      d="M65,75 L60,60 L60,80 L65,95 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "arms")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />

                    {/* Abs */}
                    <path
                      d="M40,80 L60,80 L60,110 L40,110 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "abs")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />

                    {/* Legs */}
                    <path
                      d="M40,110 L60,110 L65,120 L60,140 L40,140 L35,120 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "legs")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />

                    <path
                      d="M40,140 L60,140 L60,180 C60,185 55,190 50,190 C45,190 40,185 40,180 Z"
                      fill={`rgba(0, 168, 255, ${player.muscleProgress.find((m) => m.group === "legs")?.progress || 0}/100 * 0.8)`}
                      stroke="rgba(0, 168, 255, 0.5)"
                      strokeWidth="1"
                      className="transition-all duration-300 hover:fill-primary/40 cursor-pointer"
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Muscle Stats
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(player.muscles).map(([muscle, rank]) => (
                    <div
                      key={muscle}
                      className={`p-3 rounded-none border border-primary/30 ${getMuscleRankColor(rank as MuscleRank)} hover:border-primary/60 transition-colors`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-electrolize">{muscle}</span>
                        <span className="font-bold font-orbitron">{rank} Rank</span>
                      </div>

                      <div className="mt-2">
                        <div className="progress-bar mt-1">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${player.muscleProgress.find((m) => m.group === (muscle as MuscleGroup))?.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1 text-right">
                          {player.muscleProgress.find((m) => m.group === (muscle as MuscleGroup))?.progress || 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-primary mb-3 solo-text font-michroma flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Workout Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/60 p-3 rounded-none border border-primary/30 hover:border-primary/60 transition-colors">
                      <div className="text-primary/70 font-electrolize flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary/70" />
                        Total Workouts
                      </div>
                      <div className="text-2xl font-bold text-primary font-orbitron">{completedWorkouts.length}</div>
                    </div>
                    <div className="bg-black/60 p-3 rounded-none border border-primary/30 hover:border-primary/60 transition-colors">
                      <div className="text-primary/70 font-electrolize flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary/70" />
                        This Week
                      </div>
                      <div className="text-2xl font-bold text-primary font-orbitron">
                        {
                          completedWorkouts.filter((w) => {
                            const now = new Date()
                            const workoutDate = new Date(w.completedAt!)
                            const diffTime = Math.abs(now.getTime() - workoutDate.getTime())
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            return diffDays <= 7
                          }).length
                        }
                      </div>
                    </div>
                    <div className="bg-black/60 p-3 rounded-none border border-primary/30 hover:border-primary/60 transition-colors">
                      <div className="text-primary/70 font-electrolize flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary/70" />
                        Total XP Earned
                      </div>
                      <div className="text-2xl font-bold text-primary font-orbitron">
                        {completedWorkouts.reduce((total, w) => total + w.xpReward, 0)}
                      </div>
                    </div>
                    <div className="bg-black/60 p-3 rounded-none border border-primary/30 hover:border-primary/60 transition-colors">
                      <div className="text-primary/70 font-electrolize flex items-center gap-2">
                        <Flame className="w-4 h-4 text-primary/70" />
                        Streak
                      </div>
                      <div className="text-2xl font-bold text-primary font-orbitron">
                        {(() => {
                          let streak = 0
                          let currentDate = new Date()
                          currentDate.setHours(0, 0, 0, 0)

                          while (true) {
                            const prevDate = new Date(currentDate)
                            prevDate.setDate(prevDate.getDate() - 1)

                            const workoutsOnDate = completedWorkouts.filter((w) => {
                              const workoutDate = new Date(w.completedAt!)
                              return (
                                workoutDate.getDate() === prevDate.getDate() &&
                                workoutDate.getMonth() === prevDate.getMonth() &&
                                workoutDate.getFullYear() === prevDate.getFullYear()
                              )
                            })

                            if (workoutsOnDate.length === 0) break

                            streak++
                            currentDate = prevDate
                          }

                          return streak
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Active Workout Modal */}
      <AnimatePresence>
        {showWorkoutModal && activeWorkout && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-md w-full mx-4 bg-black/90 border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] p-6 rounded-none"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary font-michroma">{activeWorkout.name}</h3>
                <Button
                  onClick={failWorkout}
                  className="p-1 bg-black/60 hover:bg-red-900/30 text-primary/70 hover:text-red-400 rounded-none border border-primary/30"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-primary/70 text-sm font-michroma">Progress</span>
                  <span className="text-primary/70 text-sm font-orbitron">
                    {currentExerciseIndex + 1}/{activeWorkout.exercises.length}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${workoutProgress}%` }}></div>
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-none border border-primary/30 mb-4">
                <h4 className="text-lg font-semibold text-primary font-michroma mb-2">
                  {activeWorkout.exercises[currentExerciseIndex].name}
                </h4>
                <p className="text-primary/60 mb-3 font-electrolize">
                  {activeWorkout.exercises[currentExerciseIndex].description}
                </p>

                {activeWorkout.exercises[currentExerciseIndex].sets && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary/70 font-electrolize">Sets</span>
                    <span className="text-primary font-orbitron">
                      {activeWorkout.exercises[currentExerciseIndex].sets}
                    </span>
                  </div>
                )}

                {activeWorkout.exercises[currentExerciseIndex].reps && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary/70 font-electrolize">Reps</span>
                    <span className="text-primary font-orbitron">
                      {activeWorkout.exercises[currentExerciseIndex].reps}
                    </span>
                  </div>
                )}

                {activeWorkout.exercises[currentExerciseIndex].duration && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary/70 font-electrolize">Duration</span>
                    <span className="text-primary font-orbitron">{formatTime(remainingTime)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-primary/70 font-electrolize">Target</span>
                  <span className="text-primary font-orbitron">
                    {activeWorkout.exercises[currentExerciseIndex].muscleTargets.join(", ")}
                  </span>
                </div>
              </div>

              <Button
                onClick={completeExercise}
                className="w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                COMPLETE {currentExerciseIndex === activeWorkout.exercises.length - 1 ? "WORKOUT" : "EXERCISE"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function getMuscleRankColor(rank: MuscleRank): string {
  switch (rank) {
    case "SSS":
      return "bg-purple-900/50 text-purple-100"
    case "SS":
      return "bg-purple-700/50 text-purple-100"
    case "S":
      return "bg-blue-700/50 text-blue-100"
    case "A":
      return "bg-green-700/50 text-green-100"
    case "B":
      return "bg-yellow-700/50 text-yellow-100"
    case "C":
      return "bg-orange-700/50 text-orange-100"
    case "D":
      return "bg-cyan-700/50 text-cyan-100"
    case "E":
      return "bg-gray-700/50 text-gray-100"
    case "F":
      return "bg-gray-800/50 text-gray-100"
    default:
      return "bg-gray-900/50 text-gray-100"
  }
}
