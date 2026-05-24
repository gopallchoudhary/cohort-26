import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Stopwatch } from './components/Stopwatch';
import { Timer } from './components/Timer';
import { audio } from './utils/audio';

function App() {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio state on mount
  useEffect(() => {
    setIsMuted(audio.isMuted());
  }, []);

  const handleToggleMute = () => {
    const nextState = !isMuted;
    audio.playClick();
    audio.setMuted(nextState);
    setIsMuted(nextState);
  };

  const handleTabChange = (tab: 'stopwatch' | 'timer') => {
    if (tab === activeTab) return;
    audio.playClick();
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 flex flex-col relative bg-grid-mesh">
      {/* Decorative Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" />

      {/* App Header */}
      <Header isMuted={isMuted} onToggleMute={handleToggleMute} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 relative">
        <div className="w-full max-w-xl flex flex-col items-center">
          
          {/* Sliding Tab Switcher */}
          <div className="glass-panel p-1 rounded-2xl flex items-center justify-between border border-white/5 shadow-2xl relative mb-12 select-none w-72 md:w-80">
            {/* Sliding Indicator Background */}
            <div 
              className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-md transition-all duration-300 ease-out z-0 w-[calc(50%-6px)] ${
                activeTab === 'timer' ? 'left-[calc(50%+2px)] shadow-indigo-500/20' : 'left-1 shadow-cyan-500/20'
              }`}
            />

            {/* Stopwatch Tab */}
            <button
              onClick={() => handleTabChange('stopwatch')}
              className={`flex-1 text-center py-3 rounded-xl font-sans font-bold text-xs tracking-wider transition-all duration-300 relative z-10 cursor-pointer ${
                activeTab === 'stopwatch' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              STOPWATCH
            </button>

            {/* Timer Tab */}
            <button
              onClick={() => handleTabChange('timer')}
              className={`flex-1 text-center py-3 rounded-xl font-sans font-bold text-xs tracking-wider transition-all duration-300 relative z-10 cursor-pointer ${
                activeTab === 'timer' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TIMER
            </button>
          </div>

          {/* Component Content panel */}
          <div className="w-full relative min-h-[460px] flex items-start justify-center">
            
            {/* 
              Mounting both components and toggling display classes.
              This allows both tools to maintain their states and tick accurately
              in the background even if the user switches tabs!
            */}
            <div className={activeTab === 'stopwatch' ? 'w-full block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}>
              <Stopwatch isActiveTab={activeTab === 'stopwatch'} />
            </div>

            <div className={activeTab === 'timer' ? 'w-full block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}>
              <Timer isActiveTab={activeTab === 'timer'} />
            </div>

          </div>

        </div>
      </main>

      {/* Subtle Footer branding */}
      <footer className="w-full text-center py-6 border-t border-white/5 bg-slate-950/20 backdrop-blur-md relative z-10">
        <p className="text-[10px] text-slate-500 tracking-widest font-mono">
          DESIGNED & SYNTHESIZED BY ANTIGRAVITY AI &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
