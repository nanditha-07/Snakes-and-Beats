import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    setHighScore((prev) => (newScore > prev ? newScore : prev));
  };

  return (
    <div className="h-screen bg-[#050505] text-zinc-100 font-sans p-4 md:p-8 flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Synth<span className="text-cyan-400">Snake</span></h1>
        </div>
        <div className="flex gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Session Score</span>
            <span className="text-2xl md:text-3xl font-mono text-lime-400 leading-none tracking-tighter">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">High Score</span>
            <span className="text-2xl md:text-3xl font-mono text-fuchsia-500 leading-none tracking-tighter">{highScore.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow min-h-0 overflow-y-auto md:overflow-visible">
        
        {/* Left Column - Music Player */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
          <MusicPlayer />
        </div>

        {/* Center Column - Game */}
        <div className="col-span-1 md:col-span-6 flex flex-col min-h-[400px]">
          <div className="bg-black border-2 border-zinc-800 rounded-3xl p-4 flex-grow shadow-[0_0_50px_rgba(0,0,0,1)] relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-4 grid grid-cols-20 grid-rows-20 gap-px opacity-10 pointer-events-none">
               <div className="col-span-20 row-span-20 border border-zinc-700 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             </div>
             
             <div className="w-full h-full relative z-10 flex items-center justify-center">
               <SnakeGame onScoreChange={handleScoreChange} />
             </div>

             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none opacity-50 hidden md:flex">
               <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                 Use Arrow Keys to Move
               </div>
             </div>
          </div>
        </div>

        {/* Right Column - System Status */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shrink-0">
             <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">System Status</h2>
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                    <span>Snake Speed</span>
                    <span className="text-cyan-400">Level 04</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full">
                    <div className="h-full bg-cyan-500 w-1/3"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
                    <p className="text-xl font-mono text-fuchsia-400">{Math.floor(score / 10).toString()}</p>
                    <p className="text-[8px] uppercase text-zinc-500 font-bold mt-1">Apples Eaten</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
                    <p className="text-xl font-mono text-cyan-400">--:--</p>
                    <p className="text-[8px] uppercase text-zinc-500 font-bold mt-1">Play Time</p>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex-grow flex flex-col min-h-[150px]">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Visualizer</h2>
            <div className="flex-grow flex items-end justify-between gap-1">
              <div className="flex-grow bg-cyan-400/20 h-[40%] border-t border-cyan-400 shadow-[0_-5px_10px_rgba(34,211,238,0.2)]"></div>
              <div className="flex-grow bg-fuchsia-400/20 h-[75%] border-t border-fuchsia-400"></div>
              <div className="flex-grow bg-cyan-400/20 h-[25%] border-t border-cyan-400"></div>
              <div className="flex-grow bg-fuchsia-400/20 h-[60%] border-t border-fuchsia-400"></div>
              <div className="flex-grow bg-cyan-400/20 h-[100%] border-t border-cyan-400 mix-blend-screen shadow-[0_-5px_15px_rgba(34,211,238,0.3)]"></div>
              <div className="flex-grow bg-fuchsia-400/20 h-[30%] border-t border-fuchsia-400"></div>
              <div className="flex-grow bg-cyan-400/20 h-[50%] border-t border-cyan-400"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest border-t border-zinc-800 pt-4 shrink-0 px-2 md:px-0">
        <div className="flex gap-2 md:gap-4 items-center">
          <span>Ver 1.0.4-β</span>
          <span className="text-zinc-800 hidden md:inline">|</span>
          <span className="text-cyan-900 hidden md:inline">Active Connection: Secure</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="animate-pulse text-lime-500">● Live Engine</span>
          <span className="hidden md:inline">Buffer: 100%</span>
        </div>
      </footer>
    </div>
  );
}
