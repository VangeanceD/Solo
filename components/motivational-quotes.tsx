"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const motivationalQuotes = [
  {
    text: "Exercise like a monster, Eat like a bird, Sleep like a fool",
    author: "Hunter's Creed",
    category: "fitness",
  },
  {
    text: "Wake up to reality! Nothing ever goes as planned in this accursed world.",
    author: "Madara Uchiha",
    category: "reality",
  },
  {
    text: "I'm gonna be the Pirate King!",
    author: "Monkey D. Luffy",
    category: "dreams",
  },
  {
    text: "If you don't take risks, you can't create a future.",
    author: "Monkey D. Luffy",
    category: "courage",
  },
  {
    text: "Hard work is what makes your dreams come true.",
    author: "Rock Lee",
    category: "effort",
  },
  {
    text: "A hero can become a villain out of revenge.",
    author: "Aizen Sosuke",
    category: "wisdom",
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    author: "Natsu Dragneel",
    category: "perseverance",
  },
  {
    text: "I am the hope of the universe. I am the answer to all living things that cry out for peace.",
    author: "Son Goku",
    category: "hope",
  },
  {
    text: "Plus Ultra!",
    author: "All Might",
    category: "motivation",
  },
  {
    text: "Yare Yare Daze...",
    author: "Jotaro Kujo",
    category: "attitude",
  },
  {
    text: "I'll take a potato chip... and eat it!",
    author: "Light Yagami",
    category: "confidence",
  },
  {
    text: "People's lives don't end when they die. It ends when they lose faith.",
    author: "Itachi Uchiha",
    category: "faith",
  },
  {
    text: "The only way to truly escape the mundane is for you to constantly be evolving.",
    author: "Izuku Midoriya",
    category: "growth",
  },
  {
    text: "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King!",
    author: "Monkey D. Luffy",
    category: "freedom",
  },
  {
    text: "Being weak is nothing to be ashamed of. Staying weak is.",
    author: "Fuegoleon Vermillion",
    category: "strength",
  },
  {
    text: "I'll become so strong that my name will be known even in the heavens!",
    author: "Roronoa Zoro",
    category: "ambition",
  },
  {
    text: "The difference between the novice and the master is that the master has failed more times than the novice has tried.",
    author: "Jiraiya",
    category: "mastery",
  },
  {
    text: "You should enjoy the little detours. To the fullest. Because that's where you'll find the things more important than what you want.",
    author: "Ging Freecss",
    category: "journey",
  },
  {
    text: "I am not alone. I can hear them... I can hear everyone's voices... I can sense everyone's feelings... I am not alone... Everyone's feelings... They support me... They are what give me the will to stand and fight!",
    author: "Natsu Dragneel",
    category: "support",
  },
  {
    text: "Even if we forget the faces of our friends, we will never forget the bonds that were carved into our souls.",
    author: "Otonashi Yuzuru",
    category: "bonds",
  },
]

interface MotivationalQuotesProps {
  className?: string
}

export function MotivationalQuotes({ className = "" }: MotivationalQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Set a random quote on component mount
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setCurrentQuote(randomQuote)
  }, [])

  const getNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      setCurrentQuote(randomQuote)
      setIsAnimating(false)
    }, 300)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      fitness: "text-green-400",
      reality: "text-red-400",
      dreams: "text-blue-400",
      courage: "text-orange-400",
      effort: "text-purple-400",
      wisdom: "text-indigo-400",
      perseverance: "text-pink-400",
      hope: "text-yellow-400",
      motivation: "text-primary",
      attitude: "text-gray-400",
      confidence: "text-amber-400",
      faith: "text-cyan-400",
      growth: "text-lime-400",
      freedom: "text-teal-400",
      strength: "text-red-500",
      ambition: "text-orange-500",
      mastery: "text-purple-500",
      journey: "text-blue-500",
      support: "text-green-500",
      bonds: "text-pink-500",
    }
    return colors[category as keyof typeof colors] || "text-primary"
  }

  return (
    <Card
      className={`bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui ${className}`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Quote className="w-5 h-5 text-primary/70" />
            <span className="text-primary font-michroma text-sm sm:text-base">DAILY MOTIVATION</span>
          </div>
          <Button
            onClick={getNewQuote}
            size="sm"
            variant="ghost"
            className="text-primary/70 hover:text-primary p-2"
            disabled={isAnimating}
          >
            <RefreshCw className={`w-4 h-4 ${isAnimating ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <blockquote className="text-white/90 font-electrolize text-sm sm:text-base leading-relaxed italic">
              "{currentQuote.text}"
            </blockquote>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <cite className={`font-michroma text-xs sm:text-sm ${getCategoryColor(currentQuote.category)}`}>
                — {currentQuote.author}
              </cite>
              <span className="text-xs text-white/50 font-orbitron uppercase tracking-wider">
                {currentQuote.category}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
