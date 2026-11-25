import { useCallback, useEffect, useRef, useState } from "react"
import { Info, Maximize, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const PRESETS = [1, 2, 3, 5, 10, 15, 20, 30]

function fmt(s: number) {
  const t = Math.max(0, Math.round(s))
  const m = Math.floor(t / 60)
  const ss = t % 60
  return `${m < 10 ? "0" : ""}${m}:${ss < 10 ? "0" : ""}${ss}`
}

function initialTotal() {
  try {
    const saved = parseInt(localStorage.getItem("classtimer_total") || "", 10)
    if (saved > 0 && saved <= 5999) return saved
  } catch {
    /* storage unavailable */
  }
  return 300
}

export default function App() {
  const [total, setTotalState] = useState<number>(initialTotal)
  const [remaining, setRemaining] = useState<number>(initialTotal)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [overtimeOn, setOvertimeOn] = useState(true)
  const [customMin, setCustomMin] = useState("")
  const [customSec, setCustomSec] = useState("")
  const [feedback, setFeedback] = useState("")

  const endAtRef = useRef(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const minInputRef = useRef<HTMLInputElement>(null)
  const runningRef = useRef(false)
  const finishedRef = useRef(false)
  const overtimeRef = useRef(true)
  const soundRef = useRef(true)
  const totalRef = useRef(total)
  totalRef.current = total
  overtimeRef.current = overtimeOn
  soundRef.current = soundOn

  const warmAudio = useCallback(() => {
    try {
      audioRef.current =
        audioRef.current ||
        new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)()
      if (audioRef.current.state === "suspended") void audioRef.current.resume()
    } catch {
      /* audio unavailable */
    }
  }, [])

  const chime = useCallback(() => {
    if (!soundRef.current) return
    warmAudio()
    const ctx = audioRef.current
    if (!ctx) return
    try {
      ;[523.25, 659.25, 783.99].forEach((freq, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = "sine"
        o.frequency.value = freq
        const t = ctx.currentTime + i * 0.22
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.03)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
        o.connect(g)
        g.connect(ctx.destination)
        o.start(t)
        o.stop(t + 1)
      })
    } catch {
      /* audio unavailable */
    }
  }, [warmAudio])

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  const pause = useCallback(() => {
    runningRef.current = false
    setRunning(false)
    stopTick()
  }, [stopTick])

  const setTotal = useCallback(
    (sec: number) => {
      const clamped = Math.max(1, Math.min(5999, Math.round(sec)))
      pause()
      finishedRef.current = false
      setFinished(false)
      setTotalState(clamped)
      totalRef.current = clamped
      setRemaining(clamped)
      setFeedback("")
      try {
        localStorage.setItem("classtimer_total", String(clamped))
      } catch {
        /* storage unavailable */
      }
    },
    [pause]
  )

  const start = useCallback(() => {
    if (runningRef.current) return
    warmAudio()
    let rem = remaining
    if (finishedRef.current || rem <= 0) {
      finishedRef.current = false
      setFinished(false)
      rem = totalRef.current
      setRemaining(rem)
    }
    setFeedback("")
    runningRef.current = true
    setRunning(true)
    endAtRef.current = Date.now() + rem * 1000
    stopTick()
    tickRef.current = setInterval(() => {
      const left = (endAtRef.current - Date.now()) / 1000
      if (left <= 0 && !finishedRef.current) {
        finishedRef.current = true
        setFinished(true)
        chime()
        if (!overtimeRef.current) {
          setRemaining(0)
          runningRef.current = false
          setRunning(false)
          stopTick()
          return
        }
      }
      setRemaining(left)
    }, 100)
  }, [remaining, chime, stopTick, warmAudio])

  const toggleStartPause = useCallback(() => {
    if (runningRef.current) pause()
    else start()
  }, [pause, start])

  const addMinute = useCallback(() => {
    setFeedback("")
    if (finishedRef.current) {
      finishedRef.current = false
      setFinished(false)
    }
    const next = remaining + 60
    setRemaining(next)
    if (next > totalRef.current) {
      setTotalState(next)
      totalRef.current = next
    }
    if (runningRef.current) endAtRef.current += 60000
  }, [remaining])

  const minusMinute = useCallback(() => {
    if (finishedRef.current) return
    setFeedback("")
    // Untouched timer (not running, remaining === total): shrink the total,
    // exactly as v1.9.1 did.
    if (!running && remaining === total) {
      if (total > 60) setTotal(total - 60)
      return
    }
    setRemaining(Math.max(1, remaining - 60))
    if (runningRef.current) endAtRef.current -= 60000
  }, [finished, running, remaining, total, setTotal])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (document.documentElement.requestFullscreen)
      void document.documentElement.requestFullscreen()
  }, [])

  const applyCustom = useCallback(() => {
    const m = parseInt(customMin || "0", 10) || 0
    const s = parseInt(customSec || "0", 10) || 0
    const tot = m * 60 + s
    if (tot > 0) {
      setTotal(tot)
      setCustomMin("")
      setCustomSec("")
    } else {
      setFeedback("Enter minutes or seconds first")
      minInputRef.current?.focus()
    }
  }, [customMin, customSec, setTotal])

  // Keyboard shortcuts — same guards as v1.9.1: inert while typing in an
  // input, and Space never double-fires from a focused button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT") return
      if (e.code === "Space") {
        if (target.closest && target.closest("button")) return
        e.preventDefault()
        toggleStartPause()
      } else if (e.key === "-" || e.key === "_") minusMinute()
      else if (e.key === "+" || e.key === "=") addMinute()
      else if (e.key === "r" || e.key === "R") setTotal(totalRef.current)
      else if (e.key === "f" || e.key === "F") toggleFullscreen()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [toggleStartPause, minusMinute, addMinute, setTotal, toggleFullscreen])

  useEffect(() => stopTick, [stopTick])

  // Derived display state
  const frac = total > 0 ? remaining / total : 0
  const stage: "green" | "amber" | "red" = finished
    ? "red"
    : frac > 0.5
      ? "green"
      : frac > 0.2
        ? "amber"
        : "red"
  const stageLabel = finished
    ? "Time's up"
    : running
      ? stage === "green"
        ? "On track"
        : stage === "amber"
          ? "Halfway there"
          : "Almost done"
      : remaining === total
        ? "Ready"
        : "Paused"
  const display =
    finished && overtimeOn ? `+${fmt(-remaining)}` : finished ? "00:00" : fmt(remaining)
  const derivedFeedback = finished
    ? overtimeOn
      ? "Overtime — wrap up and finish up"
      : ""
    : running
      ? ""
      : remaining === total
        ? ""
        : "Paused — press Start to continue"
  const shownFeedback = feedback || derivedFeedback
  const badgeVariant =
    stageLabel === "Time's up" || stageLabel === "Almost done"
      ? "destructive"
      : stageLabel === "Halfway there" || stageLabel === "Paused"
        ? "secondary"
        : stageLabel === "Ready"
          ? "outline"
          : "default"
  const progressValue = finished ? 0 : Math.max(0, Math.min(100, frac * 100))
  const timerActive = running || finished || remaining < total

  useEffect(() => {
    document.title = timerActive
      ? `ClassTimer+ | ${display}`
      : "Teacher Tools: ClassTimer+"
  }, [timerActive, display])

  const startLabel = running ? "Pause" : remaining < total && !finished ? "Resume" : "Start"
  const presetValue = PRESETS.includes(total / 60) ? String(total / 60) : ""

  return (
    <TooltipProvider>
      <div className="flex h-svh flex-col items-center overflow-hidden bg-background px-4 py-4 text-foreground">
        <header className="flex w-full max-w-4xl shrink-0 flex-col items-center gap-1 text-center">
          <Badge variant="secondary">Teacher Tools</Badge>
          <h1 className="text-3xl font-bold tracking-tight">ClassTimer+</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            The calm countdown timer for your classroom screen — time the whole
            class can see, without the alarm-clock stress.
          </p>
        </header>

        <main className="flex w-full min-h-0 flex-1 justify-center pt-4">
          <Card className="flex h-full w-full max-w-4xl flex-col gap-3 py-4">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <CardTitle>Countdown</CardTitle>
                  <CardDescription>
                    Pick a preset or set a custom time, then press Start.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="How to use ClassTimer+">
                        <Info />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>How to use</DialogTitle>
                        <DialogDescription>
                          ClassTimer+ in four steps.
                        </DialogDescription>
                      </DialogHeader>
                      <ol className="list-decimal space-y-2 pl-5 text-sm">
                        <li>Pick a preset, or type a custom time and press Set.</li>
                        <li>
                          Press Start. The stage badge changes as time runs down —
                          on track, then halfway, then almost done.
                        </li>
                        <li>
                          Use − 1 min / + 1 min to adjust, even while the timer is
                          running.
                        </li>
                        <li>
                          At zero the chime sounds. If overtime is on, the timer
                          keeps counting up so you can wrap up calmly.
                        </li>
                      </ol>
                      <Separator />
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Kbd>Space</Kbd> Start / pause
                        </span>
                        <span className="flex items-center gap-2">
                          <Kbd>−</Kbd> <Kbd>+</Kbd> One minute
                        </span>
                        <span className="flex items-center gap-2">
                          <Kbd>R</Kbd> Reset
                        </span>
                        <span className="flex items-center gap-2">
                          <Kbd>F</Kbd> Fullscreen
                        </span>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFullscreen}
                        aria-label="Fullscreen"
                      >
                        <Maximize />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fullscreen</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-between gap-3">
              <Badge variant={badgeVariant}>{stageLabel}</Badge>

              <div className="text-[clamp(4.5rem,19vh,12rem)] leading-none font-bold tabular-nums tracking-tight">
                {display}
              </div>

              <p className="flex h-5 items-center text-sm text-muted-foreground">
                {shownFeedback}
              </p>
              <div className="sr-only" aria-live="polite">
                {stageLabel}, {display}
              </div>

              <Progress value={progressValue} className="h-3 w-full" aria-label="Time remaining" />

              <Separator />

              <div className="flex w-full flex-col items-center gap-3">
                <Label>Time</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="flex-wrap justify-center"
                  value={presetValue}
                  onValueChange={(value) => {
                    if (value) setTotal(parseInt(value, 10) * 60)
                  }}
                  aria-label="Preset times"
                >
                  {PRESETS.map((min) => (
                    <ToggleGroupItem key={min} value={String(min)} className="px-4 py-2">
                      {min} min
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>

                <div className="flex flex-wrap items-end justify-center gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="custom-min">Custom minutes</Label>
                    <Input
                      id="custom-min"
                      ref={minInputRef}
                      type="number"
                      min={0}
                      max={999}
                      placeholder="min"
                      inputMode="numeric"
                      value={customMin}
                      onChange={(e) => setCustomMin(e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="custom-sec">Custom seconds</Label>
                    <Input
                      id="custom-sec"
                      type="number"
                      min={0}
                      max={59}
                      placeholder="sec"
                      inputMode="numeric"
                      value={customSec}
                      onChange={(e) => setCustomSec(e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                  <Button variant="secondary" onClick={applyCustom}>
                    Set
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col items-center gap-3">
                <Label>Adjust</Label>
                <ButtonGroup>
                  <Button variant="outline" onClick={minusMinute} title="Take away one minute">
                    <Minus /> 1 min
                  </Button>
                  <Button variant="outline" onClick={addMinute} title="Add one minute">
                    <Plus /> 1 min
                  </Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" onClick={toggleStartPause}>
                  {running ? <Pause /> : <Play />}
                  {startLabel}
                </Button>
                <Button size="lg" variant="outline" onClick={() => setTotal(total)}>
                  <RotateCcw /> Reset
                </Button>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="sound" checked={soundOn} onCheckedChange={setSoundOn} />
                  <Label htmlFor="sound">Gentle chime at zero</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="overtime" checked={overtimeOn} onCheckedChange={setOvertimeOn} />
                  <Label htmlFor="overtime">Count overtime after zero</Label>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Kbd>Space</Kbd> Start / pause
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>−</Kbd> <Kbd>+</Kbd> One minute
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>R</Kbd> Reset
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>F</Kbd> Fullscreen
                </span>
              </div>
            </CardFooter>
          </Card>
        </main>

        <footer className="shrink-0 pt-3 text-center text-xs text-muted-foreground">
          © 2026{" "}
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
            <a href="https://rayjoshuaa-portfolio.pages.dev" target="_blank" rel="noopener noreferrer">
              Ray Joshua
            </a>
          </Button>
          . All rights reserved.
        </footer>
      </div>
    </TooltipProvider>
  )
}
