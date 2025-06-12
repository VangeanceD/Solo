// Player types and interfaces
export interface Stats {
  strength: number
  agility: number
  endurance: number
  intelligence: number
  charisma: number
}

export interface DailyQuest {
  id: string
  title: string
  description: string
  completed: boolean
  xp: number
  timeLimit: number
  penalty: number
  isCustom?: boolean
  createdAt?: string
}

export interface Quest {
  id: string
  title: string
  description: string
  completed: boolean
  xp: number
  timeLimit: number
  statIncreases: Partial<Stats>
}

export interface ScheduleItem {
  id: string
  time: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

export interface TodoItem {
  id: string
  title: string
  description: string
  category: "urgent" | "school" | "personal" | "work" | "health" | "other"
  priority: "low" | "medium" | "high"
  completed: boolean
  dueDate?: string
  createdAt: string
}

export interface WorkoutMiss {
  id: string
  date: string
  reason: string
  xpLost: number
  acknowledged: boolean
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  used: boolean
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  type: string
  effect: string
  equipped: boolean
}

export interface Player {
  id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  stats: Stats
  quests: Quest[]
  dailyQuests: DailyQuest[]
  schedule?: ScheduleItem[] // Make optional for backward compatibility
  todoList?: TodoItem[] // Make optional for backward compatibility
  workoutMisses?: WorkoutMiss[] // Make optional for backward compatibility
  rewards: Reward[]
  inventory: InventoryItem[]
  title: string
  avatar: string
  createdAt: string
  lastLogin: string
  settings: {
    theme: string
    notifications: boolean
    sound: boolean
    workoutPenalty?: number // Make optional for backward compatibility
  }
}

// Create a default player with initial values
export function createDefaultPlayer(name: string): Player {
  const now = new Date().toISOString()

  return {
    id: generateId(),
    name,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    stats: {
      strength: 10,
      agility: 10,
      endurance: 10,
      intelligence: 10,
      charisma: 10,
    },
    quests: [
      {
        id: generateId(),
        title: "Complete Your First Workout",
        description: "Finish a 30-minute workout session to boost your physical stats and start your fitness journey",
        completed: false,
        xp: 50,
        timeLimit: 60,
        statIncreases: {
          strength: 2,
          endurance: 1,
        },
      },
      {
        id: generateId(),
        title: "Read for Knowledge",
        description: "Spend 30 minutes reading a book, article, or educational content to expand your mind",
        completed: false,
        xp: 40,
        timeLimit: 45,
        statIncreases: {
          intelligence: 2,
        },
      },
      {
        id: generateId(),
        title: "Practice Mindfulness",
        description: "Meditate or practice mindfulness for 15 minutes to improve your mental clarity and charisma",
        completed: false,
        xp: 35,
        timeLimit: 20,
        statIncreases: {
          charisma: 1,
          intelligence: 1,
        },
      },
    ],
    dailyQuests: [
      {
        id: generateId(),
        title: "Hydration Hero",
        description: "Drink at least 8 glasses of water throughout the day to stay properly hydrated",
        completed: false,
        xp: 25,
        timeLimit: 720,
        penalty: 10,
        isCustom: false,
      },
      {
        id: generateId(),
        title: "Fresh Air Walk",
        description: "Take a 15-minute walk outside to get fresh air and light exercise",
        completed: false,
        xp: 20,
        timeLimit: 20,
        penalty: 5,
        isCustom: false,
      },
    ],
    schedule: [
      {
        id: generateId(),
        time: "07:00",
        title: "Morning Routine",
        description: "Wake up, brush teeth, drink water",
        completed: false,
        priority: "high",
      },
      {
        id: generateId(),
        time: "08:00",
        title: "Breakfast",
        description: "Healthy breakfast with protein and fruits",
        completed: false,
        priority: "high",
      },
      {
        id: generateId(),
        time: "18:00",
        title: "Workout Time",
        description: "30-45 minute workout session",
        completed: false,
        priority: "high",
      },
    ],
    todoList: [
      {
        id: generateId(),
        title: "Complete project assignment",
        description: "Finish the math project due tomorrow",
        category: "school",
        priority: "high",
        completed: false,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
      },
      {
        id: generateId(),
        title: "Call family",
        description: "Check in with parents and siblings",
        category: "personal",
        priority: "medium",
        completed: false,
        createdAt: now,
      },
    ],
    workoutMisses: [],
    rewards: [
      {
        id: generateId(),
        title: "Gaming Session",
        description: "Enjoy 1 hour of guilt-free gaming time",
        cost: 50,
        used: false,
      },
      {
        id: generateId(),
        title: "Movie Night",
        description: "Watch a movie of your choice with snacks",
        cost: 100,
        used: false,
      },
      {
        id: generateId(),
        title: "Favorite Treat",
        description: "Treat yourself to your favorite snack or dessert",
        cost: 75,
        used: false,
      },
    ],
    inventory: [
      {
        id: generateId(),
        name: "Hunter's Manual",
        description: "A comprehensive guide to help you navigate your self-improvement journey",
        type: "guide",
        effect: "Provides tips and motivation for beginners",
        equipped: false,
      },
    ],
    title: "Novice Hunter",
    avatar: "/avatars/default.png",
    createdAt: now,
    lastLogin: now,
    settings: {
      theme: "dark",
      notifications: true,
      sound: true,
      workoutPenalty: 25,
    },
  }
}

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Migration function to update existing player data
export function migratePlayerData(player: any): Player {
  return {
    ...player,
    schedule: player.schedule || [],
    todoList: player.todoList || [],
    workoutMisses: player.workoutMisses || [],
    settings: {
      ...player.settings,
      workoutPenalty: player.settings?.workoutPenalty || 25,
    },
    dailyQuests: (player.dailyQuests || []).map((quest: any) => ({
      ...quest,
      isCustom: quest.isCustom || false,
    })),
  }
}
