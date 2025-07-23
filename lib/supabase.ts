import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Player } from "./player"

let supabaseClient: SupabaseClient | null = null

export function createSupabaseClient(url: string, key: string): SupabaseClient | null {
  try {
    if (!url || !key) {
      console.error("Supabase URL and key are required")
      return null
    }

    const client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    return client
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}

export function initializeSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null

  try {
    const url = localStorage.getItem("supabase_url")
    const key = localStorage.getItem("supabase_key")

    if (!url || !key) {
      return null
    }

    supabaseClient = createSupabaseClient(url, key)
    return supabaseClient
  } catch (error) {
    console.error("Failed to initialize Supabase:", error)
    return null
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseClient) {
    supabaseClient = initializeSupabase()
  }
  return supabaseClient
}

export async function testSupabaseConnection(
  url: string,
  key: string,
): Promise<{
  success: boolean
  error?: string
  needsTableSetup?: boolean
}> {
  try {
    const client = createSupabaseClient(url, key)
    if (!client) {
      return { success: false, error: "Failed to create client" }
    }

    // Test basic connection
    const { error: authError } = await client.auth.getSession()
    if (authError && authError.message !== "Auth session missing!") {
      return { success: false, error: authError.message }
    }

    // Test table access
    const { error: tableError } = await client.from("players").select("count", { count: "exact", head: true })

    if (tableError) {
      if (tableError.code === "42P01") {
        return { success: false, error: "Players table does not exist", needsTableSetup: true }
      }
      return { success: false, error: tableError.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function savePlayerData(deviceId: string, playerData: Player): Promise<void> {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase client not initialized")
  }

  const { error } = await client.from("players").upsert(
    {
      device_id: deviceId,
      player_data: playerData,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "device_id",
    },
  )

  if (error) {
    throw new Error(`Failed to save player data: ${error.message}`)
  }
}

export async function loadPlayerData(deviceId: string): Promise<{
  success: boolean
  data?: Player
  error?: string
}> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Supabase client not initialized" }
  }

  try {
    const { data, error } = await client
      .from("players")
      .select("player_data, updated_at")
      .eq("device_id", deviceId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No data found - this is normal for new users
        return { success: true, data: undefined }
      }
      return { success: false, error: error.message }
    }

    return { success: true, data: data.player_data as Player }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function isSupabaseConfigured(): boolean {
  if (typeof window === "undefined") return false

  const url = localStorage.getItem("supabase_url")
  const key = localStorage.getItem("supabase_key")

  return !!(url && key)
}
