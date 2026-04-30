import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Overdrive',
    artist: 'AI.Gen.01',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    gradient: 'from-cyan-600 to-fuchsia-600',
    colorText: 'text-cyan-400',
    bgIcon: 'bg-lime-500/20 text-lime-400'
  },
  {
    id: 2,
    title: 'Cybernetic Pulse',
    artist: 'AI.Gen.02',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    gradient: 'from-fuchsia-600 to-cyan-600',
    colorText: 'text-fuchsia-400',
    bgIcon: 'bg-fuchsia-500/20 text-fuchsia-400'
  },
  {
    id: 3,
    title: 'Synapse Drift',
    artist: 'AI.Gen.03',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    gradient: 'from-lime-600 to-cyan-600',
    colorText: 'text-lime-400',
    bgIcon: 'bg-cyan-500/20 text-cyan-400'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      {/* Now Playing Component */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl shrink-0">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Now Playing</h2>
        <div className="relative group">
          <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${currentTrack.gradient} flex items-center justify-center overflow-hidden border border-white/10`}>
             <div className="absolute inset-0 bg-black/20"></div>
             <div className="z-10 text-center">
               <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1">AI-Core</p>
               <p className="text-lg font-black italic shadow-black drop-shadow-md px-2 break-words">{currentTrack.title.toUpperCase()}</p>
             </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button onClick={playPrev} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
            </button>
            <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              )}
            </button>
            <button onClick={playNext} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" /></svg>
            </button>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Queue Component */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex-grow flex flex-col gap-3 min-h-[160px] overflow-y-auto">
         <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest sticky top-0 bg-[#0c0c0c] py-1 z-10">Queue</h2>
         <div className="space-y-2">
           {TRACKS.map((track, i) => (
             <div 
               key={track.id} 
               onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
               className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                 i === currentTrackIndex ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'
               }`}
             >
               <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold ${track.bgIcon}`}>AI</div>
               <div className="flex-grow min-w-0">
                 <p className={`text-xs font-bold truncate ${i === currentTrackIndex ? track.colorText : ''}`}>{track.title}</p>
                 <p className="text-[10px] text-zinc-500 truncate">{track.artist}</p>
               </div>
             </div>
           ))}
         </div>
      </div>
    </>
  );
}
