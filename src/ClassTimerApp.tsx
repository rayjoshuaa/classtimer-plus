import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  Moon,
  Sun,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Check
} from 'lucide-react';

// --- Web Audio Gentle Chime Synthesizer (No external assets required) ---
class GentleChimePlayer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plays a soothing, 3-note ascending marimba/bell chord (F5 -> A5 -> C6)
  play() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [698.46, 880.0, 1046.5]; // F5, A5, C6
      const startTime = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm sine wave with subtle overtone decay
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + index * 0.22);

        // Gentle envelope: fast soft attack, smooth exponential decay
        const noteStart = startTime + index * 0.22;
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.28, noteStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 1.5);
      });
    } catch (e) {
      console.warn('Audio playback not permitted or supported yet:', e);
    }
  }
}

const chime = new GentleChimePlayer();

// --- Preset Durations (Minutes) ---
const PRESETS = [1, 2, 3, 5, 10, 15, 20, 25, 30];

// --- Types ---
type TimerState = 'green' | 'amber' | 'red' | 'completed' | 'overtime';

interface AppSettings {
  soundEnabled: boolean;
  overtimeEnabled: boolean;
  darkMode: boolean;
}

export default function ClassTimerApp() {
  // --- Persistent Storage State ---
  const [initialSeconds, setInitialSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('ct_initial_seconds');
    return saved ? Math.max(1, parseInt(saved, 10)) : 300; // default 5 minutes
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ct_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    return {
      soundEnabled: true,
      overtimeEnabled: true,
      darkMode: false,
    };
  });

  // --- Core Timer State ---
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activityTitle, setActivityTitle] = useState<string>('Silent Focused Work');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Custom Input Fields
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [customSeconds, setCustomSeconds] = useState<string>('');

  // Refs for Drift-Free Timing
  const containerRef = useRef<HTMLDivElement>(null);
  const targetEndTimeRef = useRef<number | null>(null);
  const timerFrameRef = useRef<number | null>(null);
  const hasChimedRef = useRef<boolean>(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ct_initial_seconds', initialSeconds.toString());
  }, [initialSeconds]);

  useEffect(() => {
    localStorage.setItem('ct_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Fullscreen event listener sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- Drift-Free Engine (Calculates remaining time using Date.now()) ---
  const step = useCallback(() => {
    if (!targetEndTimeRef.current) return;

    const now = Date.now();
    const diff = (targetEndTimeRef.current - now) / 1000;

    if (diff <= 0) {
      if (!hasChimedRef.current) {
        if (settings.soundEnabled) chime.play();
        hasChimedRef.current = true;
      }

      if (settings.overtimeEnabled) {
        // Count up into overtime (diff is negative)
        setRemainingSeconds(diff);
      } else {
        setRemainingSeconds(0);
        setIsRunning(false);
        targetEndTimeRef.current = null;
        return;
      }
    } else {
      setRemainingSeconds(diff);
    }

    timerFrameRef.current = requestAnimationFrame(step);
  }, [settings.soundEnabled, settings.overtimeEnabled]);

  useEffect(() => {
    if (isRunning) {
      timerFrameRef.current = requestAnimationFrame(step);
    } else {
      if (timerFrameRef.current) cancelAnimationFrame(timerFrameRef.current);
    }
    return () => {
      if (timerFrameRef.current) cancelAnimationFrame(timerFrameRef.current);
    };
  }, [isRunning, step]);

  // --- Primary Controls ---
  const handleStart = () => {
    if (remainingSeconds <= 0 && !settings.overtimeEnabled) {
      // If timer ended and no overtime, restart from initial
      targetEndTimeRef.current = Date.now() + initialSeconds * 1000;
      setRemainingSeconds(initialSeconds);
      hasChimedRef.current = false;
    } else {
      targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setRemainingSeconds(initialSeconds);
    hasChimedRef.current = false;
  };

  const adjustTime = (deltaSeconds: number) => {
    setRemainingSeconds((prev) => {
      const next = prev + deltaSeconds;
      if (isRunning && targetEndTimeRef.current) {
        targetEndTimeRef.current += deltaSeconds * 1000;
      }
      return next;
    });
  };

  const selectPreset = (minutes: number) => {
    const secs = minutes * 60;
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setInitialSeconds(secs);
    setRemainingSeconds(secs);
    hasChimedRef.current = false;
  };

  const handleSetCustomTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10) || 0;
    const secs = parseInt(customSeconds, 10) || 0;
    const total = mins * 60 + secs;

    if (total > 0) {
      setIsRunning(false);
      targetEndTimeRef.current = null;
      setInitialSeconds(total);
      setRemainingSeconds(total);
      hasChimedRef.current = false;
      setCustomMinutes('');
      setCustomSeconds('');
      setShowCustomInput(false);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  // --- Keyboard Shortcuts (Excludes active input fields) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;
      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => {
          if (prev) {
            targetEndTimeRef.current = null;
            return false;
          } else {
            if (remainingSeconds <= 0 && !settings.overtimeEnabled) {
              targetEndTimeRef.current = Date.now() + initialSeconds * 1000;
              setRemainingSeconds(initialSeconds);
              hasChimedRef.current = false;
            } else {
              targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;
            }
            return true;
          }
        });
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        adjustTime(60);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        adjustTime(-60);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleReset();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [remainingSeconds, initialSeconds, settings.overtimeEnabled]);

  // --- Status and Visual Calculations ---
  const isOvertime = remainingSeconds < 0;
  const ratio = initialSeconds > 0 ? Math.max(0, remainingSeconds / initialSeconds) : 0;

  let timerStatus: TimerState = 'green';
  let statusText = 'On track';
  let ringStrokeColor = '#22C55E'; // Emerald green
  let statusBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';

  if (isOvertime) {
    timerStatus = 'overtime';
    statusText = 'Overtime';
    ringStrokeColor = '#A855F7'; // Soft classroom purple
    statusBadgeBg = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
  } else if (remainingSeconds === 0) {
    timerStatus = 'completed';
    statusText = "Time's up!";
    ringStrokeColor = '#EF4444'; // Red
    statusBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse';
  } else if (ratio <= 0.2) {
    timerStatus = 'red';
    statusText = 'Almost done';
    ringStrokeColor = '#EF4444'; // Red
    statusBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  } else if (ratio <= 0.5) {
    timerStatus = 'amber';
    statusText = 'Halfway there';
    ringStrokeColor = '#F59E0B'; // Warm amber
    statusBadgeBg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  }

  // Formatting display time
  const formatTime = (secs: number) => {
    const isNeg = secs < 0;
    const absSeconds = Math.ceil(Math.abs(secs));

    const hours = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;

    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');

    if (hours > 0) {
      const hh = hours.toString().padStart(2, '0');
      return `${isNeg ? '+' : ''}${hh}:${mm}:${ss}`;
    }
    return `${isNeg ? '+' : ''}${mm}:${ss}`;
  };

  // SVG circular calculations
  const strokeWidth = isFullscreen ? 14 : 12;
  const radius = 175;
  const circumference = 2 * Math.PI * radius;
  // Progress goes from full circle (circumference) to 0, or stays full in overtime
  const strokeDashoffset = isOvertime ? 0 : circumference * (1 - ratio);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-sans select-none flex flex-col justify-between transition-colors duration-300 ${
        settings.darkMode
          ? 'bg-[#0B1120] text-slate-100'
          : 'bg-[#F8FAFC] text-[#172033]'
      } ${isFullscreen ? 'p-6 lg:p-10 justify-center' : 'p-4 sm:p-6 md:p-8'}`}
    >
      {/* ================= HEADER ================= */}
      <header
        className={`w-full max-w-5xl mx-auto flex items-center justify-between transition-all duration-300 ${
          isFullscreen ? 'opacity-20 hover:opacity-100 mb-2' : 'mb-6'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                ClassTimer<span className="text-indigo-600 font-extrabold">+</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800">
                Calm Edition
              </span>
            </div>
            {!isFullscreen && (
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                A little more time. A little less pressure.
              </p>
            )}
          </div>
        </div>

        {/* Global Controls & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Sound Toggle */}
          <button
            onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
            aria-label={settings.soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-slate-600 dark:text-slate-300"
            title={settings.soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
            aria-label="Toggle Dark Mode"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-slate-600 dark:text-slate-300"
          >
            {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Settings Drawer Toggle */}
          {!isFullscreen && (
            <button
              onClick={() => setShowSettingsDrawer((p) => !p)}
              aria-label="Open Settings"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-slate-600 dark:text-slate-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Classroom Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Classroom Mode'}
            className={`p-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all shadow-sm ${
              isFullscreen
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20'
            }`}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Classroom Mode'}</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN TIMER STAGE ================= */}
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center flex-1 my-auto">
        {/* Optional Editable Activity Title */}
        <div className="mb-4 text-center">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                maxLength={45}
                className="px-3 py-1 text-sm font-semibold text-center rounded-lg bg-white dark:bg-slate-800 border border-indigo-400 text-slate-800 dark:text-slate-100 outline-none shadow-sm"
              />
              <button
                onClick={() => setIsEditingTitle(false)}
                className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename classroom activity"
              className="group text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5 px-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <span>{activityTitle}</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">✎</span>
            </button>
          )}
        </div>

        {/* Circular Display Ring */}
        <div
          className={`relative flex items-center justify-center transition-transform duration-500 ${
            isFullscreen ? 'scale-110 sm:scale-125 lg:scale-135 my-4 sm:my-8' : 'my-2 sm:my-4'
          }`}
          style={{ width: 'min(78vw, 390px)', height: 'min(78vw, 390px)' }}
        >
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 400 400">
            {/* Background Track */}
            <circle
              cx="200"
              cy="200"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-slate-200/70 dark:text-slate-800/80 transition-colors duration-300"
            />
            {/* Smooth Dynamic Progress Ring */}
            <circle
              cx="200"
              cy="200"
              r={radius}
              stroke={ringStrokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Time & Traffic Status Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            {/* Main Countdown Display */}
            <div
              className={`font-mono font-bold tracking-tighter tabular-nums transition-colors duration-300 ${
                isOvertime
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-900 dark:text-white'
              }`}
              style={{
                fontSize: isFullscreen
                  ? 'clamp(3.8rem, 11vw, 5.5rem)'
                  : 'clamp(3rem, 9.5vw, 4.4rem)',
                lineHeight: 1,
              }}
            >
              {formatTime(remainingSeconds)}
            </div>

            {/* Traffic Light Status Label */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-300 ${statusBadgeBg}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ringStrokeColor }}
                />
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          {/* Minus 1 min */}
          <button
            onClick={() => adjustTime(-60)}
            disabled={remainingSeconds <= 60 && !settings.overtimeEnabled}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
            title="Subtract 1 minute (-)"
            aria-label="Subtract 1 minute"
          >
            <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Start / Pause */}
          {isRunning ? (
            <button
              onClick={handlePause}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-base sm:text-lg flex items-center gap-2.5 shadow-lg shadow-amber-500/25 transition-all"
              aria-label="Pause timer"
            >
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-base sm:text-lg flex items-center gap-2.5 shadow-lg shadow-indigo-600/30 transition-all"
              aria-label="Start timer"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              <span>Start</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
            title="Reset timer (R)"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Plus 1 min */}
          <button
            onClick={() => adjustTime(60)}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
            title="Add 1 minute (+)"
            aria-label="Add 1 minute"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </main>

      {/* ================= CONFIGURATION PANEL (Hidden in Fullscreen) ================= */}
      {!isFullscreen && (
        <section className="w-full max-w-2xl mx-auto mt-6 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Activity Presets
            </span>
            <button
              onClick={() => setShowCustomInput((prev) => !prev)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {showCustomInput ? 'Hide Custom' : 'Custom Duration'}
              {showCustomInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 sm:gap-2">
            {PRESETS.map((mins) => {
              const isSelected = initialSeconds === mins * 60;
              return (
                <button
                  key={mins}
                  onClick={() => selectPreset(mins)}
                  className={`py-2 px-1 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {mins}m
                </button>
              );
            })}
          </div>

          {/* Custom Time Form */}
          {showCustomInput && (
            <form onSubmit={handleSetCustomTimer} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="180"
                  placeholder="Min"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-16 px-2.5 py-1.5 rounded-xl text-center text-sm font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
                <span className="text-slate-400 text-sm font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Sec"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  className="w-16 px-2.5 py-1.5 rounded-xl text-center text-sm font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                Set Timer
              </button>
            </form>
          )}
        </section>
      )}

      {/* ================= SUBTLE KEYBOARD SHORTCUTS FOOTER ================= */}
      <footer className="mt-4 text-center">
        <p className="text-[11px] text-slate-400 dark:text-slate-600 hidden sm:inline-block">
          Keyboard Shortcuts: <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Space</kbd> Start/Pause •{' '}
          <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">+</kbd> /{' '}
          <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">-</kbd> 1 Min •{' '}
          <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">R</kbd> Reset •{' '}
          <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">F</kbd> Fullscreen
        </p>
      </footer>

      {/* ================= SETTINGS DRAWER / MODAL ================= */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" />
                ClassTimer Preferences
              </h3>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              {/* Gentle Chime Option */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Gentle Chime</p>
                  <p className="text-xs text-slate-400">Plays a calm 3-note chime when time expires</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !settings.soundEnabled;
                    setSettings((s) => ({ ...s, soundEnabled: next }));
                    if (next) chime.play();
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Overtime Counting */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Overtime Count-Up</p>
                  <p className="text-xs text-slate-400">Shows elapsed overtime (e.g. +01:24)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, overtimeEnabled: !s.overtimeEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.overtimeEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.overtimeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Chime Sound Test */}
              <div className="pt-2">
                <button
                  onClick={() => chime.play()}
                  className="w-full py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100/50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Test Classroom Chime
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold hover:opacity-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
