import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const GAME_SPEED = 150;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 0, y: 0 });
  const pendingDirectionRef = useRef<Point>({ x: 0, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const gameLoopRef = useRef<number | null>(null);

  const spawnFood = (snake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  const startGame = () => {
    snakeRef.current = [{ x: 5, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    pendingDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = spawnFood(snakeRef.current);
    setScore(0);
    onScoreChange(0);
    setIsPlaying(true);
    setIsGameOver(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.clearRect(0, 0, GRID_SIZE * TILE_SIZE, GRID_SIZE * TILE_SIZE);

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#a3e635' : 'rgba(163, 230, 53, 0.8)'; // lime-400 from bento design
      ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
      if (index === 0) {
        // glowing head
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a3e635';
      } else {
        ctx.shadowBlur = 0;
      }
    });

    // Reset shadow for food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef'; // fuchsia-500
    ctx.fillStyle = '#d946ef';

    // Draw food as circle
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * TILE_SIZE + TILE_SIZE / 2, 
      foodRef.current.y * TILE_SIZE + TILE_SIZE / 2, 
      TILE_SIZE / 2 - 2, 
      0, 2 * Math.PI
    );
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying || isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      const { x: dx, y: dy } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dy === 0) pendingDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dy === 0) pendingDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dx === 0) pendingDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dx === 0) pendingDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying) {
      draw(); // Draw initial state
      return;
    }

    const moveSnake = () => {
      directionRef.current = pendingDirectionRef.current;
      const { x: dx, y: dy } = directionRef.current;
      const snake = [...snakeRef.current];
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsPlaying(false);
        setIsGameOver(true);
        return;
      }

      // Check self collision (except the tail which might move)
      if (snake.some((segment, idx) => idx !== snake.length - 1 && segment.x === head.x && segment.y === head.y)) {
        setIsPlaying(false);
        setIsGameOver(true);
        return;
      }

      snake.unshift(head);

      // Check food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        foodRef.current = spawnFood(snake);
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      draw();
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  // Initial draw
  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * TILE_SIZE}
        height={GRID_SIZE * TILE_SIZE}
        className="block"
      />
      
      {(!isPlaying || isGameOver) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 transition-all rounded-2xl">
          <div className="text-center">
            {isGameOver ? (
              <>
                <h2 className="text-3xl font-display text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] mb-2 font-bold tracking-widest uppercase">System Fault</h2>
                <p className="text-cyan-400 font-mono mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Output: {score}</p>
              </>
            ) : (
              <h2 className="text-2xl font-display text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.8)] mb-6 font-bold tracking-wider uppercase">Initialize</h2>
            )}
            <button
              onClick={startGame}
              className="px-6 py-2 bg-lime-400/10 border border-lime-400 text-lime-400 font-mono uppercase tracking-widest text-sm hover:bg-lime-400 hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.3)]"
            >
              {isGameOver ? 'Reboot' : 'Start'} [Space]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
