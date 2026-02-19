export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: number;
  position: Position;
  isNew?: boolean;
  isMerged?: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  status: GameStatus;
  moveCount: number;
}

export interface LeaderboardEntry {
  id: string;
  score: number;
  date: string;
  moves: number;
}

export interface ScoreHistoryEntry {
  id: string;
  score: number;
  date: string;
  moves: number;
  won: boolean;
}
