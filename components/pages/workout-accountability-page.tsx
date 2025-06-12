"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, XCircle, TrendingDown, Calendar } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, WorkoutMiss } from "@/lib/player"

interface WorkoutAccountabilityPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function WorkoutAccountabilityPage({ player, setPlayer }: WorkoutAccountabilityPageProps) {
  const { addNotification } = useNotification()
  const [reason, setReason] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)

  const handleMissWorkout = () => {
    if (!reason.trim()) {
      addNotification("Please provide a reason for missing your workout", "error")
      return
    }

    const xpLost = player.settings.workoutPenalty
    const newWorkoutMiss: WorkoutMiss = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      date: new Date().toISOString(),
      reason: reason.trim(),
      xpLost,
      acknowledged: true,
    }

    const updatedPlayer = {
      ...player,
      workoutMisses: [...player.workoutMisses, newWorkoutMiss],
      xp: Math.max(0, player.xp - xpLost),
    }

    setPlayer(updatedPlayer)
    addNotification(`Workout miss recorded. You lost ${xpLost} XP.`, "error")

    // Reset form
    setReason("")
    setShowConfirm(false)
  }

  const totalMisses = player.workoutMisses.length
  const totalXpLost = player.workoutMisses.reduce((sum, miss) => sum + miss.xpLost, 0)
  const thisWeekMisses = player.workoutMisses.filter((miss) => {
    const missDate = new Date(miss.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return missDate >= weekAgo
  }).length

  const thisMonthMisses = player.workoutMisses.filter((miss) => {
    const missDate = new Date(miss.date)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return missDate >= monthAgo
  }).length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">WORKOUT ACCOUNTABILITY</h1>

      <div className="bg-red-900/20 backdrop-blur-md border border-red-500/30 p-6 animate-border-glow">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-xl font-bold text-red-500 font-michroma">ACCOUNTABILITY ZONE</h2>
        </div>
        <p className="text-red-400/80 font-electrolize mb-4">
          Use this section to hold yourself accountable when you miss a workout. Honesty is key to growth.
        </p>
        <p className="text-white/70 font-electrolize text-sm">
          Current penalty: <span className="text-red-400 font-orbitron">{player.settings.workoutPenalty} XP</span> per
          missed workout
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/60 backdrop-blur-md border border-red-500/30">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500 font-orbitron">{totalMisses}</div>
            <div className="text-white/70 text-sm font-electrolize">Total Misses</div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-md border border-red-500/30">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500 font-orbitron">{totalXpLost}</div>
            <div className="text-white/70 text-sm font-electrolize">Total XP Lost</div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-md border border-amber-500/30">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-500 font-orbitron">{thisWeekMisses}</div>
            <div className="text-white/70 text-sm font-electrolize">This Week</div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-md border border-amber-500/30">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-500 font-orbitron">{thisMonthMisses}</div>
            <div className="text-white/70 text-sm font-electrolize">This Month</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-red-500/30 p-6 animate-border-glow">
        <div className="flex items-center mb-4">
          <XCircle className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-xl font-bold text-red-500 font-michroma">REPORT MISSED WORKOUT</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason" className="text-white/70 font-michroma mb-2 block">
              Why did you miss your workout? (Be honest)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-black/60 border-red-500/30 text-white font-electrolize min-h-[100px]"
              placeholder="Enter the reason for missing your workout..."
            />
          </div>

          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-none">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-500 font-michroma">PENALTY WARNING</span>
            </div>
            <p className="text-red-400/80 font-electrolize text-sm">
              By submitting this form, you acknowledge that you missed your workout and accept the penalty of{" "}
              <span className="text-red-400 font-orbitron font-bold">{player.settings.workoutPenalty} XP</span>.
            </p>
          </div>

          <Button
            onClick={() => setShowConfirm(true)}
            disabled={!reason.trim()}
            className="w-full py-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-none border border-red-500/30 transition-colors tracking-wider font-michroma"
          >
            ACCEPT RESPONSIBILITY & LOSE {player.settings.workoutPenalty} XP
          </Button>
        </div>
      </div>

      {player.workoutMisses.length > 0 && (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
          <div className="holographic-header">Workout Miss History</div>

          <div className="space-y-3">
            {player.workoutMisses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((miss) => (
                <Card key={miss.id} className="bg-red-900/10 border border-red-500/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-red-400 font-orbitron text-sm">
                            {new Date(miss.date).toLocaleDateString()} - {new Date(miss.date).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white/70 font-electrolize">{miss.reason}</p>
                      </div>
                      <div className="text-red-400 font-orbitron text-sm">-{miss.xpLost} XP</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-black/90 border border-red-500/30 p-6 animate-border-glow">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2 font-michroma text-center">CONFIRM PENALTY</h2>
            <p className="text-white/70 mb-6 font-electrolize text-center">
              Are you sure you want to accept the {player.settings.workoutPenalty} XP penalty for missing your workout?
            </p>

            <div className="flex space-x-3">
              <Button
                onClick={handleMissWorkout}
                className="flex-1 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-none border border-red-500/30"
              >
                YES, ACCEPT PENALTY
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                variant="ghost"
                className="flex-1 py-2 bg-black/60 hover:bg-black/80 text-white/70 hover:text-white rounded-none border border-primary/30"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
