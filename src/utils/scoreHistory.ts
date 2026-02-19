import type { ScoreHistoryEntry } from '../types/game';

const SCORE_HISTORY_KEY = '2048-score-history';

/**
 * Get all score history entries from localStorage
 * Returns entries in chronological order (newest first)
 */
export const getScoreHistory = (): ScoreHistoryEntry[] => {
  try {
    const data = localStorage.getItem(SCORE_HISTORY_KEY);
    if (!data) {
      return [];
    }
    const entries = JSON.parse(data) as ScoreHistoryEntry[];
    // Return in chronological order (newest first)
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to load score history:', error);
    return [];
  }
};

/**
 * Add a new entry to the score history
 */
export const addScoreHistoryEntry = (score: number, moves: number, won: boolean): void => {
  try {
    const entries = getScoreHistory();
    const newEntry: ScoreHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      score,
      date: new Date().toISOString(),
      moves,
      won,
    };

    entries.push(newEntry);
    localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save score history entry:', error);
  }
};

/**
 * Clear all score history entries
 */
export const clearScoreHistory = (): void => {
  try {
    localStorage.removeItem(SCORE_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear score history:', error);
  }
};
