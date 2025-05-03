/**
 * Utility functions for handling images in the application
 */

// Check if an image exists at the given URL
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}

// Generate a placeholder image URL with text
export function generatePlaceholderImage(text: string, width = 128, height = 128): string {
  return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(text)}`
}

// Get a fallback image URL if the original fails to load
export function getFallbackImageUrl(originalUrl: string, fallbackText: string): string {
  return originalUrl || generatePlaceholderImage(fallbackText)
}

// Create a data URL for a simple avatar with initials
export function createInitialsAvatar(name: string, bgColor = "#00a8ff", textColor = "#ffffff"): string {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128

  const ctx = canvas.getContext("2d")
  if (!ctx) return generatePlaceholderImage(name.charAt(0).toUpperCase())

  // Draw background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw text
  ctx.fillStyle = textColor
  ctx.font = "bold 64px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(name.charAt(0).toUpperCase(), canvas.width / 2, canvas.height / 2)

  return canvas.toDataURL("image/png")
}
