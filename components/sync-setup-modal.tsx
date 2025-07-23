"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Cloud,
  Smartphone,
  Monitor,
  FolderSyncIcon as Sync,
  X,
  Check,
  AlertTriangle,
  Copy,
  ExternalLink,
} from "lucide-react"
import { testSupabaseConnection, reinitializeSupabase } from "@/lib/supabase"

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
  const [needsTableSetup, setNeedsTableSetup] = useState(false)

  const sqlScript = `-- Create the players table for storing game data
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL UNIQUE,
    player_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_device_id ON players(device_id);
CREATE INDEX IF NOT EXISTS idx_players_updated_at ON players(updated_at);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations on players" ON players
    FOR ALL USING (true);`

  const handleSetup = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setTestError("Please enter both URL and key")
      return
    }

    setIsLoading(true)
    setTestError(null)

    try {
      const testResult = await testSupabaseConnection(supabaseUrl.trim(), supabaseKey.trim())

      if (testResult.success) {
        // Store credentials
        localStorage.setItem("supabase_url", supabaseUrl.trim())
        localStorage.setItem("supabase_anon_key", supabaseKey.trim())

        // Reinitialize Supabase with new credentials
        reinitializeSupabase(supabaseUrl.trim(), supabaseKey.trim())

        onSetupComplete({
          supabaseUrl: supabaseUrl.trim(),
          supabaseKey: supabaseKey.trim(),
        })

        setStep(3)
        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      } else if (testResult.needsTableSetup) {
        setNeedsTableSetup(true)
        setStep(4) // Table setup step
      } else {
        setTestError(testResult.error || "Connection failed")
      }
    } catch (error) {
      console.error("Setup error:", error)
      setTestError("Setup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryAfterTableSetup = async () => {
    setIsLoading(true)
    setTestError(null)

    try {
      const testResult = await testSupabaseConnection(supabaseUrl.trim(), supabaseKey.trim())

      if (testResult.success) {
        // Store credentials
        localStorage.setItem("supabase_url", supabaseUrl.trim())
        localStorage.setItem("supabase_anon_key", supabaseKey.trim())

        // Reinitialize Supabase with new credentials
        reinitializeSupabase(supabaseUrl.trim(), supabaseKey.trim())

        onSetupComplete({
          supabaseUrl: supabaseUrl.trim(),
          supabaseKey: supabaseKey.trim(),
        })

        setStep(3)
        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      } else {
        setTestError(testResult.error || "Table setup verification failed")
      }
    } catch (error) {
      console.error("Retry error:", error)
      setTestError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
    }
  }

  const openSqlEditor = () => {
    if (supabaseUrl) {
      const projectId = supabaseUrl.split("//")[1]?.split(".")[0]
      if (projectId) {
        window.open(`https://supabase.com/dashboard/project/${projectId}/sql`, "_blank")
      }
    }
  }

  const resetForm = () => {
    setStep(1)
    setSupabaseUrl("")
    setSupabaseKey("")
    setTestError(null)
    setNeedsTableSetup(false)
  }

  const handleClose = () => {
    onClose()
    resetForm()
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
            className="max-w-2xl w-full bg-black/90 border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="holographic-header">Cloud Sync Setup</div>
              <Button onClick={handleClose} size="sm" variant="ghost" className="text-white/70 hover:text-white p-1">
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
                  <Button onClick={handleClose} variant="ghost" className="px-4 text-white/70 hover:text-white">
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

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h2 className="text-lg font-bold text-amber-400 font-michroma">DATABASE SETUP REQUIRED</h2>
                  <p className="text-white/70 font-electrolize text-xs">
                    The players table needs to be created in your Supabase database.
                  </p>
                </div>

                <div className="bg-amber-900/20 border border-amber-500/30 p-3">
                  <p className="text-amber-400 font-electrolize text-xs">
                    <strong>Action Required:</strong> Please run the SQL script below in your Supabase SQL editor.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/70 font-michroma text-xs">SQL Script</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(sqlScript)}
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button onClick={openSqlEditor} size="sm" variant="outline" className="text-xs bg-transparent">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open SQL Editor
                      </Button>
                    </div>
                  </div>
                  <div className="bg-black/60 border border-primary/20 p-3 rounded text-xs font-mono text-white/80 max-h-40 overflow-y-auto">
                    <pre>{sqlScript}</pre>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 p-3">
                  <p className="text-blue-400 font-electrolize text-xs">
                    <strong>Steps:</strong>
                  </p>
                  <ol className="list-decimal list-inside mt-1 space-y-1 text-blue-300 font-electrolize text-xs">
                    <li>Copy the SQL script above</li>
                    <li>Open your Supabase SQL editor</li>
                    <li>Paste and run the script</li>
                    <li>Click "Test Again" below</li>
                  </ol>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={() => setStep(2)} variant="ghost" className="px-4 text-white/70 hover:text-white">
                    Back
                  </Button>
                  <Button
                    onClick={handleRetryAfterTableSetup}
                    disabled={isLoading}
                    className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                  >
                    {isLoading ? (
                      <>
                        <Sync className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Again"
                    )}
                  </Button>
                </div>

                {testError && (
                  <div className="bg-red-900/20 border border-red-500/30 p-3 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 font-electrolize text-xs">{testError}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
