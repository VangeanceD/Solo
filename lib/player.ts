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

export interface Workout {
  id: string
  name: string
  exercises: WorkoutExercise[]
  completed: boolean
  lastCompleted: string | null
}

export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  completed: boolean
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
  rewards: Reward[]
  inventory: InventoryItem[]
  workouts: Workout[]
  title: string
  avatar: string
  createdAt: string
  lastLogin: string
  settings: {
    theme: string
    notifications: boolean
    sound: boolean
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
        title: "Complete a workout",
        description: "Finish a workout session to improve your physical stats",
        completed: false,
        xp: 50,
        timeLimit: 60, // 60 minutes
        statIncreases: {
          strength: 1,
          endurance: 1,
        },
      },
      {
        id: generateId(),
        title: "Read for 30 minutes",
        description: "Expand your knowledge by reading for at least 30 minutes",
        completed: false,
        xp: 30,
        timeLimit: 30,
        statIncreases: {
          intelligence: 1,
        },
      },
    ],
    dailyQuests: [
      {
        id: generateId(),
        title: "Drink 8 glasses of water",
        description: "Stay hydrated throughout the day",
        completed: false,
        xp: 20,
        timeLimit: 720, // 12 hours
        penalty: 5,
      },
      {
        id: generateId(),
        title: "Meditate for 10 minutes",
        description: "Clear your mind and reduce stress",
        completed: false,
        xp: 15,
        timeLimit: 15,
        penalty: 5,
      },
    ],
    rewards: [
      {
        id: generateId(),
        title: "Gaming session",
        description: "Enjoy 1 hour of guilt-free gaming",
        cost: 50,
        used: false,
      },
      {
        id: generateId(),
        title: "Movie night",
        description: "Watch a movie of your choice",
        cost: 100,
        used: false,
      },
    ],
    inventory: [
      {
        id: generateId(),
        name: "Beginner's Guide",
        description: "A guide to help you get started on your journey",
        type: "book",
        effect: "Provides tips for beginners",
        equipped: false,
      },
    ],
    workouts: [
      {
        id: generateId(),
        name: "Full Body Workout",
        exercises: [
          {
            id: generateId(),
            name: "Push-ups",
            sets: 3,
            reps: 10,
            weight: 0,
            completed: false,
          },
          {
            id: generateId(),
            name: "Squats",
            sets: 3,
            reps: 15,
            weight: 0,
            completed: false,
          },
        ],
        completed: false,
        lastCompleted: null,
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
    },
  }
}

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
