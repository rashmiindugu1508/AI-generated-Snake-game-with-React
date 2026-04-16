import React, { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber City",
    artist: "Neon AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#ff00ff",
  },
  {
    id: 2,
    title: "Digital Pulse",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00ffff",
  },
  {
    id: 3,
    title: "Neon Nights",
    artist: "Glitch Soul",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#bc13fe",
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (duration) {
        audioRef.current.currentTime = (value[0] / 100) * duration;
        setProgress(value[0]);
      }
    }
  };

  return (
    <div className="w-full flex items-center gap-12 px-10 h-full bg-surface border-t border-border-subtle">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      {/* Now Playing */}
      <div className="w-[240px] shrink-0">
        <h3 className="text-sm font-bold text-white truncate">{currentTrack.title}</h3>
        <p className="text-xs text-text-dim uppercase tracking-widest mt-1">Now Playing</p>
      </div>

      {/* Controls & Progress */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex items-center gap-8">
          <button onClick={prevTrack} className="text-xs uppercase tracking-widest text-white hover:text-neon-blue transition-colors">Prev</button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold hover:scale-105 transition-transform"
          >
            {isPlaying ? "II" : "▶"}
          </button>

          <button onClick={nextTrack} className="text-xs uppercase tracking-widest text-white hover:text-neon-blue transition-colors">Next</button>
        </div>

        <div className="w-full max-w-[500px] flex items-center gap-4">
          <div className="flex-1 h-1 bg-[#333] rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-neon-blue shadow-[0_0_10px_#00f3ff]"
              style={{ width: `${progress}%` }}
              initial={false}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => handleSeek([parseFloat(e.target.value)])}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>
        </div>
      </div>

      {/* Time & Volume */}
      <div className="w-[120px] shrink-0 flex flex-col items-end gap-2">
        <div className="text-xs font-mono text-text-dim">
          {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"} / {audioRef.current ? formatTime(audioRef.current.duration) : "0:00"}
        </div>
        <div className="flex items-center gap-2 w-full">
          <Volume2 className="w-3 h-3 text-text-dim" />
          <Slider
            value={[volume]}
            max={100}
            onValueChange={(v) => setVolume(v[0])}
            className="flex-1 h-1"
          />
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
