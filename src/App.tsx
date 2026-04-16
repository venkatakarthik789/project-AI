/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Music, 
  Trophy, 
  Gamepad2,
  RefreshCw,
  Info
} from 'lucide-react';

// --- Constants & Types ---

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/400/400",
    color: "#00f2ff" // Cyan
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Digital Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber/400/400",
    color: "#ff00ff" // Magenta
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/grid/400/400",
    color: "#39ff14" // Lime
  }
];

// --- Components ---

export default function App() {
  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Game State
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');

  const currentTrack = TRACKS[currentTrackIndex];

  // Music Controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  return (
    <div className="h-screen bg-bg-void text-glitch-cyan font-mono selection:bg-glitch-magenta/30 overflow-hidden grid grid-cols-[300px_1fr] grid-rows-[1fr_120px] relative">
      <div className="scanline pointer-events-none" />
      
      {/* Sidebar: DATA_STREAM */}
      <aside className="bg-bg-void p-6 flex flex-col gap-6 border-r-4 border-glitch-cyan relative z-20 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase glitch-text leading-none">
            VOID_PULSE
          </h1>
          <p className="text-[10px] text-glitch-magenta font-tech mt-2 tracking-[0.3em]">SYSTEM_VERSION::0.4.2</p>
        </div>

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-widest text-glitch-yellow border-b border-glitch-yellow/30 pb-1">AUDIO_FILES</p>
          <div className="flex flex-col gap-3">
            {TRACKS.map((track, index) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrackIndex(index)}
                className={`p-4 text-left transition-all border-2 group relative overflow-hidden ${
                  currentTrackIndex === index 
                    ? 'bg-glitch-cyan text-black border-glitch-magenta' 
                    : 'bg-transparent border-glitch-cyan/30 hover:border-glitch-cyan'
                }`}
              >
                <div className="relative z-10">
                  <p className="text-lg font-bold truncate leading-none mb-1">{track.title}</p>
                  <p className={`text-[10px] truncate uppercase ${currentTrackIndex === index ? 'text-black/60' : 'text-glitch-cyan/50'}`}>
                    {track.artist}
                  </p>
                </div>
                {currentTrackIndex === index && (
                  <motion.div 
                    className="absolute inset-0 bg-glitch-magenta/20"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-2 border-glitch-magenta bg-glitch-magenta/5">
          <div className="flex items-center gap-2 mb-2 text-glitch-magenta uppercase text-[10px] tracking-widest">
            <Info size={12} />
            <span>MACHINE_LOGS</span>
          </div>
          <p className="text-[12px] leading-tight font-tech">
            INPUT_REQUIRED: [W,A,S,D] :: COLLECT_DATA_BITS :: AVOID_SELF_COLLISION :: MAINTAIN_PULSE
          </p>
        </div>
      </aside>

      {/* Main Content: SIMULATION_WINDOW */}
      <main className="relative z-10 flex items-center justify-center p-12 bg-bg-void overflow-hidden">
        {/* HUD: METRICS */}
        <div className="absolute top-12 right-12 text-right space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-glitch-magenta mb-2">CURRENT_SCORE</p>
            <p className="text-7xl font-black text-glitch-cyan glitch-text leading-none">
              {score.toString().padStart(6, '0')}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-glitch-yellow mb-2">MAX_PULSE</p>
            <p className="text-3xl font-bold text-glitch-yellow leading-none">{highScore.toString().padStart(6, '0')}</p>
          </div>
        </div>

        <div className="w-full max-w-[550px] aspect-square relative glitch-border p-1 bg-glitch-cyan/5">
          <div className="w-full h-full bg-black relative overflow-hidden">
            <SnakeGame 
              gameState={gameState} 
              setGameState={setGameState} 
              score={score}
              setScore={setScore}
              setHighScore={setHighScore}
              accentColor={currentTrack.color}
            />
          </div>
          
          {/* OVERLAY: SYSTEM_HALT */}
          <AnimatePresence>
            {gameState !== 'PLAYING' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://picsum.photos/seed/static/800/800?grayscale')] bg-cover mix-blend-screen" />
                
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center p-8 relative z-10"
                >
                  {gameState === 'GAME_OVER' ? (
                    <>
                      <h2 className="text-6xl font-black uppercase tracking-tighter mb-4 glitch-text text-glitch-magenta">
                        SYSTEM_FAIL
                      </h2>
                      <p className="text-glitch-cyan mb-12 font-tech text-xl tracking-widest">DATA_LOSS_DETECTED: {score}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-6xl font-black uppercase tracking-tighter mb-4 glitch-text">
                        INITIALIZE
                      </h2>
                      <p className="text-glitch-cyan mb-12 font-tech text-xl tracking-widest">READY_FOR_UPLINK</p>
                    </>
                  )}
                  
                  <button 
                    onClick={() => setGameState('PLAYING')}
                    className="px-12 py-5 bg-glitch-cyan text-black font-black uppercase tracking-[0.3em] hover:bg-glitch-magenta hover:text-white transition-all transform hover:skew-x-12 active:scale-95 border-4 border-black"
                  >
                    {gameState === 'GAME_OVER' ? 'REBOOT' : 'EXECUTE'}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom: CONTROL_INTERFACE */}
      <footer className="col-span-2 bg-bg-void border-t-4 border-glitch-cyan flex items-center px-12 justify-between relative z-30">
        <div className="flex items-center gap-6 w-[350px]">
          <div className="relative">
            <motion.img 
              key={currentTrack.id}
              src={currentTrack.cover} 
              className="w-16 h-16 border-2 border-glitch-magenta object-cover grayscale contrast-150" 
              referrerPolicy="no-referrer" 
              animate={isPlaying ? { x: [0, -2, 2, 0], y: [0, 2, -2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.1 }}
            />
            <div className="absolute inset-0 border-2 border-glitch-cyan mix-blend-difference pointer-events-none" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-xl truncate leading-none mb-1 uppercase tracking-tighter">{currentTrack.title}</h3>
            <p className="text-xs text-glitch-magenta truncate uppercase font-tech tracking-widest">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <button onClick={prevTrack} className="text-glitch-cyan hover:text-glitch-magenta transition-colors">
            <SkipBack size={28} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-glitch-cyan text-black flex items-center justify-center hover:bg-glitch-magenta hover:text-white transition-all transform hover:rotate-45"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-glitch-cyan hover:text-glitch-magenta transition-colors">
            <SkipForward size={28} />
          </button>
        </div>

        <div className="flex-1 max-w-[450px] mx-12">
          <div className="flex justify-between text-[10px] text-glitch-yellow uppercase tracking-[0.3em] mb-3 font-tech">
            <span>BIT_POS::000</span>
            <span>END_OF_STREAM</span>
          </div>
          <div className="h-4 bg-glitch-cyan/10 border border-glitch-cyan relative overflow-hidden">
            <motion.div 
              className="h-full bg-glitch-cyan"
              animate={{ 
                width: isPlaying ? '100%' : '35%',
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                width: { duration: isPlaying ? 225 : 0.5, ease: "linear" },
                opacity: { repeat: Infinity, duration: 0.05 }
              }}
            />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.5)_2px,rgba(0,0,0,0.5)_4px)]" />
          </div>
        </div>

        <div className="w-[180px] flex items-center gap-4">
          <Volume2 size={20} className="text-glitch-cyan" />
          <div className="flex-1 h-2 bg-glitch-cyan/10 border border-glitch-cyan">
            <div className="w-[70%] h-full bg-glitch-magenta" />
          </div>
        </div>
      </footer>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
      />
    </div>
  );
}

