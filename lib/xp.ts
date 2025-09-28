export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * Compute proportional skip/cancel penalty based on the item's XP.
 * Slightly higher than old fixed penalties, but still "not too much".
 * Example: 35% of XP, minimum 5, capped at 150.
 */
export function computeSkipPenalty(xp: number) {
  const base = Math.round(xp * 0.35)
  return clamp(base, 5, 150)
}

/**
 * Proportional avatar cost based on player's lifetime XP.
 * Keeps costs fair across progression: min = baseCost (fallback) or 250
 * proportional = 2% of lifetime XP, capped to avoid extremes.
 */
export function computeAvatarCost(lifetimeXp: number | undefined, baseCost?: number) {
  const lifetime = typeof lifetimeXp === "number" ? lifetimeXp : 0
  const proportional = Math.round(lifetime * 0.02)
  const minCost = typeof baseCost === "number" ? baseCost : 250
  return clamp(Math.max(minCost, proportional), minCost, 20000)
}
