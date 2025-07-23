import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabase: SupabaseClient | null = null

export const initializeSupabase = () => {
  if (typeof window === "undefined") return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem("supabase_url")
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem("supabase_anon_key")

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    return supabase
  } catch (error) {
    console.error("Failed to initialize Supabase:", error)
    return null
  }
}

export const getSupabase = () => {
  if (!supabase) {
    return initializeSupabase()
  }
  return supabase
}

export const testSupabaseConnection = async (url?: string, key?: string) => {
  try {
    let testClient = supabase

    if (url && key) {
      testClient = createClient(url, key)
    }

    if (!testClient) {
      return { success: false, error: "No Supabase client available" }
    }

    // Test basic connection
    const { data, error } = await testClient.from("players").select("count").limit(1)

    if (error) {
      if (error.message.includes("does not exist")) {
        return {
          success: false,
          error: "Players table does not exist. Please run the SQL setup script.",
          needsTableSetup: true,
        }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Connection failed" }
  }
}

export const reinitializeSupabase = (url: string, key: string) => {
  try {
    supabase = createClient(url, key)
    return supabase
  } catch (error) {
    console.error("Failed to reinitialize Supabase:", error)
    return null
  }
}
