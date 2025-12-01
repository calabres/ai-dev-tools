export type GameMode = 'walls' | 'passthrough';

export class SnakeEngine {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  grid = 20;
  snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }];
  dx = 20; dy = 0;
  food = { x: 200, y: 200 };
  score = 0;
  mode: GameMode;
  running = false;
  onGameOver: (finalScore: number) => void;
  onScore: (s: number) => void;

  constructor(ctx: CanvasRenderingContext2D, w: number, h: number, mode: GameMode, onGameOver: (finalScore: number) => void, onScore: (s: number) => void) {
    this.ctx = ctx; this.width = w; this.height = h; this.mode = mode;
    this.onGameOver = onGameOver; this.onScore = onScore;
  }

  update() {
    if (!this.running) return;
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

    if (this.mode === 'passthrough') {
      if (head.x >= this.width) head.x = 0; else if (head.x < 0) head.x = this.width - this.grid;
      if (head.y >= this.height) head.y = 0; else if (head.y < 0) head.y = this.height - this.grid;
    } else {
      if (head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height) { this.running = false; return this.onGameOver(this.score); }
    }

    if (this.snake.some(s => s.x === head.x && s.y === head.y)) { this.running = false; return this.onGameOver(this.score); }

    this.snake.unshift(head);
    if (Math.abs(head.x - this.food.x) < 5 && Math.abs(head.y - this.food.y) < 5) {
      this.score += 10; this.onScore(this.score);
      this.food = { x: Math.floor(Math.random() * (this.width / this.grid)) * this.grid, y: Math.floor(Math.random() * (this.height / this.grid)) * this.grid };
    } else { this.snake.pop(); }
  }

  draw() {
    this.ctx.fillStyle = '#1a1a1a'; this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'red'; this.ctx.fillRect(this.food.x, this.food.y, this.grid - 1, this.grid - 1);
    this.ctx.fillStyle = '#4ade80'; this.snake.forEach(s => this.ctx.fillRect(s.x, s.y, this.grid - 1, this.grid - 1));
  }

  step() { this.update(); this.draw(); }

  setDirection(k: string) {
    if (k === 'ArrowLeft' && this.dx === 0) { this.dx = -this.grid; this.dy = 0; }
    if (k === 'ArrowUp' && this.dy === 0) { this.dy = -this.grid; this.dx = 0; }
    if (k === 'ArrowRight' && this.dx === 0) { this.dx = this.grid; this.dy = 0; }
    if (k === 'ArrowDown' && this.dy === 0) { this.dy = this.grid; this.dx = 0; }
  }
}
