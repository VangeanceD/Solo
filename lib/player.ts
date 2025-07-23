export interface Quest {
  id: string
  title: string
  description: string
  xpReward: number
  coinReward: number
  completed: boolean
  createdAt: string
  completedAt?: string
  category: "daily" | "weekly" | "main" | "side"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  urgent?: boolean
  timeLimit?: number
  penalty?: number
}

export interface DailyMission {
  id: string
  title: string
  description: string
  xpReward: number
  coinReward: number
  completed: boolean
  streak: number
  lastCompleted?: string
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

export interface Player {
  id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  coins: number
  avatar: string
  title: string
  rank: string
  stats: {
    strength: number
    endurance: number
    intelligence: number
    charisma: number
    luck: number
  }
  quests: Quest[]
  dailyMissions: DailyMission[]
  rewards: Reward[]
  completedQuests: number
  totalXpEarned: number
  createdAt: string
  lastActive: string
}

export const createDefaultPlayer = (): Player => ({
  id: crypto.randomUUID(),
  name: "Hunter",
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  coins: 0,
  avatar: "/placeholder.svg?height=64&width=64",
  title: "Novice Hunter",
  rank: "F",
  stats: {
    strength: 10,
    endurance: 10,
    intelligence: 10,
    charisma: 10,
    luck: 10,
  },
  quests: [],
  dailyMissions: [],
  rewards: [],
  completedQuests: 0,
  totalXpEarned: 0,
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
})

export const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  let level = 1
  let totalXpNeeded = 0
  let xpForNextLevel = 100

  while (totalXpNeeded + xpForNextLevel <= xp) {
    totalXpNeeded += xpForNextLevel
    level++
    xpForNextLevel = Math.floor(100 * Math.pow(1.2, level - 1))
  }

  return {
    level,
    xpToNextLevel: xpForNextLevel - (xp - totalXpNeeded),
  }
}

export const getRankFromLevel = (level: number): string => {
  if (level >= 100) return "SSS"
  if (level >= 80) return "SS"
  if (level >= 60) return "S"
  if (level >= 45) return "A"
  if (level >= 30) return "B"
  if (level >= 20) return "C"
  if (level >= 10) return "D"
  if (level >= 5) return "E"
  return "F"
}

export const getTitleFromLevel = (level: number): string => {
  if (level >= 100) return "Legendary Hunter"
  if (level >= 80) return "Master Hunter"
  if (level >= 60) return "Expert Hunter"
  if (level >= 45) return "Veteran Hunter"
  if (level >= 30) return "Skilled Hunter"
  if (level >= 20) return "Experienced Hunter"
  if (level >= 10) return "Junior Hunter"
  if (level >= 5) return "Apprentice Hunter"
  return "Novice Hunter"
}
