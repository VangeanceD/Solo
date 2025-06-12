"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Plus, Trash2 } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, ScheduleItem } from "@/lib/player"

interface SchedulePageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function SchedulePage({ player, setPlayer }: SchedulePageProps) {
  const { addNotification } = useNotification()
  const [showAddForm, setShowAddForm] = useState(false)
  const [time, setTime] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  const handleAddScheduleItem = () => {
    if (!time || !title.trim()) {
      addNotification("Please enter time and title", "error")
      return
    }

    const newScheduleItem: ScheduleItem = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      time,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
    }

    const updatedPlayer = {
      ...player,
      schedule: [...player.schedule, newScheduleItem].sort((a, b) => a.time.localeCompare(b.time)),
    }

    setPlayer(updatedPlayer)
    addNotification("Schedule item added successfully!", "success")

    // Reset form
    setTime("")
    setTitle("")
    setDescription("")
    setPriority("medium")
    setShowAddForm(false)
  }

  const handleToggleComplete = (itemId: string) => {
    const updatedSchedule = player.schedule.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )

    setPlayer({
      ...player,
      schedule: updatedSchedule,
    })
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedPlayer = {
      ...player,
      schedule: player.schedule.filter((item) => item.id !== itemId),
    }

    setPlayer(updatedPlayer)
    addNotification("Schedule item deleted", "success")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500/30 bg-red-900/10"
      case "medium":
        return "border-amber-500/30 bg-amber-900/10"
      case "low":
        return "border-green-500/30 bg-green-900/10"
      default:
        return "border-primary/30"
    }
  }

  const completedItems = player.schedule.filter((item) => item.completed).length
  const totalItems = player.schedule.length
  const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">DAILY SCHEDULE</h1>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
        >
          {showAddForm ? (
            "CANCEL"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              ADD ITEM
            </>
          )}
        </Button>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-4 animate-border-glow cyberpunk-border holographic-ui">
        <div className="holographic-header">Today's Progress</div>
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-electrolize">Completion Rate</span>
          <span className="text-primary font-orbitron">
            {completionRate.toFixed(0)}% ({completedItems}/{totalItems})
          </span>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
          <div className="holographic-header">Add Schedule Item</div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time" className="text-white/70 font-michroma">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-black/60 border-primary/30 text-white font-electrolize"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="text-white/70 font-michroma">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                  <SelectTrigger className="bg-black/60 border-primary/30 text-white font-electrolize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-primary/30">
                    <SelectItem value="low" className="text-green-400">
                      Low
                    </SelectItem>
                    <SelectItem value="medium" className="text-amber-400">
                      Medium
                    </SelectItem>
                    <SelectItem value="high" className="text-red-400">
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-white/70 font-michroma">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/60 border-primary/30 text-white font-electrolize"
                placeholder="Enter activity title"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white/70 font-michroma">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/60 border-primary/30 text-white font-electrolize"
                placeholder="Enter activity description"
              />
            </div>

            <Button
              onClick={handleAddScheduleItem}
              className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
            >
              ADD TO SCHEDULE
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {player.schedule.length > 0 ? (
          player.schedule.map((item) => (
            <Card
              key={item.id}
              className={`bg-black/60 backdrop-blur-md border transition-all duration-300 ${getPriorityColor(item.priority)} ${
                item.completed ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => handleToggleComplete(item.id)}
                      className="h-5 w-5 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary/70" />
                      <span className="text-primary font-orbitron font-semibold">{item.time}</span>
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold font-michroma ${item.completed ? "line-through text-white/50" : "text-primary"}`}
                      >
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className={`text-sm font-electrolize ${item.completed ? "text-white/30" : "text-white/70"}`}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div
                      className={`px-2 py-1 text-xs font-michroma rounded-sm ${
                        item.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : item.priority === "medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {item.priority.toUpperCase()}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-black/40 border border-primary/20">
            <Clock className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">No Schedule Items</h3>
            <p className="text-white/50 font-electrolize">Add your first schedule item to organize your day!</p>
          </div>
        )}
      </div>
    </div>
  )
}
