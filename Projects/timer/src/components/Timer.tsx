import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, ChevronUp, ChevronDown } from 'lucide-react';
import { audio } from '../utils/audio';

interface Preset {
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
}

const PRESETS: Preset[] = [
  { label: 'POMODORO', hours: 0, minutes: 25, seconds: 0 },
  { label: 'SHORT BREAK', hours: 0, minutes: 5, seconds: 0 },
  { label: 'LONG BREAK', hours: 0, minutes: 15, seconds: 0 },
  { label: 'TABATA', hours: 0, minutes: 0, seconds: 30 },
  { label: '1 MIN', hours: 0, minutes: 1, seconds: 0 },
  { label: '5 MIN', hours: 0, minutes: 5, seconds: 0 },
];

interface TimerProps {
  isActiveTab: boolean;
}

export const Timer: React.FC<TimerProps> = ({ isActiveTab }) => {
  // Input settings
  const [inputHours, setInputHours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(5); // default 5 mins
  const [inputSeconds, setInputSeconds] = useState(0);

  // Active state
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // seconds
  const [totalDuration, setTotalDuration] = useState(300); // seconds for progress bar

  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);
  const timeLeftOnPauseRef = useRef<number>(300);

  // Request notifications permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isActiveTab) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on Space
      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActiveTab, isRunning, timeLeft, isFinished, totalDuration]);

  // Main countdown ticking handler
  const tick = () => {
    const now = performance.now();
    const remainingMs = endTimeRef.current - now;
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

    // Play critical tick for final 5 seconds
    if (remainingSeconds > 0 && remainingSeconds <= 5 && remainingSeconds !== timeLeft) {
      audio.playTick();
    }

    if (remainingMs <= 0) {
      // Expired!
      handleExpiry();
    } else {
      setTimeLeft(remainingSeconds);
      intervalRef.current = requestAnimationFrame(tick);
    }
  };

  const handleExpiry = () => {
    setIsRunning(false);
    setIsFinished(true);
    setTimeLeft(0);
    audio.playAlarm();

    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }

    // Trigger push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('AetherChrono Alert', {
        body: 'Your countdown timer has expired!',
        tag: 'aetherchrono-timer-expired',
      });
    }
  };

  useEffect(() => {
    if (isRunning) {
      endTimeRef.current = performance.now() + timeLeft * 1000;
      intervalRef.current = requestAnimationFrame(tick);
    } else {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleTimer = () => {
    audio.playClick();
    if (isFinished) {
      // Dismiss finished state and restart setup
      dismissAlarm();
      return;
    }

    if (isRunning) {
      // Pause
      timeLeftOnPauseRef.current = timeLeft;
      setIsRunning(false);
    } else {
      // Start
      const targetDuration = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
      if (targetDuration <= 0 && timeLeft === 0) return;

      if (timeLeft === 0 || timeLeft === totalDuration) {
        // If loaded a brand new duration
        if (targetDuration > 0) {
          setTimeLeft(targetDuration);
          setTotalDuration(targetDuration);
          timeLeftOnPauseRef.current = targetDuration;
        } else {
          return; // nothing to count down
        }
      }
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    audio.playClick();
    audio.stopAlarm();
    setIsRunning(false);
    setIsFinished(false);
    
    const targetDuration = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
    setTimeLeft(targetDuration > 0 ? targetDuration : 300);
    setTotalDuration(targetDuration > 0 ? targetDuration : 300);
    timeLeftOnPauseRef.current = targetDuration > 0 ? targetDuration : 300;
  };

  const dismissAlarm = () => {
    audio.playClick();
    audio.stopAlarm();
    setIsFinished(false);
    resetTimer();
  };

  const selectPreset = (preset: Preset) => {
    audio.playClick();
    audio.stopAlarm();
    setIsRunning(false);
    setIsFinished(false);

    setInputHours(preset.hours);
    setInputMinutes(preset.minutes);
    setInputSeconds(preset.seconds);

    const secondsTotal = preset.hours * 3600 + preset.minutes * 60 + preset.seconds;
    setTimeLeft(secondsTotal);
    setTotalDuration(secondsTotal);
    timeLeftOnPauseRef.current = secondsTotal;
  };

  // Input spinners helper
  const adjustInput = (field: 'h' | 'm' | 's', increment: boolean) => {
    audio.playTick();
    if (field === 'h') {
      setInputHours((prev) => {
        const next = increment ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(99, next));
      });
    } else if (field === 'm') {
      setInputMinutes((prev) => {
        const next = increment ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(59, next));
      });
    } else if (field === 's') {
      setInputSeconds((prev) => {
        const next = increment ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(59, next));
      });
    }
  };

  // Sync inputs on blur / input change
  const handleInputChange = (field: 'h' | 'm' | 's', val: number) => {
    const cleanVal = isNaN(val) ? 0 : Math.max(0, val);
    if (field === 'h') setInputHours(Math.min(99, cleanVal));
    if (field === 'm') setInputMinutes(Math.min(59, cleanVal));
    if (field === 's') setInputSeconds(Math.min(59, cleanVal));
  };

  // Time Formatter
  const formatTimeSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      hoursStr: hours > 0 ? pad(hours) + ':' : '',
      minutesStr: pad(minutes),
      secondsStr: pad(seconds),
    };
  };

  const { hoursStr, minutesStr, secondsStr } = formatTimeSeconds(timeLeft);

  // SVG parameters
  const strokeRadius = 80;
  const perimeter = 2 * Math.PI * strokeRadius;
  const progress = totalDuration > 0 ? timeLeft / totalDuration : 1;
  const strokeDashoffset = perimeter - perimeter * progress;

  const isLowTime = timeLeft <= 10 && totalDuration > 10 && timeLeft > 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Ring and readout */}
      <div className={`relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-8 rounded-full transition-all duration-500 ${
        isFinished 
          ? 'animate-flash-red' 
          : isLowTime 
          ? 'bg-rose-500/5' 
          : 'bg-transparent'
      }`}>
        
        {/* SVG Radial Countdown Meter */}
        <svg 
          viewBox="0 0 200 200" 
          className={`w-full h-full drop-shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all duration-300 ${
            isFinished
              ? 'animate-pulse-rose'
              : isRunning
              ? isLowTime
                ? 'animate-pulse-rose'
                : 'animate-pulse-cyan'
              : ''
          }`}
        >
          <defs>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Underlay Track */}
          <circle 
            cx="100" 
            cy="100" 
            r={strokeRadius} 
            fill="rgba(15, 23, 42, 0.45)" 
            stroke="rgba(255, 255, 255, 0.05)" 
            strokeWidth="8" 
          />

          {/* Progress Path */}
          <circle 
            cx="100" 
            cy="100" 
            r={strokeRadius} 
            fill="none" 
            stroke={isLowTime || isFinished ? 'url(#roseGradient)' : 'url(#cyanGradient)'} 
            strokeWidth="8" 
            strokeDasharray={perimeter}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            className="transition-all duration-100 ease-linear drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]"
          />

          {/* Micro dots or ticks inside the ring */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const r = strokeRadius - 10;
            const x = 100 + r * Math.cos(rad);
            const y = 100 + r * Math.sin(rad);

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill={
                  isFinished
                    ? 'rgba(244, 63, 94, 0.6)'
                    : progress * 12 > i
                    ? 'rgba(6, 182, 212, 0.4)'
                    : 'rgba(255, 255, 255, 0.15)'
                }
                className="transition-colors duration-300"
              />
            );
          })}
        </svg>

        {/* Central Overlay Card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 select-none">
          {isFinished ? (
            <div className="flex flex-col items-center animate-bounce">
              <Bell className="w-10 h-10 text-rose-500 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
              <span className="font-sans font-black text-rose-400 text-xs tracking-widest mt-2 uppercase">TIME EXPIRED</span>
            </div>
          ) : isRunning || timeLeft !== totalDuration ? (
            // Running / Paused Digital display
            <div className="text-center">
              <div className="font-digital text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                {hoursStr && <span className="text-slate-400 text-2xl md:text-3xl font-medium">{hoursStr}</span>}
                <span>{minutesStr}</span>
                <span className={`${isLowTime ? 'text-rose-500' : 'text-cyan-500/80'} animate-pulse mx-0.5`}>:</span>
                <span>{secondsStr}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 tracking-wider mt-1.5 uppercase font-sans">
                {isRunning ? 'COUNTDOWN' : 'PAUSED'}
              </div>
            </div>
          ) : (
            // Edit Mode dials/pickers
            <div className="flex items-center gap-1">
              {/* Hours Dial */}
              <div className="flex flex-col items-center">
                <button onClick={() => adjustInput('h', true)} className="text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  maxLength={2}
                  value={String(inputHours).padStart(2, '0')}
                  onChange={(e) => handleInputChange('h', parseInt(e.target.value, 10))}
                  onBlur={() => {
                    const totalSecs = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
                    setTimeLeft(totalSecs);
                    setTotalDuration(totalSecs);
                  }}
                  className="w-10 text-center font-digital font-bold text-2xl bg-white/[0.03] border border-white/5 rounded-lg py-1 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                />
                <button onClick={() => adjustInput('h', false)} className="text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <span className="text-[8px] font-sans text-slate-500 font-bold uppercase mt-1">HR</span>
              </div>

              <span className="text-slate-600 font-digital text-2xl mt-[-10px]">:</span>

              {/* Minutes Dial */}
              <div className="flex flex-col items-center">
                <button onClick={() => adjustInput('m', true)} className="text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  maxLength={2}
                  value={String(inputMinutes).padStart(2, '0')}
                  onChange={(e) => handleInputChange('m', parseInt(e.target.value, 10))}
                  onBlur={() => {
                    const totalSecs = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
                    setTimeLeft(totalSecs);
                    setTotalDuration(totalSecs);
                  }}
                  className="w-10 text-center font-digital font-bold text-2xl bg-white/[0.03] border border-white/5 rounded-lg py-1 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                />
                <button onClick={() => adjustInput('m', false)} className="text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <span className="text-[8px] font-sans text-slate-500 font-bold uppercase mt-1">MIN</span>
              </div>

              <span className="text-slate-600 font-digital text-2xl mt-[-10px]">:</span>

              {/* Seconds Dial */}
              <div className="flex flex-col items-center">
                <button onClick={() => adjustInput('s', true)} className="text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  maxLength={2}
                  value={String(inputSeconds).padStart(2, '0')}
                  onChange={(e) => handleInputChange('s', parseInt(e.target.value, 10))}
                  onBlur={() => {
                    const totalSecs = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
                    setTimeLeft(totalSecs);
                    setTotalDuration(totalSecs);
                  }}
                  className="w-10 text-center font-digital font-bold text-2xl bg-white/[0.03] border border-white/5 rounded-lg py-1 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                />
                <button onClick={() => adjustInput('s', false)} className="text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <span className="text-[8px] font-sans text-slate-500 font-bold uppercase mt-1">SEC</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main control panel */}
      <div className="flex items-center gap-4 mb-8">
        {/* Reset / Dismiss */}
        {isFinished ? (
          <button
            onClick={dismissAlarm}
            className="px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-wider text-xs active:scale-95 transition-all cursor-pointer shadow-lg shadow-rose-500/20 w-48"
          >
            DISMISS ALARM
          </button>
        ) : (
          <>
            <button
              onClick={resetTimer}
              disabled={timeLeft === 0 || (!isRunning && timeLeft === totalDuration)}
              className="px-6 py-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-rose-400 disabled:opacity-20 disabled:hover:bg-white/[0.02] disabled:hover:text-slate-300 transition-all font-semibold tracking-wider text-xs active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET
            </button>

            {/* Start / Pause */}
            <button
              onClick={toggleTimer}
              disabled={inputHours === 0 && inputMinutes === 0 && inputSeconds === 0 && timeLeft === 0}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:scale-100 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white'
                  : isLowTime
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 text-white animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
          </>
        )}
      </div>

      {/* Preset configurations */}
      {!isRunning && !isFinished && timeLeft === totalDuration && (
        <div className="w-full max-w-md glass-panel rounded-2xl p-5 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
            <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">TIMER PRESETS</h4>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider">QUICK SETUP</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => selectPreset(preset)}
                className="py-3 px-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold font-mono tracking-wider active:scale-95 cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span>{preset.label}</span>
                <span className="text-[10px] text-cyan-400/80 font-normal">
                  {preset.hours > 0 ? `${preset.hours}h ` : ''}
                  {preset.minutes > 0 ? `${preset.minutes}m ` : ''}
                  {preset.seconds > 0 ? `${preset.seconds}s` : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
