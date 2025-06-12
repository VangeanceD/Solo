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
    text: "I'll become so strong that my name will be known even in the heavens!",
    author: "Roronoa Zoro",
    category: "strength",
  },
  {
    text: "Nothing happened. I can take on a little more.",
    author: "Roronoa Zoro",
    category: "endurance",
  },
  {
    text: "When the world shoves you around, you just gotta stand up and shove back. It's not like somebody's gonna save you if you start babbling excuses.",
    author: "Roronoa Zoro",
    category: "resilience",
  },
  {
    text: "Scars on the back are a swordsman's shame.",
    author: "Roronoa Zoro",
    category: "honor",
  },
  {
    text: "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King!",
    author: "Monkey D. Luffy",
    category: "freedom",
  },
  {
    text: "Being weak is nothing to be ashamed of. Staying weak is.",
    author: "Fuegoleon Vermillion",
    category: "growth",
  },
  {
    text: "Hard work is what makes your dreams come true.",
    author: "Rock Lee",
    category: "effort",
  },
  {
    text: "A dropout will beat a genius through hard work.",
    author: "Rock Lee",
    category: "determination",
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    author: "Natsu Dragneel",
    category: "perseverance",
  },
  {
    text: "Fear is not evil. It tells you what weakness is. And once you know your weakness, you can become stronger as well as kinder.",
    author: "Gildarts Clive",
    category: "wisdom",
  },
  {
    text: "We are all like fireworks: we climb, we shine and always go our separate ways and become further apart. But even when that time comes, let's not disappear like a firework and continue to shine forever.",
    author: "Hitsugaya Toshiro",
    category: "legacy",
  },
  {
    text: "If you don't take risks, you can't create a future.",
    author: "Monkey D. Luffy",
    category: "courage",
  },
  {
    text: "People's lives don't end when they die. It ends when they lose faith.",
    author: "Itachi Uchiha",
    category: "faith",
  },
  {
    text: "The difference between the novice and the master is that the master has failed more times than the novice has tried.",
    author: "Jiraiya",
    category: "mastery",
  },
  {
    text: "It's not the face that makes someone a monster, it's the choices they make with their lives.",
    author: "Naruto Uzumaki",
    category: "character",
  },
  {
    text: "When people are protecting something truly special to them, they truly can become as strong as they can be.",
    author: "Naruto Uzumaki",
    category: "protection",
  },
  {
    text: "I am not alone. I can hear them... I can hear everyone's voices... I can sense everyone's feelings... I am not alone... Everyone's feelings... They support me... They are what give me the will to stand and fight!",
    author: "Natsu Dragneel",
    category: "support",
  },
  {
    text: "You should enjoy the little detours. To the fullest. Because that's where you'll find the things more important than what you want.",
    author: "Ging Freecss",
    category: "journey",
  },
  {
    text: "Even if we forget the faces of our friends, we will never forget the bonds that were carved into our souls.",
    author: "Otonashi Yuzuru",
    category: "bonds",
  },
  {
    text: "The only way to truly escape the mundane is for you to constantly be evolving.",
    author: "Izuku Midoriya",
    category: "evolution",
  },
  {
    text: "Whether you win or lose, looking back and learning from your experience is a part of life.",
    author: "All Might",
    category: "learning",
  },
  {
    text: "A real man never dies, even when he's killed!",
    author: "Kamina",
    category: "spirit",
  },
  {
    text: "Believe in yourself. Not in the you who believes in me. Not the me who believes in you. Believe in the you who believes in yourself.",
    author: "Kamina",
    category: "self-belief",
  },
  {
    text: "Your drill is the drill that will pierce the heavens!",
    author: "Kamina",
    category: "potential",
  },
  {
    text: "Don't believe in yourself! Believe in me who believes in you!",
    author: "Kamina",
    category: "trust",
  },
  {
    text: "I am the bone of my sword. Steel is my body and fire is my blood.",
    author: "Archer",
    category: "dedication",
  },
  {
    text: "People die when they are killed. That's the way it should be.",
    author: "Shirou Emiya",
    category: "reality",
  },
  {
    text: "The archer class really is made up of archers!",
    author: "Rin Tohsaka",
    category: "logic",
  },
  {
    text: "I'll take a potato chip... and eat it!",
    author: "Light Yagami",
    category: "confidence",
  },
  {
    text: "In this world, wherever there is light, there are also shadows.",
    author: "Hiruzen Sarutobi",
    category: "balance",
  },
  {
    text: "Those who break the rules are scum, but those who abandon their friends are worse than scum.",
    author: "Kakashi Hatake",
    category: "loyalty",
  },
  {
    text: "A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.",
    author: "Jiraiya",
    category: "growth",
  },
  {
    text: "Wake up to reality! Nothing ever goes as planned in this accursed world.",
    author: "Madara Uchiha",
    category: "reality",
  },
  {
    text: "Power is not will, it is the phenomenon of physically making things happen.",
    author: "Madara Uchiha",
    category: "power",
  },
  {
    text: "The concept of hope is nothing more than giving up. A word that holds no true meaning.",
    author: "Madara Uchiha",
    category: "despair",
  },
  {
    text: "In this world, wherever there is light, there are also shadows. As long as the concept of winners exists, there must also be losers.",
    author: "Madara Uchiha",
    category: "duality",
  },
  {
    text: "Man seeks peace, yet at the same time yearning for war... Those are the two realms belonging solely to man.",
    author: "Madara Uchiha",
    category: "human-nature",
  },
  {
    text: "Love is not necessary, power is the only true necessity.",
    author: "Madara Uchiha",
    category: "philosophy",
  },
  {
    text: "The longer you live, the more you realize that reality is just made of pain, suffering, and emptiness.",
    author: "Madara Uchiha",
    category: "experience",
  },
  {
    text: "I am the hope of the universe. I am the answer to all living things that cry out for peace.",
    author: "Son Goku",
    category: "hope",
  },
  {
    text: "Power comes in response to a need, not a desire.",
    author: "Son Goku",
    category: "necessity",
  },
  {
    text: "I would rather be a brainless beast than a heartless monster.",
    author: "Son Goku",
    category: "humanity",
  },
  {
    text: "Plus Ultra!",
    author: "All Might",
    category: "motivation",
  },
  {
    text: "A true hero always finds a way for justice to be served.",
    author: "All Might",
    category: "justice",
  },
  {
    text: "Whether you win or lose, looking back and learning from your experience is a part of life.",
    author: "All Might",
    category: "reflection",
  },
  {
    text: "Yare Yare Daze...",
    author: "Jotaro Kujo",
    category: "attitude",
  },
  {
    text: "I, Giorno Giovanna, have a dream.",
    author: "Giorno Giovanna",
    category: "ambition",
  },
  {
    text: "Your next line is...",
    author: "Joseph Joestar",
    category: "prediction",
  },
  {
    text: "I reject my humanity, JoJo!",
    author: "Dio Brando",
    category: "transformation",
  },
  {
    text: "You thought it was someone else, but it was me, Dio!",
    author: "Dio Brando",
    category: "surprise",
  },
  {
    text: "Since the beginning of time, mankind has used symbols to transcend the limitations of language.",
    author: "Sosuke Aizen",
    category: "transcendence",
  },
  {
    text: "Admiration is the emotion furthest from understanding.",
    author: "Sosuke Aizen",
    category: "understanding",
  },
  {
    text: "No one stands on the top of the world. Not you, not me, not even gods. But the unbearable vacancy of the throne in the sky is over. From now on... I will be sitting on it.",
    author: "Sosuke Aizen",
    category: "supremacy",
  },
  {
    text: "Reason exists for those who cannot go on living without clinging to it. People who find wonderful in every small thing, however, do not need it.",
    author: "Sosuke Aizen",
    category: "reason",
  },
  {
    text: "The betrayer will always be seen as the betrayer. It is the victor who decides what is right and what is wrong.",
    author: "Sosuke Aizen",
    category: "victory",
  },
  {
    text: "Arrogance destroys the footholds of victory.",
    author: "Sosuke Aizen",
    category: "humility",
  },
  {
    text: "I have always been in the sky. You were the ones who were always on the ground.",
    author: "Sosuke Aizen",
    category: "perspective",
  },
  {
    text: "Laws exist only for those who cannot live without clinging to them.",
    author: "Sosuke Aizen",
    category: "freedom",
  },
  {
    text: "If fate is a millstone, then we are the grist. There is nothing we can do. So I wish for strength. If I cannot protect them from the wheel, then give me a strong blade, and enough strength... to shatter fate.",
    author: "Ichigo Kurosaki",
    category: "fate",
  },
  {
    text: "I'm not superman, so I can't say anything big like I'll protect everyone on earth. I'm not a modest guy who will say it's enough if I can protect as many people as my two hands can handle either. I want to protect a mountain-load of people.",
    author: "Ichigo Kurosaki",
    category: "protection",
  },
  {
    text: "We fear that which we cannot see.",
    author: "Tite Kubo",
    category: "fear",
  },
  {
    text: "Remember this well. There are two types of fights. As long as we place ourselves in battle, we must always know the difference: fights to defend life... and fights to defend pride.",
    author: "Ukitake Jushiro",
    category: "combat",
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    author: "Natsu Dragneel",
    category: "persistence",
  },
  {
    text: "Moving on doesn't mean you forget about things. It just means you have to accept what's happened and continue living.",
    author: "Erza Scarlet",
    category: "acceptance",
  },
  {
    text: "It's always sad to part with those whom you love, but your companions will help you bear that sadness.",
    author: "Erza Scarlet",
    category: "companionship",
  },
  {
    text: "All I need is the power to be able to protect my comrades. So long as I can have the strength to do that, I don't care if I'm weaker than everyone in the world.",
    author: "Erza Scarlet",
    category: "protection",
  },
  {
    text: "There are times when disagreements and misunderstandings occur. But if you truly care for each other, those will definitely be resolved.",
    author: "Erza Scarlet",
    category: "relationships",
  },
  {
    text: "We don't have to know what tomorrow holds! That's what makes tomorrow so exciting!",
    author: "Natsu Dragneel",
    category: "future",
  },
  {
    text: "I'd rather die fighting than live without purpose.",
    author: "Natsu Dragneel",
    category: "purpose",
  },
  {
    text: "The real question is not whether machines think but whether men do.",
    author: "Makise Kurisu",
    category: "intelligence",
  },
  {
    text: "People's feelings are memories that transcend time.",
    author: "Makise Kurisu",
    category: "emotion",
  },
  {
    text: "Time is passing so quickly. Right now, I feel like complaining to Einstein. Whether time is slow or fast depends on perception. Relativity theory is so romantic. And so sad.",
    author: "Makise Kurisu",
    category: "time",
  },
  {
    text: "Being alone and being lonely are two different things.",
    author: "Suzumiya Haruhi",
    category: "solitude",
  },
  {
    text: "If you truly want to escape from everyday life, you've no other choice but to keep evolving. No matter whether you're aiming higher or lower.",
    author: "Oreki Houtarou",
    category: "evolution",
  },
  {
    text: "I hate nice girls. If they so much as say hello, it stays on my mind. If they return my texts, my heart races. The day one of them calls me, I know I'll look at my call history and grin. But I know that's just them being nice. People who are nice to me are also nice to everyone else. I almost end up forgetting that. If I'm not careful, I might mistake that kindness for something else. If I become too self-conscious, it might destroy me. So I hate nice girls.",
    author: "Hikigaya Hachiman",
    category: "relationships",
  },
  {
    text: "Youth is a lie. It's nothing but evil. Those of you who rejoice in youth are perpetually deceiving yourselves and those around you. You perceive everything about the reality surrounding you in a positive light. Even obvious lies and secrets, and errors and failures - you'll dress them up as the spice of youth.",
    author: "Hikigaya Hachiman",
    category: "youth",
  },
  {
    text: "Hard work betrays none, but dreams betray many.",
    author: "Hikigaya Hachiman",
    category: "reality",
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
      strength: "text-red-500",
      endurance: "text-orange-500",
      resilience: "text-purple-500",
      honor: "text-yellow-500",
      freedom: "text-blue-500",
      growth: "text-lime-400",
      effort: "text-purple-400",
      determination: "text-red-400",
      perseverance: "text-pink-400",
      wisdom: "text-indigo-400",
      legacy: "text-cyan-400",
      courage: "text-orange-400",
      faith: "text-cyan-400",
      mastery: "text-purple-500",
      character: "text-green-500",
      protection: "text-blue-400",
      support: "text-green-500",
      journey: "text-blue-500",
      bonds: "text-pink-500",
      evolution: "text-lime-400",
      learning: "text-indigo-500",
      spirit: "text-red-600",
      "self-belief": "text-yellow-400",
      potential: "text-orange-600",
      trust: "text-blue-300",
      dedication: "text-gray-400",
      reality: "text-red-400",
      logic: "text-gray-500",
      confidence: "text-amber-400",
      balance: "text-purple-300",
      loyalty: "text-blue-600",
      despair: "text-gray-600",
      duality: "text-purple-600",
      "human-nature": "text-red-300",
      philosophy: "text-indigo-600",
      experience: "text-gray-500",
      hope: "text-yellow-400",
      necessity: "text-orange-300",
      humanity: "text-green-300",
      motivation: "text-primary",
      justice: "text-blue-400",
      reflection: "text-indigo-300",
      attitude: "text-gray-400",
      ambition: "text-orange-500",
      prediction: "text-purple-400",
      transformation: "text-red-600",
      surprise: "text-yellow-600",
      transcendence: "text-purple-700",
      understanding: "text-indigo-400",
      supremacy: "text-red-700",
      reason: "text-gray-400",
      victory: "text-yellow-500",
      humility: "text-green-400",
      perspective: "text-blue-300",
      fate: "text-purple-600",
      fear: "text-gray-600",
      combat: "text-red-500",
      persistence: "text-orange-400",
      acceptance: "text-green-400",
      companionship: "text-blue-400",
      relationships: "text-pink-400",
      future: "text-cyan-400",
      purpose: "text-red-500",
      intelligence: "text-indigo-500",
      emotion: "text-pink-300",
      time: "text-purple-400",
      solitude: "text-gray-400",
      youth: "text-green-300",
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
                {currentQuote.category.replace("-", " ")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
