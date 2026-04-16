/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden dark">
      {/* Header */}
      <header className="h-20 border-b border-border-subtle flex items-center justify-between px-10 shrink-0">
        <div className="text-2xl font-black tracking-[0.2em] uppercase text-neon-blue neon-glow-blue">
          Synth.Snake
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-text-dim">Personal Best</span>
            <span className="text-xl font-bold text-neon-green">8,892</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-[280px_1fr_280px] p-10 gap-10 overflow-hidden">
        {/* Left Panel - Playlist */}
        <aside className="flex flex-col gap-5 overflow-hidden">
          <div className="text-[12px] uppercase tracking-[0.2em] text-text-dim">Playlist</div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { name: "Neon Horizon", artist: "AI Composer 01", active: true },
              { name: "Midnight Matrix", artist: "AI Composer 02" },
              { name: "Digital Pulse", artist: "AI Composer 03" },
              { name: "Cyber City", artist: "Neon AI" },
            ].map((track, i) => (
              <div 
                key={i} 
                className={`p-4 bg-surface border rounded-[4px] cursor-pointer transition-all ${
                  track.active ? 'border-neon-pink shadow-[inset_0_0_10px_rgba(255,0,255,0.2)]' : 'border-border-subtle hover:border-white/20'
                }`}
              >
                <div className="text-sm font-semibold">{track.name}</div>
                <div className="text-xs text-text-dim mt-1">{track.artist}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center - Game */}
        <section className="flex items-center justify-center">
          <SnakeGame />
        </section>

        {/* Right Panel - Info & Controls */}
        <aside className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="text-[12px] uppercase tracking-[0.2em] text-text-dim">Controls</div>
            <div className="p-5 bg-surface rounded-[4px] border-l-4 border-neon-blue space-y-2">
              {[
                { label: "Move Up", key: "↑" },
                { label: "Move Down", key: "↓" },
                { label: "Move Left", key: "←" },
                { label: "Move Right", key: "→" },
                { label: "Pause/Start", key: "SPACE" },
              ].map((hint, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-text-dim">{hint.label}</span>
                  <span className="bg-[#222] px-2 py-0.5 rounded border border-[#444] font-mono text-[10px]">{hint.key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-[12px] uppercase tracking-[0.2em] text-text-dim">System Info</div>
            <div className="p-4 bg-surface border border-border-subtle rounded-[4px] space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-dim">CPU_LOAD</span>
                <span className="text-neon-green">12%</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-dim">MEM_USAGE</span>
                <span className="text-neon-green">244MB</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-dim">LATENCY</span>
                <span className="text-neon-green">4ms</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer - Player */}
      <footer className="h-[120px] shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}

