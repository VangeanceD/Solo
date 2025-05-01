import { RANKS } from "./player"

export function getRankForLevel(level: number): string {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].level) {
      return RANKS[i].name
    }
  }
  return "Unranked"
}
