import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
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

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#39ff14';
      
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.fillRect(x, y, size, size);
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff00ff';
    const fx = food.x * cellSize + 2;
    const fy = food.y * cellSize + 2;
    const fsize = cellSize - 4;
    ctx.beginPath();
    ctx.arc(fx + fsize/2, fy + fsize/2, fsize/2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <Card className="p-0 bg-[#0a0a0a] border-2 border-neon-blue shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden rounded-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-neon-pink neon-glow-pink mb-4 font-mono uppercase tracking-tighter">Crashed</h2>
                <button
                  onClick={resetGame}
                  className="px-8 py-2 border border-neon-blue text-neon-blue font-bold hover:bg-neon-blue hover:text-black transition-all uppercase tracking-widest text-xs"
                >
                  Reboot
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-neon-blue neon-glow-blue mb-4 font-mono uppercase tracking-tighter">Ready?</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-2 border border-neon-pink text-neon-pink font-bold hover:bg-neon-pink hover:text-black transition-all uppercase tracking-widest text-xs"
                >
                  Start
                </button>
              </>
            )}
          </div>
        )}
      </Card>
      
      <div className="flex justify-between w-full max-w-[400px] items-center mt-4">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-widest text-text-dim">Session Score</span>
          <span className="text-2xl font-bold text-neon-green font-mono">{score.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-text-dim">Status</span>
          <Badge variant="outline" className="border-border-subtle text-neon-blue rounded-none uppercase text-[10px] tracking-widest">
            {gameOver ? 'Offline' : isPaused ? 'Standby' : 'Active'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
