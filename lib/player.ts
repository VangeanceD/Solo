export interface Quest {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
  createdAt: string
  completedAt?: string
  category: "fitness" | "study" | "work" | "personal" | "health" | "creative"
  priority: "low" | "medium" | "high"
  difficulty: "easy" | "medium" | "hard"
  timeEstimate?: number // in minutes
}

export interface DailyMission {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
  streak: number
  lastCompleted?: string
  category: "fitness" | "study" | "work" | "personal" | "health" | "creative"
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  type: "consumable" | "equipment" | "collectible"
  rarity: "common" | "rare" | "epic" | "legendary"
  quantity: number
  effects?: {
    xpBoost?: number
    healthBoost?: number
    energyBoost?: number
  }
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: "entertainment" | "food" | "shopping" | "experience" | "custom"
  claimed: boolean
  claimedAt?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  maxProgress: number
  xpReward: number
  category: "quests" | "daily" | "social" | "progression" | "special"
}

export interface PlayerStats {
  totalXpEarned: number
  questsCompleted: number
  dailyMissionsCompleted: number
  currentStreak: number
  longestStreak: number
  achievementsUnlocked: number
  totalPlayTime: number // in minutes
  joinDate: string
}

export interface Player {
  id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  avatar: string
  title: string
  rank: string
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  quests: Quest[]
  dailyMissions: DailyMission[]
  inventory: InventoryItem[]
  rewards: Reward[]
  achievements: Achievement[]
  stats: PlayerStats
  settings: {
    notifications: boolean
    soundEffects: boolean
    darkMode: boolean
    autoSync: boolean
  }
  lastUpdated: string
  createdAt: string
}

export function createDefaultPlayer(name = "Hunter"): Player {
  const now = new Date().toISOString()

  return {
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    avatar: "/placeholder.svg?height=100&width=100&text=Avatar",
    title: "Novice Hunter",
    rank: "F",
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    quests: [],
    dailyMissions: [
      {
        id: "daily_1",
        title: "Morning Exercise",
        description: "Complete 30 minutes of physical activity",
        xpReward: 50,
        completed: false,
        streak: 0,
        category: "fitness",
      },
      {
        id: "daily_2",
        title: "Learn Something New",
        description: "Spend 20 minutes learning a new skill",
        xpReward: 40,
        completed: false,
        streak: 0,
        category: "study",
      },
    ],
    inventory: [
      {
        id: "starter_potion",
        name: "Starter Health Potion",
        description: "Restores 50 health points",
        type: "consumable",
        rarity: "common",
        quantity: 3,
        effects: { healthBoost: 50 },
      },
    ],
    rewards: [
      {
        id: "reward_1",
        title: "Watch a Movie",
        description: "Enjoy a 2-hour movie break",
        cost: 200,
        category: "entertainment",
        claimed: false,
      },
      {
        id: "reward_2",
        title: "Favorite Snack",
        description: "Treat yourself to your favorite snack",
        cost: 150,
        category: "food",
        claimed: false,
      },
    ],
    achievements: [
      {
        id: "first_quest",
        title: "First Steps",
        description: "Complete your first quest",
        icon: "🎯",
        progress: 0,
        maxProgress: 1,
        xpReward: 100,
        category: "quests",
      },
      {
        id: "daily_warrior",
        title: "Daily Warrior",
        description: "Complete 7 daily missions in a row",
        icon: "⚔️",
        progress: 0,
        maxProgress: 7,
        xpReward: 300,
        category: "daily",
      },
    ],
    stats: {
      totalXpEarned: 0,
      questsCompleted: 0,
      dailyMissionsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievementsUnlocked: 0,
      totalPlayTime: 0,
      joinDate: now,
    },
    settings: {
      notifications: true,
      soundEffects: true,
      darkMode: true,
      autoSync: true,
    },
    lastUpdated: now,
    createdAt: now,
  }
}

export function calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
  let level = 1
  let totalXpForLevel = 0
  let xpForNextLevel = 100

  while (xp >= totalXpForLevel + xpForNextLevel) {
    totalXpForLevel += xpForNextLevel
    level++
    xpForNextLevel = Math.floor(100 * Math.pow(1.2, level - 1))
  }

  const xpToNextLevel = xpForNextLevel - (xp - totalXpForLevel)
  return { level, xpToNextLevel }
}

export function getRankFromLevel(level: number): string {
  if (level >= 100) return "SSS"
  if (level >= 80) return "SS"
  if (level >= 60) return "S"
  if (level >= 40) return "A"
  if (level >= 25) return "B"
  if (level >= 15) return "C"
  if (level >= 8) return "D"
  if (level >= 3) return "E"
  return "F"
}

export function getTitleFromLevel(level: number): string {
  if (level >= 100) return "Legendary Hunter"
  if (level >= 80) return "Master Hunter"
  if (level >= 60) return "Expert Hunter"
  if (level >= 40) return "Veteran Hunter"
  if (level >= 25) return "Skilled Hunter"
  if (level >= 15) return "Experienced Hunter"
  if (level >= 8) return "Apprentice Hunter"
  if (level >= 3) return "Junior Hunter"
  return "Novice Hunter"
}

export function migratePlayerData(data: any): Player {
  const defaultPlayer = createDefaultPlayer(data.name || "Hunter")

  return {
    ...defaultPlayer,
    ...data,
    // Ensure required fields exist
    id: data.id || defaultPlayer.id,
    stats: { ...defaultPlayer.stats, ...data.stats },
    settings: { ...defaultPlayer.settings, ...data.settings },
    achievements: data.achievements || defaultPlayer.achievements,
    lastUpdated: new Date().toISOString(),
  }
}
