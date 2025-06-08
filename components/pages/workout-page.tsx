"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dumbbell, Calendar, Plus, X } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, Workout, WorkoutExercise } from "@/lib/player"

interface WorkoutPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function WorkoutPage({ player, setPlayer }: WorkoutPageProps) {
  const { addNotification } = useNotification()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [{ name: "", sets: 3, reps: 10, weight: 0 }],
  })

  const handleAddExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { name: "", sets: 3, reps: 10, weight: 0 }],
    })
  }

  const handleExerciseChange = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updatedExercises = [...newWorkout.exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
      id: updatedExercises[index].id || Math.random().toString(36).substring(2, 15),
      completed: false,
    }

    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises,
    })
  }

  const handleRemoveExercise = (index: number) => {
    if (newWorkout.exercises.length <= 1) {
      addNotification("Workout must have at least one exercise", "error")
      return
    }

    const updatedExercises = [...newWorkout.exercises]
    updatedExercises.splice(index, 1)

    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises,
    })
  }

  const handleCreateWorkout = () => {
    if (!newWorkout.name.trim()) {
      addNotification("Please enter a workout name", "error")
      return
    }

    const invalidExercises = newWorkout.exercises.filter((ex) => !ex.name.trim())
    if (invalidExercises.length > 0) {
      addNotification("All exercises must have a name", "error")
      return
    }

    const workout: Workout = {
      id: Math.random().toString(36).substring(2, 15),
      name: newWorkout.name,
      exercises: newWorkout.exercises.map((ex) => ({
        ...ex,
        id: ex.id || Math.random().toString(36).substring(2, 15),
        completed: false,
      })),
      completed: false,
      lastCompleted: null,
    }

    setPlayer({
      ...player,
      workouts: [...player.workouts, workout],
    })

    addNotification("Workout created successfully!", "success")
    setNewWorkout({ name: "", exercises: [{ name: "", sets: 3, reps: 10, weight: 0 }] })
    setShowCreateForm(false)
  }

  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout)
  }

  const handleToggleExercise = (exerciseId: string) => {
    if (!activeWorkout) return

    const updatedExercises = activeWorkout.exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex,
    )

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    }

    setActiveWorkout(updatedWorkout)
  }

  const handleCompleteWorkout = () => {
    if (!activeWorkout) return

    const now = new Date().toISOString()
    const updatedWorkouts = player.workouts.map((w) =>
      w.id === activeWorkout.id
        ? {
            ...w,
            completed: true,
            lastCompleted: now,
            exercises: activeWorkout.exercises,
          }
        : w,
    )

    // Add XP and increase strength/endurance stats
    const xpGained = 50
    const updatedPlayer = {
      ...player,
      workouts: updatedWorkouts,
      xp: player.xp + xpGained,
      stats: {
        ...player.stats,
        strength: player.stats.strength + 1,
        endurance: player.stats.endurance + 1,
      },
    }

    setPlayer(updatedPlayer)
    setActiveWorkout(null)
    addNotification(`Workout completed! +${xpGained} XP, +1 Strength, +1 Endurance`, "success")
  }

  const handleCancelWorkout = () => {
    setActiveWorkout(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">WORKOUTS</h1>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
        >
          {showCreateForm ? (
            "CANCEL"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              CREATE WORKOUT
            </>
          )}
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui mb-6">
          <div className="holographic-header">Create New Workout</div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name" className="text-white/70 font-michroma">
                Workout Name
              </Label>
              <Input
                id="workout-name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                className="bg-black/60 border-primary/30 text-white font-electrolize"
                placeholder="Enter workout name"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white/70 font-michroma">Exercises</Label>
                <Button
                  onClick={handleAddExercise}
                  size="sm"
                  className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Exercise
                </Button>
              </div>

              {newWorkout.exercises.map((exercise, index) => (
                <div key={index} className="p-3 border border-primary/20 bg-black/40">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`exercise-${index}`} className="text-white/70 font-michroma">
                      Exercise {index + 1}
                    </Label>
                    <Button
                      onClick={() => handleRemoveExercise(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white/50 hover:text-white/80"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Input
                      id={`exercise-${index}`}
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                      className="bg-black/60 border-primary/30 text-white font-electrolize"
                      placeholder="Exercise name"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor={`sets-${index}`} className="text-white/70 text-xs">
                          Sets
                        </Label>
                        <Input
                          id={`sets-${index}`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, "sets", Number.parseInt(e.target.value) || 1)}
                          className="bg-black/60 border-primary/30 text-white font-electrolize"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`reps-${index}`} className="text-white/70 text-xs">
                          Reps
                        </Label>
                        <Input
                          id={`reps-${index}`}
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, "reps", Number.parseInt(e.target.value) || 1)}
                          className="bg-black/60 border-primary/30 text-white font-electrolize"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight-${index}`} className="text-white/70 text-xs">
                          Weight (kg)
                        </Label>
                        <Input
                          id={`weight-${index}`}
                          type="number"
                          min="0"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, "weight", Number.parseInt(e.target.value) || 0)}
                          className="bg-black/60 border-primary/30 text-white font-electrolize"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCreateWorkout}
              className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary mt-4"
            >
              CREATE WORKOUT
            </Button>
          </div>
        </div>
      )}

      {activeWorkout ? (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
          <div className="holographic-header">Active Workout</div>
          <h2 className="text-2xl font-bold text-primary mb-4 font-michroma">{activeWorkout.name}</h2>

          <div className="space-y-4 mb-6">
            {activeWorkout.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-3 border ${
                  exercise.completed ? "border-green-500/30 bg-green-900/10" : "border-primary/20 bg-black/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary font-michroma">{exercise.name}</h3>
                    <p className="text-white/70 text-sm font-electrolize">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight > 0 ? ` × ${exercise.weight}kg` : ""}
                    </p>
                  </div>
                  <Checkbox
                    checked={exercise.completed}
                    onCheckedChange={() => handleToggleExercise(exercise.id)}
                    className="h-6 w-6 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleCompleteWorkout}
              className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
            >
              COMPLETE WORKOUT
            </Button>
            <Button
              onClick={handleCancelWorkout}
              variant="ghost"
              className="py-2 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors"
            >
              CANCEL
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-black/60 border border-primary/30">
            <TabsTrigger
              value="workouts"
              className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              WORKOUTS
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              CALENDAR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {player.workouts.length > 0 ? (
                player.workouts.map((workout) => (
                  <Card
                    key={workout.id}
                    className="bg-black/60 backdrop-blur-md border border-primary/30 hover:border-primary/60 transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Dumbbell className="w-5 h-5 text-primary/70" />
                            <h3 className="text-lg font-semibold text-primary ml-2 font-michroma">{workout.name}</h3>
                          </div>
                          <p className="text-white/70 mb-3 text-sm font-electrolize">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                          </p>
                          {workout.lastCompleted && (
                            <div className="text-primary/70 text-xs font-orbitron">
                              Last completed: {new Date(workout.lastCompleted).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleStartWorkout(workout)}
                          className="ml-4 px-3 py-1 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 rounded-none text-xs font-michroma"
                        >
                          START
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 bg-black/40 border border-primary/20">
                  <Dumbbell className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                  <p className="text-white/50 font-electrolize">No workouts available. Create your first workout!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
              <div className="holographic-header">Workout Calendar</div>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                <p className="text-white/50 font-electrolize">Workout calendar feature coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
