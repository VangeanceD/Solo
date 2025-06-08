export type Stat = "strength" | "endurance" | "focus" | "discipline" | "agility" | "intelligence"

export type Category = "physical" | "mental" | "health" | "other"

export type MuscleGroup = "chest" | "back" | "shoulders" | "arms" | "abs" | "legs"

export type MuscleRank = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS"

export interface MuscleProgress {
  group: MuscleGroup
  rank: MuscleRank
  progress: number // 0-100%
}

export interface Quest {
  id: string
  title: string
  description: string
  xp: number
  timeLimit: number
  category: Category
  completed: boolean
  stats: Stat[]
  punishment: string
  muscleGroups?: MuscleGroup[]
}

export interface DailyQuest extends Quest {
  penalty: number
  expires: number
  urgent: boolean
  editable?: boolean
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  icon: string
  custom: boolean
}

export interface GameReward {
  id: string
  title: string
  description: string
  cost: number
  image: string
  claimed: boolean
}

export interface Item {
  id: string
  name: string
  description: string
  category: string
  rarity: string
  stats: Record<string, string>
  equipped: boolean
}

export interface CompletedQuest extends Quest {
  completedAt: number
  timeSpent: number
}

export interface ClaimedReward extends Reward {
  claimedAt: number
}

export interface Settings {
  theme: "blue" | "purple" | "green" | "red"
  animations: boolean
  notifications: boolean
}

export interface Player {
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  rank: string
  stats: Record<Stat, number>
  muscles: Record<MuscleGroup, MuscleRank>
  muscleProgress: MuscleProgress[]
  dailyQuests: DailyQuest[]
  quests: Quest[]
  rewards: Reward[]
  gameRewards: GameReward[]
  inventory: Item[]
  completedQuests: CompletedQuest[]
  claimedRewards: ClaimedReward[]
  settings: Settings
  profilePicture: string | null
  lastDailyReset: number
  nextDailyReset: number
  coins: number
  titles: string[]
  selectedTitle: string | null
  friends: string[]
}

export const XP_PER_LEVEL = 100

export const RANKS = [
  { name: "F", level: 1, description: "Novice Hunter" },
  { name: "E", level: 5, description: "Apprentice Hunter" },
  { name: "D", level: 10, description: "Registered Hunter" },
  { name: "C", level: 20, description: "Advanced Hunter" },
  { name: "B", level: 35, description: "Elite Hunter" },
  { name: "A", level: 50, description: "Master Hunter" },
  { name: "S", level: 70, description: "National Level Hunter" },
  { name: "SS", level: 85, description: "Continental Hunter" },
  { name: "SSS", level: 100, description: "World Class Hunter" },
]

export const MUSCLE_RANKS: MuscleRank[] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"]

export function getRankForLevel(level: number): string {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].level) {
      return RANKS[i].name
    }
  }
  return "Unranked"
}

export function getRankDescription(rank: string): string {
  const rankObj = RANKS.find((r) => r.name === rank)
  return rankObj ? rankObj.description : "Unknown Rank"
}

export function getRatingLabel(value: number): string {
  if (value >= 10) return "SSS-Rank"
  if (value >= 9) return "SS-Rank"
  if (value >= 8) return "S-Rank"
  if (value >= 6) return "A-Rank"
  if (value >= 5) return "B-Rank"
  if (value >= 4) return "C-Rank"
  if (value >= 3) return "D-Rank"
  if (value >= 2) return "E-Rank"
  return "F-Rank"
}

export function getMuscleRankColor(rank: MuscleRank): string {
  switch (rank) {
    case "SSS":
      return "bg-purple-900 text-purple-100"
    case "SS":
      return "bg-purple-700 text-purple-100"
    case "S":
      return "bg-blue-700 text-blue-100"
    case "A":
      return "bg-green-700 text-green-100"
    case "B":
      return "bg-yellow-700 text-yellow-100"
    case "C":
      return "bg-orange-700 text-orange-100"
    case "D":
      return "bg-cyan-700 text-cyan-100"
    case "E":
      return "bg-gray-700 text-gray-100"
    case "F":
      return "bg-gray-800 text-gray-100"
    default:
      return "bg-gray-900 text-gray-100"
  }
}

