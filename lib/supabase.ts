import { createClient } from "@supabase/supabase-js"
import type { Player } from "./player"

// Check if Supabase credentials are available
const getSupabaseCredentials = () => {
  if (typeof window !== "undefined") {
    // Client-side: check localStorage first, then env vars
    const storedUrl = localStorage.getItem("supabase_url")
    const storedKey = localStorage.getItem("supabase_key")

    if (storedUrl && storedKey) {
      return { url: storedUrl, key: storedKey }
    }
  }

  // Fallback to environment variables
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey }
  }

  return null
}

// Create Supabase client only if credentials are available
let supabase: ReturnType<typeof createClient> | null = null

const initializeSupabase = () => {
  const credentials = getSupabaseCredentials()
  if (credentials && !supabase) {
    try {
      supabase = createClient(credentials.url, credentials.key)
    } catch (error) {
      console.error("Failed to initialize Supabase:", error)
      supabase = null
    }
  }
  return supabase
}

export const getSupabase = () => {
  return initializeSupabase()
}

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          user_id: string
          data: Player
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data: Player
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data?: Player
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Save player data to Supabase
export async function savePlayerData(userId: string, playerData: Player) {
  try {
    const supabaseClient = getSupabase()
    if (!supabaseClient) {
      return { success: false, error: "Supabase not configured" }
    }

    const { data, error } = await supabaseClient
      .from("players")
      .upsert({
        user_id: userId,
        data: playerData,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error saving player data:", error)
    return { success: false, error }
  }
}

// Load player data from Supabase
export async function loadPlayerData(userId: string) {
  try {
    const supabaseClient = getSupabase()
    if (!supabaseClient) {
      return { success: false, error: "Supabase not configured" }
    }

    const { data, error } = await supabaseClient.from("players").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") throw error
    return { success: true, data: data?.data || null }
  } catch (error) {
    console.error("Error loading player data:", error)
    return { success: false, error }
  }
}

// Delete player data from Supabase
export async function deletePlayerData(userId: string) {
  try {
    const supabaseClient = getSupabase()
    if (!supabaseClient) {
      return { success: false, error: "Supabase not configured" }
    }

    const { error } = await supabaseClient.from("players").delete().eq("user_id", userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting player data:", error)
    return { success: false, error }
  }
}

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const supabaseClient = getSupabase()
    if (!supabaseClient) {
      return { success: false, error: "Supabase not configured" }
    }

    // Try to query the players table
    const { error } = await supabaseClient.from("players").select("id").limit(1)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    return { success: false, error }
  }
}

// Simple authentication with device ID
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server"

  let deviceId = localStorage.getItem("device_id")
  if (!deviceId) {
    deviceId = "device_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem("device_id", deviceId)
  }
  return deviceId
}

// Check if online
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return getSupabaseCredentials() !== null
}

// Initialize Supabase with custom credentials
export function initializeSupabaseWithCredentials(url: string, key: string) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("supabase_url", url)
      localStorage.setItem("supabase_key", key)
    }

    supabase = createClient(url, key)
    return { success: true }
  } catch (error) {
    console.error("Failed to initialize Supabase with credentials:", error)
    return { success: false, error }
  }
}
