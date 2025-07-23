"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cloud, Smartphone, Monitor, FolderSyncIcon as Sync, X, Check, AlertTriangle } from "lucide-react"
import { initializeSupabaseWithCredentials, testSupabaseConnection } from "@/lib/supabase"

interface SyncSetupModalProps {
  show: boolean
  onClose: () => void
  onSetupComplete: (setupData: { supabaseUrl: string; supabaseKey: string }) => void
}

export function SyncSetupModal({ show, onClose, onSetupComplete }: SyncSetupModalProps) {
  const [step, setStep] = useState(1)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)

  const handleSetup = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setTestError("Please enter both URL and key")
      return
    }

    setIsLoading(true)
    setTestError(null)

    try {
      // Initialize Supabase with the provided credentials
      const initResult = initializeSupabaseWithCredentials(supabaseUrl.trim(), supabaseKey.trim())

      if (!initResult.success) {
        setTestError("Invalid credentials format")
        setIsLoading(false)
        return
      }

      // Test the connection
      const testResult = await testSupabaseConnection()

      if (!testResult.success) {
        setTestError("Connection failed. Please check your credentials and database setup.")
        setIsLoading(false)
        return
      }

      onSetupComplete({
        supabaseUrl: supabaseUrl.trim(),
        supabaseKey: supabaseKey.trim(),
      })

      setStep(3)
      setTimeout(() => {
        onClose()
        setStep(1)
        setSupabaseUrl("")
        setSupabaseKey("")
        setTestError(null)
      }, 2000)
    } catch (error) {
      console.error("Setup error:", error)
      setTestError("Setup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("sync_setup_skipped", "true")
    onClose()
  }

  const resetForm = () => {
    setStep(1)
    setSupabaseUrl("")
    setSupabaseKey("")
    setTestError(null)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-md w-full bg-black/90 border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="holographic-header">Cloud Sync Setup</div>
              <Button
                onClick={() => {
                  onClose()
                  resetForm()
                }}
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="p-3 bg-primary/20 border border-primary/30">
                      <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex items-center">
                      <Sync className="w-6 h-6 text-primary/70" />
                    </div>
                    <div className="p-3 bg-primary/20 border border-primary/30">
                      <Monitor className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-2 font-michroma">SYNC YOUR DATA</h2>
                  <p className="text-white/70 font-electrolize text-sm">
                    Keep your progress synced across all your devices. Access your hunter data anywhere!
                  </p>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-4">
                  <h3 className="text-primary font-michroma text-sm mb-2">Benefits:</h3>
                  <ul className="text-white/70 font-electrolize text-xs space-y-1">
                    <li>• Access data on phone & computer</li>
                    <li>• Automatic cloud backup</li>
                    <li>• Never lose your progress</li>
                    <li>• Real-time synchronization</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    Setup Sync
                  </Button>
                  <Button onClick={handleSkip} variant="ghost" className="px-4 text-white/70 hover:text-white">
                    Skip
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Cloud className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h2 className="text-lg font-bold text-primary font-michroma">SUPABASE SETUP</h2>
                  <p className="text-white/70 font-electrolize text-xs">
                    Enter your Supabase credentials to enable cloud sync
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="supabase-url" className="text-white/70 font-michroma text-xs">
                      Supabase URL
                    </Label>
                    <Input
                      id="supabase-url"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="bg-black/60 border-primary/30 text-white font-electrolize text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supabase-key" className="text-white/70 font-michroma text-xs">
                      Supabase Anon Key
                    </Label>
                    <Input
                      id="supabase-key"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="bg-black/60 border-primary/30 text-white font-electrolize text-sm"
                      type="password"
                    />
                  </div>
                </div>

                {testError && (
                  <div className="bg-red-900/20 border border-red-500/30 p-3 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 font-electrolize text-xs">{testError}</p>
                  </div>
                )}

                <div className="bg-amber-900/20 border border-amber-500/30 p-3">
                  <p className="text-amber-400 font-electrolize text-xs">
                    <strong>Need help?</strong> Create a free Supabase account at supabase.com, create a new project,
                    and get your project URL and anon key from the API settings.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={() => setStep(1)} variant="ghost" className="px-4 text-white/70 hover:text-white">
                    Back
                  </Button>
                  <Button
                    onClick={handleSetup}
                    disabled={!supabaseUrl.trim() || !supabaseKey.trim() || isLoading}
                    className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                  >
                    {isLoading ? (
                      <>
                        <Sync className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Test & Setup
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-500/30">
                  <Check className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <h2 className="text-lg font-bold text-green-400 font-michroma">SYNC ENABLED!</h2>
                  <p className="text-green-300 font-electrolize text-sm">Your data will now sync across all devices</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
