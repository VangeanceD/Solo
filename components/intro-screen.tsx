"use client"

import { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { BackgroundEffects } from "@/components/background-effects"

interface IntroScreenProps {
  onPlayerCreated: (name: string) => void
}

export function IntroScreen({ onPlayerCreated }: IntroScreenProps) {
  const [name, setName] = useState("")

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim()) {
      onPlayerCreated(name.trim())
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center relative overflow-hidden">
      <BackgroundEffects />

      <div className="w-full flex flex-col lg:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full lg:w-1/2 text-center lg:text-left pr-0 lg:pr-8 mb-8 lg:mb-0">
          <motion.div
            className="animate-float"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight glow-text solo-text font-audiowide">
              <span className="text-primary">HUNTER PROTOCOL</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white/80 leading-tight font-electrolize">
              Are you ready to <span className="text-primary glow-text">ARISE</span> and conquer?
            </p>
          </motion.div>

          <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start space-x-4">
            <div className="animate-pulse-glow rounded-full w-3 h-3 bg-primary"></div>
            <div
              className="animate-pulse-glow rounded-full w-3 h-3 bg-primary"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="animate-pulse-glow rounded-full w-3 h-3 bg-primary" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>

        <motion.div
          className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-black/50 backdrop-blur-lg p-6 sm:p-8 rounded-lg border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
            <div className="holographic-header">System Access</div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 text-center glow-text solo-text font-michroma">
              HUNTER REGISTRATION
            </h2>
            <Input
              type="text"
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ENTER YOUR DESIGNATION, HUNTER"
              className="w-full px-4 py-4 sm:py-6 bg-black/60 text-primary placeholder:text-primary/50 border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary tracking-wider font-electrolize text-sm sm:text-base"
            />
            <div className="mt-4 text-center animate-pulse">
              <p className="text-primary/70 text-xs sm:text-sm tracking-wider font-michroma">
                PRESS ENTER TO INITIALIZE SYSTEM
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
