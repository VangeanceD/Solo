"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getSupabase } from "@/lib/supabase"
import type { Player } from "@/lib/player"

export interface SyncStatus {
  isOnline: boolean
  isLoading: boolean
  lastSync: Date | null
  error: string | null
  hasUnsyncedChanges: boolean
}

export function usePlayerSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: typeof window !== "undefined" ? navigator.onLine : false,
    isLoading: false,
    lastSync: null,
    error: null,
    hasUnsyncedChanges: false,
  })

  const syncTimeoutRef = useRef<NodeJS.Timeout>()
  const isConfigured = useRef(false)

  // Check if Supabase is configured
  useEffect(() => {
    const checkConfiguration = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem("supabase_url")
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem("supabase_anon_key")
      isConfigured.current = !!(supabaseUrl && supabaseKey)
    }

    checkConfiguration()

    // Listen for storage changes
    const handleStorageChange = () => checkConfiguration()
    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setSyncStatus((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setSyncStatus((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getDeviceId = useCallback(() => {
    let deviceId = localStorage.getItem("device_id")
    if (!deviceId) {
      deviceId = crypto.randomUUID()
      localStorage.setItem("device_id", deviceId)
    }
    return deviceId
  }, [])

  const syncToCloud = useCallback(
    async (player: Player): Promise<boolean> => {
      if (!isConfigured.current || !syncStatus.isOnline) {
        return false
      }

      const supabase = getSupabase()
      if (!supabase) return false

      setSyncStatus((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const deviceId = getDeviceId()

        const { error } = await supabase.from("players").upsert({
          device_id: deviceId,
          player_data: player,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error

        setSyncStatus((prev) => ({
          ...prev,
          isLoading: false,
          lastSync: new Date(),
          hasUnsyncedChanges: false,
          error: null,
        }))

        return true
      } catch (error) {
        setSyncStatus((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Sync failed",
        }))
        return false
      }
    },
    [syncStatus.isOnline, getDeviceId],
  )

  const loadFromCloud = useCallback(async (): Promise<Player | null> => {
    if (!isConfigured.current || !syncStatus.isOnline) {
      return null
    }

    const supabase = getSupabase()
    if (!supabase) return null

    setSyncStatus((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const deviceId = getDeviceId()

      const { data, error } = await supabase.from("players").select("player_data").eq("device_id", deviceId).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No data found, not an error
          setSyncStatus((prev) => ({ ...prev, isLoading: false }))
          return null
        }
        throw error
      }

      setSyncStatus((prev) => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
        error: null,
      }))

      return data.player_data as Player
    } catch (error) {
      setSyncStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Load failed",
      }))
      return null
    }
  }, [syncStatus.isOnline, getDeviceId])

  const setupSync = useCallback((url: string, key: string) => {
    localStorage.setItem("supabase_url", url)
    localStorage.setItem("supabase_anon_key", key)
    isConfigured.current = true
  }, [])

  const markUnsyncedChanges = useCallback(() => {
    setSyncStatus((prev) => ({ ...prev, hasUnsyncedChanges: true }))
  }, [])

  return {
    syncStatus,
    syncToCloud,
    loadFromCloud,
    setupSync,
    markUnsyncedChanges,
    isConfigured: isConfigured.current,
  }
}
