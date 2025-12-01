export interface User { id: number; username: string; }
export interface LeaderboardEntry { username: string; score: number; }

export const api = {
  login: async (username: string): Promise<User> => {
    return new Promise(resolve => setTimeout(() => resolve({ id: Date.now(), username }), 500));
  },
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    return [
      { username: 'SnakeMaster', score: 300 },
      { username: 'PythonDev', score: 250 },
      { username: 'Viper', score: 100 }
    ];
  }
};
