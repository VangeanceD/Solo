"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, CheckCircle2, XCircle, ImageIcon, Type, ArrowDown, ArrowUp } from "lucide-react"
import type { Player, ActivityEvent } from "@/lib/player"

interface ActivitySummaryPageProps {
  player: Player
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function ActivitySummaryPage({ player }: ActivitySummaryPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const { events, earned, spent } = useMemo(() => {
    const evts = (player.activityLog || []).filter((e) => isSameDay(new Date(e.date), selectedDate))
    const earnedSum = evts.filter((e) => e.xpChange > 0).reduce((s, e) => s + e.xpChange, 0)
    const spentSum = evts.filter((e) => e.xpChange < 0).reduce((s, e) => s + Math.abs(e.xpChange), 0)
    return { events: evts.sort((a, b) => +new Date(b.date) - +new Date(a.date)), earned: earnedSum, spent: spentSum }
  }, [player.activityLog, selectedDate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">DAILY ACTIVITY</h1>
        <div className="flex items-center gap-3 text-white/70 font-electrolize">
          <CalendarDays className="w-5 h-5 text-primary/80" />
          <input
            type="date"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={(e) => {
              const d = new Date(e.target.value + "T00:00:00")
              setSelectedDate(d)
            }}
            className="bg-black/60 border border-primary/30 px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="holographic-ui">
          <CardContent className="p-6 text-center">
            <div className="text-white/70 text-sm mb-2 font-michroma">XP Earned</div>
            <div className="flex items-center justify-center gap-2">
              <ArrowUp className="w-5 h-5 text-green-400" />
              <div className="text-3xl font-orbitron text-green-400">{earned}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="holographic-ui">
          <CardContent className="p-6 text-center">
            <div className="text-white/70 text-sm mb-2 font-michroma">XP Spent/Penalties</div>
            <div className="flex items-center justify-center gap-2">
              <ArrowDown className="w-5 h-5 text-red-400" />
              <div className="text-3xl font-orbitron text-red-400">{spent}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="holographic-ui">
          <CardContent className="p-6 text-center">
            <div className="text-white/70 text-sm mb-2 font-michroma">Net</div>
            <div className="text-3xl font-orbitron text-primary">{earned - spent}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="holographic-ui">
        <CardContent className="p-0">
          <div className="holographic-header px-6 pt-6">Events</div>
          {events.length === 0 ? (
            <div className="p-6 text-center text-white/60 font-electrolize">No activity recorded for this day.</div>
          ) : (
            <ul className="divide-y divide-primary/20">
              {events.map((e) => (
                <li key={e.id} className="p-4 flex items-start justify-between hover:bg-primary/5">
                  <div className="flex items-start gap-3">
                    <EventIcon type={e.type} />
                    <div>
                      <div className="text-primary font-michroma text-sm">{e.title}</div>
                      <div className="text-white/60 text-xs font-electrolize">
                        {new Date(e.date).toLocaleTimeString()} • {e.type.replace("-", " ")}
                        {e.notes ? ` • ${e.notes}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className={`font-orbitron text-sm ${e.xpChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {e.xpChange >= 0 ? "+" : "-"}
                    {Math.abs(e.xpChange)} XP
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EventIcon({ type }: { type: ActivityEvent["type"] }) {
  const c = "w-5 h-5 mt-0.5"
  switch (type) {
    case "quest-completed":
    case "daily-completed":
      return <CheckCircle2 className={`${c} text-green-400`} />
    case "quest-skipped":
    case "daily-skipped":
      return <XCircle className={`${c} text-red-400`} />
    case "avatar-change":
      return <ImageIcon className={`${c} text-primary`} />
    case "title-change":
      return <Type className={`${c} text-purple-400`} />
    default:
      return <CalendarDays className={`${c} text-white/60`} />
  }
}
