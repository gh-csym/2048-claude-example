import type { LeaderboardEntry } from '../types/game';

const LEADERBOARD_KEY = '2048-leaderboard';
const MAX_ENTRIES = 10;

/**
 * Get all leaderboard entries from localStorage
 */
export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) {
      return [];
    }
    const entries = JSON.parse(data) as LeaderboardEntry[];
    return entries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }
};

/**
 * Add a new entry to the leaderboard
 */
export const addLeaderboardEntry = (score: number, moves: number): void => {
  try {
    const entries = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      score,
      date: new Date().toISOString(),
      moves,
    };

    entries.push(newEntry);
    const sortedEntries = entries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedEntries));
  } catch (error) {
    console.error('Failed to save leaderboard entry:', error);
  }
};

/**
 * Clear all leaderboard entries
 */
export const clearLeaderboard = (): void => {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Failed to clear leaderboard:', error);
  }
};

/**
 * Check if a score qualifies for the leaderboard
 */
export const isLeaderboardScore = (score: number): boolean => {
  const entries = getLeaderboard();
  if (entries.length < MAX_ENTRIES) {
    return true;
  }
  return score > entries[entries.length - 1].score;
};
