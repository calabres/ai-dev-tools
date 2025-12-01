import { useState, useEffect, useRef } from 'react';
import { api, User, LeaderboardEntry } from './lib/api';
import { SnakeEngine, GameMode } from './lib/gameLogic';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<'login' | 'menu' | 'game'>('login');
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<GameMode>('walls');
  const [score, setScore] = useState(0);
  const [usernameInput, setUsernameInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SnakeEngine | null>(null);

  useEffect(() => {
    if (screen === 'menu') api.getLeaderboard().then(setLeaders);
  }, [screen]);

  useEffect(() => {
    if (screen === 'game' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const engine = new SnakeEngine(ctx, 400, 400, mode, () => { alert('Game Over!'); setScreen('menu'); }, setScore);
        engine.running = true;
        engineRef.current = engine;
        const interval = setInterval(() => engine.step(), 100);
        const handleKey = (e: any) => engine.setDirection(e.key);
        window.addEventListener('keydown', handleKey);
        return () => { clearInterval(interval); window.removeEventListener('keydown', handleKey); };
      }
    }
  }, [screen, mode]);

  if (screen === 'login') return (
    <div className="container">
      <div className="card">
        <h1>🐍 Snake Arena</h1>
        <input placeholder="Username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />
        <button onClick={() => api.login(usernameInput).then(u => { setUser(u); setScreen('menu'); })}>Login</button>
      </div>
    </div>
  );

  if (screen === 'menu') return (
    <div className="container">
      <h1>Welcome, {user?.username}</h1>
      <div className="card">
        <button onClick={() => { setMode('walls'); setScreen('game'); }}>Play: Walls</button>
        <button onClick={() => { setMode('passthrough'); setScreen('game'); }}>Play: Passthrough</button>
        <button className="secondary" onClick={() => alert('Spectating...')}>Watch Others</button>
        <h3>Leaderboard</h3>
        <ul>{leaders.map((l, i) => <li key={i}><span>#{i+1} {l.username}</span><span>{l.score}</span></li>)}</ul>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h2>Score: {score}</h2>
      <canvas ref={canvasRef} width={400} height={400} />
      <button className="secondary" onClick={() => setScreen('menu')}>Exit Game</button>
    </div>
  );
}
