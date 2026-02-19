import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { GameState, Direction } from '../types/game';
import { initializeGame, moveTiles } from '../utils/gameLogic';
import { addLeaderboardEntry } from '../utils/leaderboard';
import { addScoreHistoryEntry } from '../utils/scoreHistory';

type GameAction =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'NEW_GAME' }
  | { type: 'CONTINUE' }
  | { type: 'LOAD_BEST_SCORE'; score: number };

const BEST_SCORE_KEY = '2048-best-score';

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE': {
      if (state.status === 'lost') {
        return state;
      }
      return moveTiles(state, action.direction);
    }
    case 'NEW_GAME': {
      const newState = initializeGame();
      return {
        ...newState,
        bestScore: state.bestScore,
      };
    }
    case 'CONTINUE': {
      return {
        ...state,
        status: 'playing',
      };
    }
    case 'LOAD_BEST_SCORE': {
      return {
        ...state,
        bestScore: action.score,
      };
    }
    default:
      return state;
  }
};

export interface UseGameReturn {
  tiles: GameState['tiles'];
  score: number;
  bestScore: number;
  status: GameState['status'];
  moveCount: number;
  move: (direction: Direction) => void;
  newGame: () => void;
  continueGame: () => void;
}

export const useGame = (): UseGameReturn => {
  const [state, dispatch] = useReducer(gameReducer, null, initializeGame);
  const prevStatusRef = useRef<GameState['status']>('playing');

  // Load best score from localStorage on mount
  useEffect(() => {
    try {
      const savedBestScore = localStorage.getItem(BEST_SCORE_KEY);
      if (savedBestScore) {
        const score = parseInt(savedBestScore, 10);
        if (!Number.isNaN(score)) {
          dispatch({ type: 'LOAD_BEST_SCORE', score });
        }
      }
    } catch (error) {
      console.error('Failed to load best score:', error);
    }
  }, []);

  // Save best score to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(BEST_SCORE_KEY, state.bestScore.toString());
    } catch (error) {
      console.error('Failed to save best score:', error);
    }
  }, [state.bestScore]);

  // Save to leaderboard when game ends
  useEffect(() => {
    if (prevStatusRef.current !== 'lost' && state.status === 'lost') {
      if (state.score > 0) {
        addLeaderboardEntry(state.score, state.moveCount);
      }
    }
    prevStatusRef.current = state.status;
  }, [state.status, state.score, state.moveCount]);

  // Save to score history when game ends (won or lost)
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const currentStatus = state.status;

    // Save when transitioning to 'won' or 'lost' from 'playing'
    if (prevStatus === 'playing' && (currentStatus === 'won' || currentStatus === 'lost')) {
      if (state.score > 0) {
        addScoreHistoryEntry(state.score, state.moveCount, currentStatus === 'won');
      }
    }
  }, [state.status, state.score, state.moveCount]);

  const move = useCallback((direction: Direction) => {
    dispatch({ type: 'MOVE', direction });
  }, []);

  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const continueGame = useCallback(() => {
    dispatch({ type: 'CONTINUE' });
  }, []);

  return {
    tiles: state.tiles,
    score: state.score,
    bestScore: state.bestScore,
    status: state.status,
    moveCount: state.moveCount,
    move,
    newGame,
    continueGame,
  };
};
