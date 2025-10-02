"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { BackgroundEffects } from "@/components/background-effects"
import { supabase } from "@/lib/supabase"
import { useNotification } from "@/components/notification-provider"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        addNotification("Welcome back, Hunter!", "success")
      } else {
        // Sign up
        if (!username.trim()) {
          addNotification("Please enter a username", "error")
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim(),
            },
          },
        })

        if (error) throw error

        addNotification("Account created! Check your email to verify your account.", "success")
      }
    } catch (error: any) {
      addNotification(error.message || "Authentication failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <BackgroundEffects />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary font-audiowide glow-text mb-2">ARISE</h1>
          <p className="text-white/70 font-electrolize">Hunter Protocol v3.0</p>
        </div>

        <Card className="bg-black/90 backdrop-blur-lg border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
          <CardContent className="p-6">
            <div className="holographic-header mb-6">{isLogin ? "System Login" : "Hunter Registration"}</div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="username" className="text-white/70 font-michroma">
                    Hunter Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black/60 border-primary/30 text-white font-electrolize mt-2"
                    placeholder="Enter your hunter name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-white/70 font-michroma">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/60 border-primary/30 text-white font-electrolize mt-2"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white/70 font-michroma">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/60 border-primary/30 text-white font-electrolize mt-2"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                {!isLogin && <p className="text-xs text-white/50 mt-1 font-electrolize">Minimum 6 characters</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "LOGGING IN..." : "CREATING ACCOUNT..."}
                  </>
                ) : (
                  <>{isLogin ? "LOGIN" : "CREATE ACCOUNT"}</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary/70 hover:text-primary text-sm font-electrolize transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/50 text-xs mt-4 font-electrolize">
          Your data is securely stored and encrypted
        </p>
      </motion.div>
    </div>
  )
}
