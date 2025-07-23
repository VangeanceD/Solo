"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { testSupabaseConnection } from "@/lib/supabase"

interface SyncSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSetup: (url: string, key: string) => void
}

export function SyncSetupModal({ isOpen, onClose, onSetup }: SyncSetupModalProps) {
  const [url, setUrl] = useState("")
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"setup" | "database" | "test">("setup")
  const [showSqlScript, setShowSqlScript] = useState(false)

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
    FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON players 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();`

  const handleTest = async () => {
    if (!url || !key) {
      setError("Please enter both URL and API key")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await testSupabaseConnection(url, key)

      if (result.success) {
        // Connection successful, save credentials
        localStorage.setItem("supabase_url", url)
        localStorage.setItem("supabase_key", key)
        onSetup(url, key)
        onClose()
        setStep("setup")
      } else {
        if (result.error?.includes("does not exist")) {
          setError(result.error)
          setStep("database")
        } else {
          setError(result.error || "Connection failed")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openSqlEditor = () => {
    if (url) {
      const projectId = url.split("//")[1]?.split(".")[0]
      if (projectId) {
        window.open(`https://supabase.com/dashboard/project/${projectId}/sql`, "_blank")
      }
    }
  }

  const handleClose = () => {
    setStep("setup")
    setError("")
    setShowSqlScript(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl neon-blue">Setup Cloud Sync</DialogTitle>
        </DialogHeader>

        {step === "setup" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="url" className="text-sm font-medium">
                  Supabase Project URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="key" className="text-sm font-medium">
                  Supabase Anon Key
                </Label>
                <Input
                  id="key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button onClick={handleTest} disabled={isLoading || !url || !key} className="flex-1 cyber-button">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>To get your Supabase credentials:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    supabase.com
                  </a>
                </li>
                <li>Create a new project or select existing one</li>
                <li>Go to Settings → API</li>
                <li>Copy the Project URL and anon/public key</li>
              </ol>
            </div>
          </div>
        )}

        {step === "database" && (
          <div className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Connection successful! Now you need to create the database table.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Step 1: Run SQL Script</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openSqlEditor}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open SQL Editor
                </Button>
              </div>

              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowSqlScript(!showSqlScript)} className="mb-2">
                  {showSqlScript ? "Hide" : "Show"} SQL Script
                </Button>

                {showSqlScript && (
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-60 overflow-y-auto">
                      <code>{sqlScript}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(sqlScript)}
                      className="absolute top-2 right-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Click "Open SQL Editor" above</li>
                  <li>Copy the SQL script by clicking the copy button</li>
                  <li>Paste it in the SQL editor and click "Run"</li>
                  <li>Come back here and test the connection again</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleTest} disabled={isLoading} className="flex-1 cyber-button">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Again...
                  </>
                ) : (
                  "Test Connection Again"
                )}
              </Button>
              <Button variant="outline" onClick={() => setStep("setup")}>
                Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
