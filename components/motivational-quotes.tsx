"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Quote {
  text: string
  author: string
  anime: string
  category: string
}

const quotes: Quote[] = [
  // Strength & Power
  {
    text: "The only way to truly escape the mundane is for you to constantly be evolving.",
    author: "Saitama",
    anime: "One Punch Man",
    category: "strength",
  },
  {
    text: "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King!",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "strength",
  },
  {
    text: "Power isn't determined by your size, but the size of your heart and dreams!",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "strength",
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    author: "Natsu Dragneel",
    anime: "Fairy Tail",
    category: "strength",
  },
  {
    text: "I'll become stronger than anyone else. I'll become the strongest there is!",
    author: "Ichigo Kurosaki",
    anime: "Bleach",
    category: "strength",
  },
  {
    text: "Strength isn't about how much you can handle before you break. It's about how much you can handle after you break.",
    author: "Jiraiya",
    anime: "Naruto",
    category: "strength",
  },
  {
    text: "The true measure of strength is not physical capacity, but mental fortitude.",
    author: "All Might",
    anime: "My Hero Academia",
    category: "strength",
  },
  {
    text: "I am not a hero because I want your approval. I'm a hero because I want it!",
    author: "Bakugo Katsuki",
    anime: "My Hero Academia",
    category: "strength",
  },
  {
    text: "Even if I die, you keep living okay? Live to see what becomes of the future!",
    author: "Portgas D. Ace",
    anime: "One Piece",
    category: "strength",
  },
  {
    text: "The world isn't perfect. But it's there for us, doing the best it can. That's what makes it so damn beautiful.",
    author: "Roy Mustang",
    anime: "Fullmetal Alchemist",
    category: "strength",
  },

  // Endurance & Perseverance
  {
    text: "Hard work is what makes your dreams come true!",
    author: "Rock Lee",
    anime: "Naruto",
    category: "endurance",
  },
  {
    text: "I won't run away anymore... I won't go back on my word... that is my ninja way!",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "endurance",
  },
  {
    text: "If you don't take risks, you can't create a future!",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "endurance",
  },
  {
    text: "No matter how hard or impossible it is, never lose sight of your goal.",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "endurance",
  },
  {
    text: "Being weak is nothing to be ashamed of... Staying weak is!!",
    author: "Fuegoleon Vermillion",
    anime: "Black Clover",
    category: "endurance",
  },
  {
    text: "I'll keep getting stronger... and stronger... until I'm the strongest!",
    author: "Asta",
    anime: "Black Clover",
    category: "endurance",
  },
  {
    text: "The only time you should ever look back, is to see how far you've come.",
    author: "Natsu Dragneel",
    anime: "Fairy Tail",
    category: "endurance",
  },
  {
    text: "Push through the pain. Giving up hurts more.",
    author: "Vegeta",
    anime: "Dragon Ball Z",
    category: "endurance",
  },
  {
    text: "I will never give up! I will never go back on my word! That's my nindo, my ninja way!",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "endurance",
  },
  {
    text: "The difference between the novice and the master is that the master has failed more times than the novice has tried.",
    author: "Koro-sensei",
    anime: "Assassination Classroom",
    category: "endurance",
  },

  // Resilience & Recovery
  {
    text: "Fall down seven times, get up eight.",
    author: "Zenitsu Agatsuma",
    anime: "Demon Slayer",
    category: "resilience",
  },
  {
    text: "It's not about how hard you can hit, it's about how hard you can get hit and keep moving forward.",
    author: "Gon Freecss",
    anime: "Hunter x Hunter",
    category: "resilience",
  },
  {
    text: "The moment you give up is the moment you let someone else win.",
    author: "Kobe Bryant",
    anime: "Kuroko's Basketball",
    category: "resilience",
  },
  {
    text: "Don't beg for things. Do it yourself, or else you won't get anything.",
    author: "Renton Thurston",
    anime: "Eureka Seven",
    category: "resilience",
  },
  {
    text: "You can die anytime, but living takes true courage.",
    author: "Kenshin Himura",
    anime: "Rurouni Kenshin",
    category: "resilience",
  },
  {
    text: "Life is not a game of luck. If you wanna win, work hard.",
    author: "Sora",
    anime: "No Game No Life",
    category: "resilience",
  },
  {
    text: "When you hit the point of no return, that's the moment it truly becomes a voyage of discovery.",
    author: "Hinata Shouyou",
    anime: "Haikyuu!!",
    category: "resilience",
  },
  {
    text: "A dropout will beat a genius through hard work.",
    author: "Rock Lee",
    anime: "Naruto",
    category: "resilience",
  },
  {
    text: "If you really want to be strong... Stop caring about what your surrounding thinks of you!",
    author: "Saitama",
    anime: "One Punch Man",
    category: "resilience",
  },
  {
    text: "The weak will always be led by fear, the strong will always be led by ambition.",
    author: "Akame",
    anime: "Akame ga Kill!",
    category: "resilience",
  },

  // Honor & Duty
  { text: "A man dies when he is forgotten.", author: "Dr. Hiluluk", anime: "One Piece", category: "honor" },
  {
    text: "It's not the face that makes someone a monster, it's the choices they make with their lives.",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "honor",
  },
  {
    text: "When people are protecting something truly special to them, they truly can become... as strong as they can be.",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "honor",
  },
  {
    text: "A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.",
    author: "Jiraiya",
    anime: "Naruto",
    category: "honor",
  },
  { text: "I'd rather be hurt than hurting others.", author: "Ken Kaneki", anime: "Tokyo Ghoul", category: "honor" },
  {
    text: "If you don't share someone's pain, you can never understand them.",
    author: "Nagato",
    anime: "Naruto",
    category: "honor",
  },
  {
    text: "Those who break the rules are scum, but those who abandon their friends are worse than scum.",
    author: "Kakashi Hatake",
    anime: "Naruto",
    category: "honor",
  },
  {
    text: "The true measure of a shinobi is not how he lives but how he dies.",
    author: "Jiraiya",
    anime: "Naruto",
    category: "honor",
  },
  {
    text: "I want to be needed by someone. I want to be that person for someone.",
    author: "Crona",
    anime: "Soul Eater",
    category: "honor",
  },
  {
    text: "We are all like fireworks: we climb, we shine and always go our separate ways and become further apart.",
    author: "Toshiro Hitsugaya",
    anime: "Bleach",
    category: "honor",
  },

  // Philosophy & Wisdom
  {
    text: "Wake up to reality! Nothing ever goes as planned in this world.",
    author: "Madara Uchiha",
    anime: "Naruto",
    category: "philosophy",
  },
  {
    text: "People's lives don't end when they die, it ends when they lose faith.",
    author: "Itachi Uchiha",
    anime: "Naruto",
    category: "philosophy",
  },
  {
    text: "The world is cruel, but also very beautiful.",
    author: "Mikasa Ackerman",
    anime: "Attack on Titan",
    category: "philosophy",
  },
  {
    text: "Fear is not evil. It tells you what weakness is. And once you know your weakness, you can become stronger as well as kinder.",
    author: "Gildarts Clive",
    anime: "Fairy Tail",
    category: "philosophy",
  },
  {
    text: "You should enjoy the little detours to the fullest. Because that's where you'll find the things more important than what you want.",
    author: "Ging Freecss",
    anime: "Hunter x Hunter",
    category: "philosophy",
  },
  {
    text: "Knowing what it feels to be in pain, is exactly why we try to be kind to others.",
    author: "Jiraiya",
    anime: "Naruto",
    category: "philosophy",
  },
  {
    text: "Sometimes I do feel like I'm a failure. Like there's no hope for me. But even so, I'm not gonna give up. Ever!",
    author: "Izuku Midoriya",
    anime: "My Hero Academia",
    category: "philosophy",
  },
  {
    text: "The ticket to the future is always open.",
    author: "Vash the Stampede",
    anime: "Trigun",
    category: "philosophy",
  },
  {
    text: "Reject common sense to make the impossible possible.",
    author: "Simon",
    anime: "Gurren Lagann",
    category: "philosophy",
  },
  {
    text: "Believe in yourself. Not in the you who believes in me. Not the me who believes in you. Believe in the you who believes in yourself.",
    author: "Kamina",
    anime: "Gurren Lagann",
    category: "philosophy",
  },

  // Reality & Truth
  {
    text: "Reality is cruel, so I'm sure lies are a form of kindness. Thus, I say kindness itself is also a lie.",
    author: "Hachiman Hikigaya",
    anime: "Oregairu",
    category: "reality",
  },
  {
    text: "The fake is of far greater value. In its deliberate attempt to be real, it's more real than the real thing.",
    author: "Kaiki Deishuu",
    anime: "Monogatari",
    category: "reality",
  },
  {
    text: "I hate perfection. To be perfect is to be unable to improve any further.",
    author: "Kurotsuchi Mayuri",
    anime: "Bleach",
    category: "reality",
  },
  {
    text: "Don't believe in yourself! Believe in me who believes in you!",
    author: "Kamina",
    anime: "Gurren Lagann",
    category: "reality",
  },
  {
    text: "The world is not beautiful, therefore it is.",
    author: "Kino",
    anime: "Kino's Journey",
    category: "reality",
  },
  {
    text: "There's no such thing as a painless lesson, they just don't exist. Sacrifices are necessary.",
    author: "Edward Elric",
    anime: "Fullmetal Alchemist",
    category: "reality",
  },
  {
    text: "Mankind's greatest scientific discovery may be its inability to communicate with itself.",
    author: "Makise Kurisu",
    anime: "Steins;Gate",
    category: "reality",
  },
  {
    text: "I am the bone of my sword. Steel is my body, and fire is my blood.",
    author: "Archer",
    anime: "Fate/Stay Night",
    category: "reality",
  },
  {
    text: "The truth will set you free, but first it will piss you off.",
    author: "Senku Ishigami",
    anime: "Dr. Stone",
    category: "reality",
  },

  // Fate & Destiny
  {
    text: "I don't believe in fate or destiny. I believe in various degrees of hatred, paranoia, and abandonment.",
    author: "Gaara",
    anime: "Naruto",
    category: "fate",
  },
  {
    text: "Your words cut deep... deeper than any blade.",
    author: "Scar",
    anime: "Fullmetal Alchemist",
    category: "fate",
  },
  {
    text: "We have to live life to the fullest and never have any regrets.",
    author: "Portgas D. Ace",
    anime: "One Piece",
    category: "fate",
  },
  {
    text: "Even if we forget the faces of our friends, we will never forget the bonds that were carved into our souls.",
    author: "Otonashi Yuzuru",
    anime: "Angel Beats!",
    category: "fate",
  },
  {
    text: "I'll leave tomorrow's problems to tomorrow's me.",
    author: "Saitama",
    anime: "One Punch Man",
    category: "fate",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Shouyou Hinata",
    anime: "Haikyuu!!",
    category: "fate",
  },
  { text: "We are all fools in love.", author: "Pride", anime: "Fullmetal Alchemist", category: "fate" },
  {
    text: "If you have time to think of a beautiful ending, then live beautifully until the end.",
    author: "Gintoki Sakata",
    anime: "Gintama",
    category: "fate",
  },

  // Protection & Sacrifice
  {
    text: "I'll protect everyone. You don't have to worry about anything!",
    author: "Ichigo Kurosaki",
    anime: "Bleach",
    category: "protection",
  },
  {
    text: "I would rather die fighting than live without purpose.",
    author: "Kenpachi Zaraki",
    anime: "Bleach",
    category: "protection",
  },
  {
    text: "If I become stronger, will I be able to protect everyone?",
    author: "Orihime Inoue",
    anime: "Bleach",
    category: "protection",
  },
  {
    text: "I'll become so strong that my name will be known even in heaven!",
    author: "Roronoa Zoro",
    anime: "One Piece",
    category: "protection",
  },
  {
    text: "I don't want to survive. I want to live.",
    author: "Captain Wall-E",
    anime: "One Piece",
    category: "protection",
  },
  {
    text: "A hero is someone who understands the responsibility that comes with his freedom.",
    author: "Bob Dylan",
    anime: "My Hero Academia",
    category: "protection",
  },
  { text: "Plus Ultra!", author: "All Might", anime: "My Hero Academia", category: "protection" },
  { text: "I am here!", author: "All Might", anime: "My Hero Academia", category: "protection" },

  // Self-Belief & Confidence
  { text: "Believe it!", author: "Naruto Uzumaki", anime: "Naruto", category: "self-belief" },
  { text: "I'm gonna be the Pirate King!", author: "Monkey D. Luffy", anime: "One Piece", category: "self-belief" },
  { text: "I'll surpass you someday!", author: "Asta", anime: "Black Clover", category: "self-belief" },
  { text: "I can do it!", author: "Izuku Midoriya", anime: "My Hero Academia", category: "self-belief" },
  { text: "Yare yare daze.", author: "Jotaro Kujo", anime: "JoJo's Bizarre Adventure", category: "self-belief" },
  {
    text: "I reject your reality and substitute my own!",
    author: "Senku Ishigami",
    anime: "Dr. Stone",
    category: "self-belief",
  },
  {
    text: "This is the choice of Steins Gate!",
    author: "Okabe Rintarou",
    anime: "Steins;Gate",
    category: "self-belief",
  },
  { text: "I am the hope of the universe!", author: "Goku", anime: "Dragon Ball Z", category: "self-belief" },
  {
    text: "My flames will never be extinguished!",
    author: "Natsu Dragneel",
    anime: "Fairy Tail",
    category: "self-belief",
  },
  { text: "I'll show you the power of youth!", author: "Might Guy", anime: "Naruto", category: "self-belief" },
]

export function MotivationalQuotes({ className }: { className?: string }) {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }

  const refreshQuote = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentQuote(getRandomQuote())
      setIsAnimating(false)
    }, 300)
  }

  useEffect(() => {
    setCurrentQuote(getRandomQuote())
  }, [])

  return (
    <div
      className={`p-4 bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui ${className}`}
    >
      <div className="holographic-header flex justify-between items-center">
        <span className="font-michroma text-sm">Hunter's Wisdom</span>
        <Button
          onClick={refreshQuote}
          size="sm"
          variant="ghost"
          className="text-primary/70 hover:text-primary p-1"
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
          <blockquote className="text-white/90 font-electrolize text-sm sm:text-base italic leading-relaxed">
            "{currentQuote.text}"
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <cite className="text-primary font-orbitron text-xs sm:text-sm font-bold not-italic">
              — {currentQuote.author}
            </cite>
            <div className="flex items-center gap-2">
              <span className="text-white/60 font-electrolize text-xs">{currentQuote.anime}</span>
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-michroma uppercase tracking-wider border border-primary/30">
                {currentQuote.category}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
