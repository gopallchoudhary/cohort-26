import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award } from 'lucide-react';
import { audio } from '../utils/audio';

interface Lap {
  index: number;
  overallTime: number; // overall ms
  splitTime: number;   // lap ms
}

interface StopwatchProps {
  isActiveTab: boolean;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ isActiveTab }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // milliseconds
  const [laps, setLaps] = useState<Lap[]>([]);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isActiveTab) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on Space
      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'KeyL' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        recordLap();
      } else if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActiveTab, isRunning, time, laps]);

  // Keep tracking when tab is active/inactive
  const updateTimer = () => {
    if (startTimeRef.current) {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      setTime(accumulatedTimeRef.current + elapsed);
    }
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);

  const toggleTimer = () => {
    audio.playClick();
    if (isRunning) {
      // Pause
      accumulatedTimeRef.current = time;
      setIsRunning(false);
    } else {
      // Start
      setIsRunning(true);
    }
  };

  const recordLap = () => {
    if (!isRunning && time === 0) return;
    
    audio.playTick();
    const lastLapTime = laps.length > 0 ? laps[0].overallTime : 0;
    const split = time - lastLapTime;
    const newLap: Lap = {
      index: laps.length + 1,
      overallTime: time,
      splitTime: split,
    };
    
    // Add to the front of list so it scrolls nicely
    setLaps((prevLaps) => [newLap, ...prevLaps]);
  };

  const resetTimer = () => {
    audio.playClick();
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
  };

  // Find fastest and slowest lap splitTimes (if laps > 1)
  const getMinMaxLaps = () => {
    if (laps.length <= 1) return { fastestIndex: -1, slowestIndex: -1 };
    
    let fastestIdx = -1;
    let slowestIdx = -1;
    let minVal = Infinity;
    let maxVal = -Infinity;

    laps.forEach((lap) => {
      if (lap.splitTime < minVal) {
        minVal = lap.splitTime;
        fastestIdx = lap.index;
      }
      if (lap.splitTime > maxVal) {
        maxVal = lap.splitTime;
        slowestIdx = lap.index;
      }
    });

    return { fastestIndex: fastestIdx, slowestIndex: slowestIdx };
  };

  const { fastestIndex, slowestIndex } = getMinMaxLaps();

  // Time Formatter
  const formatTime = (totalMs: number) => {
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      hoursStr: hours > 0 ? pad(hours) + ':' : '',
      minutesStr: pad(minutes),
      secondsStr: pad(seconds),
      msStr: pad(ms),
    };
  };

  const { hoursStr, minutesStr, secondsStr, msStr } = formatTime(time);

  // SVG parameters
  const angle = (time % 1000) * 0.36; // 360 degrees / 1000ms
  const cx = 100;
  const cy = 100;
  const needleLength = 76;
  const rad = ((angle - 90) * Math.PI) / 180;
  const needleX = cx + needleLength * Math.cos(rad);
  const needleY = cy + needleLength * Math.sin(rad);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Dial Area */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-8">
        {/* Glow behind the circle */}
        <div className={`absolute inset-4 rounded-full bg-cyan-500/5 blur-2xl transition-all duration-1000 ${
          isRunning ? 'scale-110 bg-cyan-500/10' : 'scale-95'
        }`} />

        {/* Circular SVG Watch Dial */}
        <svg 
          viewBox="0 0 200 200" 
          className={`w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 ${
            isRunning ? 'animate-pulse-cyan' : 'border-transparent'
          }`}
        >
          <defs>
            <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="rgba(15, 23, 42, 0.6)" />
              <stop offset="100%" stopColor="rgba(8, 10, 24, 0.9)" />
            </radialGradient>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Outer Case Ring */}
          <circle cx="100" cy="100" r="92" fill="url(#dialGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />

          {/* Dial Tick Marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const tickAngle = i * 6;
            const isMajor = i % 5 === 0;
            const tickLength = isMajor ? 7 : 4;
            const r1 = 86;
            const r2 = r1 - tickLength;
            const tickRad = ((tickAngle - 90) * Math.PI) / 180;
            const x1 = cx + r1 * Math.cos(tickRad);
            const y1 = cy + r1 * Math.sin(tickRad);
            const x2 = cx + r2 * Math.cos(tickRad);
            const y2 = cy + r2 * Math.sin(tickRad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={
                  isMajor 
                    ? 'rgba(6, 182, 212, 0.45)' 
                    : isRunning && Math.floor((time % 1000) / 16.66) === i
                      ? 'rgba(6, 182, 212, 0.9)'
                      : 'rgba(255, 255, 255, 0.1)'
                }
                strokeWidth={isMajor ? 1.5 : 1}
                className="transition-colors duration-100"
              />
            );
          })}

          {/* Sweeping Mechanical Hand */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="url(#neonGlow)"
            strokeWidth="2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(6,182,212,0.6)]"
          />

          {/* Sweeping Tail */}
          <line
            x1={cx}
            y1={cy}
            x2={cx - 12 * Math.cos(rad)}
            y2={cy - 12 * Math.sin(rad)}
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Center Hub */}
          <circle cx="100" cy="100" r="5" fill="#0891b2" className="shadow-lg" />
          <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
        </svg>

        {/* Digital Readout Center overlay */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none mt-20">
          <div className="font-digital font-bold text-slate-100/90 text-sm tracking-widest bg-cyan-950/20 px-3 py-1 rounded-full border border-cyan-500/10">
            STOPWATCH
          </div>
        </div>
      </div>

      {/* Numerical Time Display */}
      <div className="flex flex-col items-center mb-10 w-full max-w-sm">
        <div className="font-digital text-6xl md:text-7xl font-bold tracking-tight text-white flex items-baseline drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          {hoursStr && <span className="text-slate-400 font-medium text-4xl md:text-5xl mr-1">{hoursStr}</span>}
          <span>{minutesStr}</span>
          <span className="text-cyan-500/80 animate-pulse mx-0.5">:</span>
          <span>{secondsStr}</span>
          <span className="text-cyan-400/60 font-semibold text-3xl md:text-4xl ml-2">.{msStr}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-10">
        {/* Lap Button */}
        <button
          onClick={recordLap}
          disabled={!isRunning && time === 0}
          className="px-6 py-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-slate-100 disabled:opacity-20 disabled:hover:bg-white/[0.02] disabled:hover:text-slate-300 transition-all font-semibold tracking-wider text-xs active:scale-95 cursor-pointer flex items-center gap-2"
        >
          LAP
        </button>

        {/* Start / Pause Button */}
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white'
              : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetTimer}
          disabled={!isRunning && time === 0}
          className="px-6 py-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-rose-400 disabled:opacity-20 disabled:hover:bg-white/[0.02] disabled:hover:text-slate-300 transition-all font-semibold tracking-wider text-xs active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RESET
        </button>
      </div>

      {/* Lap Times Panel */}
      {laps.length > 0 && (
        <div className="w-full max-w-md glass-panel rounded-2xl p-5 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
            <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">LAP ARCHIVE</h4>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-md border border-slate-700 font-mono">
              TOTAL LAPS: {laps.length}
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {laps.map((lap, index) => {
              const isBest = lap.index === fastestIndex;
              const isWorst = lap.index === slowestIndex;
              
              // Calculate Delta to previous lap (lap splits are in lap.splitTime)
              // Since laps array is sorted by lap number descending, the previous lap is in the index + 1 slot
              let deltaStr = '';
              let isDeltaPositive = false;
              if (index < laps.length - 1) {
                const prevSplit = laps[index + 1].splitTime;
                const diff = lap.splitTime - prevSplit;
                const diffSecs = (diff / 1000).toFixed(2);
                if (diff > 0) {
                  deltaStr = `+${diffSecs}s`;
                  isDeltaPositive = true;
                } else if (diff < 0) {
                  deltaStr = `${diffSecs}s`;
                  isDeltaPositive = false;
                } else {
                  deltaStr = '0.00s';
                }
              }

              const splitFormatted = formatTime(lap.splitTime);
              const overallFormatted = formatTime(lap.overallTime);

              return (
                <div
                  key={lap.index}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                    isBest
                      ? 'border-emerald-500/20 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                      : isWorst
                      ? 'border-rose-500/20 bg-rose-950/10'
                      : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      #{String(lap.index).padStart(2, '0')}
                    </span>
                    {isBest && (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Award className="w-2.5 h-2.5" /> Best
                      </span>
                    )}
                    {isWorst && (
                      <span className="text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">
                        Slowest
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Lap Split Time */}
                    <div className="text-right">
                      <div className="font-digital text-sm font-bold text-slate-200">
                        {splitFormatted.minutesStr}:{splitFormatted.secondsStr}.{splitFormatted.msStr}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">SPLIT</div>
                    </div>

                    {/* Overall Time */}
                    <div className="text-right w-24">
                      <div className="font-digital text-sm font-semibold text-slate-400">
                        {overallFormatted.minutesStr}:{overallFormatted.secondsStr}.{overallFormatted.msStr}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">OVERALL</div>
                    </div>

                    {/* Delta Offset */}
                    <div className="text-right w-16">
                      {deltaStr ? (
                        <div className={`text-[10px] font-mono font-bold ${
                          isDeltaPositive ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {deltaStr}
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-600">-</div>
                      )}
                      <div className="text-[10px] font-mono text-slate-500">DELTA</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
