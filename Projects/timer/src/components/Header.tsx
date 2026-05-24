import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Keyboard, X, Clock, Zap } from 'lucide-react';
import { audio } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMuted, onToggleMute }) => {
  const [showKeybinds, setShowKeybinds] = useState(false);

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowKeybinds(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="w-full flex items-center justify-between py-5 px-6 border-b border-white/5 bg-slate-950/20 backdrop-blur-md relative z-30">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 group select-none">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-105">
          <Clock className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-1.5">
            AETHER<span className="text-cyan-400 font-extrabold text-[10px] tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">CHRONO</span>
          </h1>
          <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">Precision Time Suite</p>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-3">
        {/* Keybind Help Trigger */}
        <button
          onClick={() => {
            audio.playClick();
            setShowKeybinds(true);
          }}
          className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 active:scale-95 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Audio Mute Trigger */}
        <button
          onClick={onToggleMute}
          className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
            isMuted 
              ? 'border-rose-500/20 bg-rose-950/10 hover:bg-rose-950/20 text-rose-400' 
              : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showKeybinds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            onClick={() => setShowKeybinds(false)}
          />

          {/* Modal Content */}
          <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative z-10 transform scale-100 transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-md font-bold text-white tracking-wide">SYSTEM SHORTCUTS</h3>
              </div>
              <button 
                onClick={() => {
                  audio.playClick();
                  setShowKeybinds(false);
                }}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Control the active timer or stopwatch from anywhere on the application using these rapid hotkeys:
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Start / Pause Timer or Stopwatch</span>
                  <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200 shadow-md">SPACE</kbd>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Record Lap (Stopwatch only)</span>
                  <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200 shadow-md">L</kbd>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Reset Timer or Stopwatch</span>
                  <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200 shadow-md">R</kbd>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => {
                  audio.playClick();
                  setShowKeybinds(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