export function createDefaultPlayer(name: string): Player {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setHours(24, 0, 0, 0)

  return {
    name: name,
    level: 1,
    xp: 0,
    xpToNextLevel: XP_PER_LEVEL,
    rank: getRankForLevel(1),
    stats: {
      strength: 1,
      endurance: 1,
      focus: 1,
      discipline: 1,
      agility: 1,
      intelligence: 1,
    },
    muscles: {
      chest: "F",
      back: "F",
      shoulders: "F",
      arms: "F",
      abs: "F",
      legs: "F",
    },
    muscleProgress: [
      { group: "chest", rank: "F", progress: 0 },
      { group: "back", rank: "F", progress: 0 },
      { group: "shoulders", rank: "F", progress: 0 },
      { group: "arms", rank: "F", progress: 0 },
      { group: "abs", rank: "F", progress: 0 },
      { group: "legs", rank: "F", progress: 0 },
    ],
    dailyQuests: [
      {
        id: "daily-1",
        title: "Morning Exercise",
        description: "Complete a 10-minute workout to start your day energized",
        xp: 50,
        penalty: 100,
        timeLimit: 10,
        category: "physical",
        completed: false,
        stats: ["strength", "endurance"],
        punishment: "No workout today! Your muscles are getting weaker.",
        expires: tomorrow.getTime(),
        urgent: true,
        editable: true,
        muscleGroups: ["chest", "arms"],
      },
      {
        id: "daily-2",
        title: "Meditation Session",
        description: "Practice mindfulness meditation to improve focus",
        xp: 30,
        penalty: 60,
        timeLimit: 5,
        category: "mental",
        completed: false,
        stats: ["focus", "discipline"],
        punishment: "Your mind remains cluttered and unfocused.",
        expires: tomorrow.getTime(),
        urgent: false,
        editable: true,
      },
    ],
    quests: [
      {
        id: "1",
        title: "Strength Training",
        description: "Complete a 30-minute strength workout focusing on major muscle groups",
        xp: 100,
        timeLimit: 30,
        category: "physical",
        completed: false,
        stats: ["strength", "endurance"],
        punishment: "Your muscles atrophy from lack of use.",
        muscleGroups: ["chest", "back", "arms"],
      },
      {
        id: "2",
        title: "Deep Focus Study",
        description: "Study without distractions for 45 minutes to improve knowledge",
        xp: 80,
        timeLimit: 45,
        category: "mental",
        completed: false,
        stats: ["focus", "intelligence"],
        punishment: "Your concentration weakens from lack of practice.",
      },
    ],
    rewards: [
      {
        id: "1",
        title: "Cheat Day",
        description: "Enjoy your favorite fast food without guilt",
        cost: 100,
        icon: "pizza",
        custom: false,
      },
      {
        id: "2",
        title: "Gaming Session",
        description: "2 hours of guilt-free gaming",
        cost: 50,
        icon: "gamepad-2",
        custom: false,
      },
    ],
    gameRewards: [
      {
        id: "profile1",
        title: "Warrior Avatar",
        description: "A fierce warrior profile picture",
        cost: 200,
        image: "/placeholder.svg?height=100&width=100",
        claimed: false,
      },
      {
        id: "profile2",
        title: "Mage Avatar",
        description: "A mystical mage profile picture",
        cost: 300,
        image: "/placeholder.svg?height=100&width=100",
        claimed: false,
      },
      {
        id: "profile3",
        title: "Ninja Avatar",
        description: "A stealthy ninja profile picture",
        cost: 400,
        image: "/placeholder.svg?height=100&width=100",
        claimed: false,
      },
    ],
    inventory: [
      {
        id: "item1",
        name: "Training Journal",
        description: "A journal to track your progress and set goals.",
        category: "Tool",
        rarity: "Common",
        stats: {
          Focus: "+5%",
          Discipline: "+10%",
        },
        equipped: false,
      },
    ],
    completedQuests: [],
    claimedRewards: [],
    settings: {
      theme: "blue",
      animations: true,
      notifications: true,
    },
    profilePicture: "/placeholder.svg?height=200&width=200",
    lastDailyReset: now.getTime(),
    nextDailyReset: tomorrow.getTime(),
    coins: 0,
    titles: ["Beginner"],
    selectedTitle: "Beginner",
    friends: [],
  }
}
