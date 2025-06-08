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
        title: "Complete Your First Workout",
        description: "Finish a 30-minute workout session to boost your physical stats and start your fitness journey",
        completed: false,
        xp: 50,
        timeLimit: 60, // 60 minutes
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
      {
        id: generateId(),
        title: "Social Connection",
        description: "Have a meaningful conversation with a friend or family member for at least 20 minutes",
        completed: false,
        xp: 30,
        timeLimit: 30,
        statIncreases: {
          charisma: 2,
        },
      },
      {
        id: generateId(),
        title: "Learn Something New",
        description: "Spend 45 minutes learning a new skill, watching educational videos, or taking an online course",
        completed: false,
        xp: 60,
        timeLimit: 60,
        statIncreases: {
          intelligence: 2,
          agility: 1,
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
        timeLimit: 720, // 12 hours
        penalty: 10,
      },
      {
        id: generateId(),
        title: "Fresh Air Walk",
        description: "Take a 15-minute walk outside to get fresh air and light exercise",
        completed: false,
        xp: 20,
        timeLimit: 20,
        penalty: 5,
      },
      {
        id: generateId(),
        title: "Healthy Meal",
        description: "Prepare and eat one healthy, balanced meal with vegetables and protein",
        completed: false,
        xp: 30,
        timeLimit: 90,
        penalty: 15,
      },
    ],
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
      {
        id: generateId(),
        title: "Social Media Time",
        description: "30 minutes of guilt-free social media browsing",
        cost: 25,
        used: false,
      },
      {
        id: generateId(),
        title: "Shopping Spree",
        description: "Buy something you've been wanting (within budget)",
        cost: 200,
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
    },
  }
}

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