// --- Snake Game Component ---

function SnakeGame({ 
  gameState, 
  setGameState, 
  score,
  setScore, 
  setHighScore,
  accentColor 
}: { 
  gameState: string; 
  setGameState: (s: any) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  accentColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, [setScore]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown': case 's': case 'S':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft': case 'a': case 'A':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight': case 'd': case 'D':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (gameState !== 'PLAYING') return;

    if (time - lastUpdateTimeRef.current > speed) {
      lastUpdateTimeRef.current = time;
      
      setDirection(nextDirection);
      
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (nextDirection) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check Collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameState('GAME_OVER');
          setHighScore((prev: number) => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [gameState, nextDirection, speed, food, generateFood, setGameState, setHighScore, score, setScore]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(update);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const cellSize = canvas.width / GRID_SIZE;
      
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines (Jarring)
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Food (Magenta Glitch)
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff00ff';
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(
        food.x * cellSize + 4,
        food.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
      );
      ctx.shadowBlur = 0;

      // Snake (Cyan/White Glitch)
      snake.forEach((segment, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#fff' : '#00ffff';
        ctx.shadowBlur = isHead ? 15 : 0;
        ctx.shadowColor = '#00ffff';
        
        const padding = isHead ? 1 : 2;
        ctx.fillRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
      });
      ctx.shadowBlur = 0;
    };

    draw();
  }, [snake, food, accentColor]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={600} 
      className="w-full h-full"
    />
  );
}
