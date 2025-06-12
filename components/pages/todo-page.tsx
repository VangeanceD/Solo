"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, AlertTriangle, BookOpen, User, Briefcase, Heart, MoreHorizontal } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, TodoItem } from "@/lib/player"

interface TodoPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function TodoPage({ player, setPlayer }: TodoPageProps) {
  const { addNotification } = useNotification()
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"urgent" | "school" | "personal" | "work" | "health" | "other">("personal")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState("")

  const handleAddTodoItem = () => {
    if (!title.trim()) {
      addNotification("Please enter a task title", "error")
      return
    }

    const newTodoItem: TodoItem = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      completed: false,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    }

    const updatedPlayer = {
      ...player,
      todoList: [...player.todoList, newTodoItem],
    }

    setPlayer(updatedPlayer)
    addNotification("Task added successfully!", "success")

    // Reset form
    setTitle("")
    setDescription("")
    setCategory("personal")
    setPriority("medium")
    setDueDate("")
    setShowAddForm(false)
  }

  const handleToggleComplete = (itemId: string) => {
    const updatedTodoList = player.todoList.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )

    setPlayer({
      ...player,
      todoList: updatedTodoList,
    })
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedPlayer = {
      ...player,
      todoList: player.todoList.filter((item) => item.id !== itemId),
    }

    setPlayer(updatedPlayer)
    addNotification("Task deleted", "success")
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "urgent":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "school":
        return <BookOpen className="w-5 h-5 text-blue-500" />
      case "personal":
        return <User className="w-5 h-5 text-green-500" />
      case "work":
        return <Briefcase className="w-5 h-5 text-purple-500" />
      case "health":
        return <Heart className="w-5 h-5 text-pink-500" />
      default:
        return <MoreHorizontal className="w-5 h-5 text-gray-500" />
    }
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

  const getTasksByCategory = (category: string) => {
    return player.todoList.filter((item) => item.category === category)
  }

  const categories = [
    { id: "urgent", name: "Urgent", icon: AlertTriangle, color: "text-red-500" },
    { id: "school", name: "School", icon: BookOpen, color: "text-blue-500" },
    { id: "work", name: "Work", icon: Briefcase, color: "text-purple-500" },
    { id: "personal", name: "Personal", icon: User, color: "text-green-500" },
    { id: "health", name: "Health", icon: Heart, color: "text-pink-500" },
    { id: "other", name: "Other", icon: MoreHorizontal, color: "text-gray-500" },
  ]

  const totalTasks = player.todoList.length
  const completedTasks = player.todoList.filter((item) => item.completed).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">TO-DO LIST</h1>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
        >
          {showAddForm ? (
            "CANCEL"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              ADD TASK
            </>
          )}
        </Button>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-4 animate-border-glow cyberpunk-border holographic-ui">
        <div className="holographic-header">Task Overview</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-orbitron">{totalTasks}</div>
            <div className="text-white/70 text-sm font-electrolize">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 font-orbitron">{completedTasks}</div>
            <div className="text-white/70 text-sm font-electrolize">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500 font-orbitron">{totalTasks - completedTasks}</div>
            <div className="text-white/70 text-sm font-electrolize">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-orbitron">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <div className="text-white/70 text-sm font-electrolize">Progress</div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
          <div className="holographic-header">Add New Task</div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white/70 font-michroma">
                Task Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/60 border-primary/30 text-white font-electrolize"
                placeholder="Enter task title"
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
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category" className="text-white/70 font-michroma">
                  Category
                </Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger className="bg-black/60 border-primary/30 text-white font-electrolize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-primary/30">
                    <SelectItem value="urgent" className="text-red-400">
                      🚨 Urgent
                    </SelectItem>
                    <SelectItem value="school" className="text-blue-400">
                      📚 School
                    </SelectItem>
                    <SelectItem value="work" className="text-purple-400">
                      💼 Work
                    </SelectItem>
                    <SelectItem value="personal" className="text-green-400">
                      👤 Personal
                    </SelectItem>
                    <SelectItem value="health" className="text-pink-400">
                      ❤️ Health
                    </SelectItem>
                    <SelectItem value="other" className="text-gray-400">
                      📋 Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-white/70 font-michroma">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
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

              <div>
                <Label htmlFor="dueDate" className="text-white/70 font-michroma">
                  Due Date (Optional)
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-black/60 border-primary/30 text-white font-electrolize"
                />
              </div>
            </div>

            <Button
              onClick={handleAddTodoItem}
              className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
            >
              ADD TASK
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-6 bg-black/60 border border-primary/30">
          <TabsTrigger
            value="all"
            className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            ALL
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              {cat.name.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {player.todoList.length > 0 ? (
            player.todoList.map((item) => (
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

                      {getCategoryIcon(item.category)}

                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold font-michroma ${item.completed ? "line-through text-white/50" : "text-primary"}`}
                        >
                          {item.title}
                        </h3>
                        {item.description && (
                          <p
                            className={`text-sm font-electrolize ${item.completed ? "text-white/30" : "text-white/70"}`}
                          >
                            {item.description}
                          </p>
                        )}
                        {item.dueDate && (
                          <p className="text-xs text-amber-400 font-orbitron">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
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
              <Plus className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">No Tasks Yet</h3>
              <p className="text-white/50 font-electrolize">Add your first task to get organized!</p>
            </div>
          )}
        </TabsContent>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-3">
            {getTasksByCategory(cat.id).length > 0 ? (
              getTasksByCategory(cat.id).map((item) => (
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

                        {getCategoryIcon(item.category)}

                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold font-michroma ${item.completed ? "line-through text-white/50" : "text-primary"}`}
                          >
                            {item.title}
                          </h3>
                          {item.description && (
                            <p
                              className={`text-sm font-electrolize ${item.completed ? "text-white/30" : "text-white/70"}`}
                            >
                              {item.description}
                            </p>
                          )}
                          {item.dueDate && (
                            <p className="text-xs text-amber-400 font-orbitron">
                              Due: {new Date(item.dueDate).toLocaleDateString()}
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
                <cat.icon className={`w-16 h-16 mx-auto mb-4 ${cat.color} opacity-30`} />
                <h3 className="text-xl font-semibold text-primary mb-2 font-michroma">No {cat.name} Tasks</h3>
                <p className="text-white/50 font-electrolize">Add tasks in the {cat.name.toLowerCase()} category!</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
