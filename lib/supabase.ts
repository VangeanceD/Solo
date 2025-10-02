import { createClient } from "@supabase/supabase-js"

// Check if environment variables are properly set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate that we have proper URLs
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.startsWith("http://") || url.startsWith("https://")
  } catch {
    return false
  }
}

// Create Supabase client only if credentials are valid
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Show console warning if not configured
if (!isSupabaseConfigured() && typeof window !== "undefined") {
  console.warn(
    "⚠️ Supabase is not configured. The app will work in local-only mode.\n" +
      "To enable cloud sync:\n" +
      "1. Go to Project Settings (gear icon)\n" +
      "2. Add environment variables:\n" +
      "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n" +
      "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key",
  )
}
