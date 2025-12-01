export interface User { id: number; username: string; }
export interface LeaderboardEntry { username: string; score: number; }

export const api = {
  login: async (username: string): Promise<User> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
  submitScore: async (username: string, score: number): Promise<void> => {
    await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score })
    });
  }
};
