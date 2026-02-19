import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import {
  getLeaderboard,
  addLeaderboardEntry,
  clearLeaderboard,
  isLeaderboardScore,
} from './leaderboard';

describe('leaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getLeaderboard', () => {
    it('should return empty array when no entries', () => {
      const entries = getLeaderboard();
      expect(entries).toEqual([]);
    });

    it('should return sorted entries by score', () => {
      addLeaderboardEntry(100, 50);
      addLeaderboardEntry(200, 40);
      addLeaderboardEntry(150, 45);

      const entries = getLeaderboard();
      expect(entries).toHaveLength(3);
      expect(entries[0].score).toBe(200);
      expect(entries[1].score).toBe(150);
      expect(entries[2].score).toBe(100);
    });

    it('should limit entries to 10', () => {
      for (let i = 1; i <= 15; i += 1) {
        addLeaderboardEntry(i * 100, i * 10);
      }

      const entries = getLeaderboard();
      expect(entries).toHaveLength(10);
      expect(entries[0].score).toBe(1500);
    });
  });

  describe('addLeaderboardEntry', () => {
    it('should add entry to empty leaderboard', () => {
      addLeaderboardEntry(100, 50);

      const entries = getLeaderboard();
      expect(entries).toHaveLength(1);
      expect(entries[0].score).toBe(100);
      expect(entries[0].moves).toBe(50);
    });

    it('should add entry with valid id and date', () => {
      addLeaderboardEntry(100, 50);

      const entries = getLeaderboard();
      expect(entries[0].id).toBeTruthy();
      expect(entries[0].date).toBeTruthy();
    });
  });

  describe('clearLeaderboard', () => {
    it('should remove all entries', () => {
      addLeaderboardEntry(100, 50);
      addLeaderboardEntry(200, 40);

      clearLeaderboard();

      const entries = getLeaderboard();
      expect(entries).toEqual([]);
    });
  });

  describe('isLeaderboardScore', () => {
    it('should return true when leaderboard has less than 10 entries', () => {
      addLeaderboardEntry(100, 50);
      expect(isLeaderboardScore(50)).toBe(true);
    });

    it('should return true when score is higher than lowest entry', () => {
      for (let i = 1; i <= 10; i += 1) {
        addLeaderboardEntry(i * 100, i * 10);
      }

      expect(isLeaderboardScore(150)).toBe(true);
    });

    it('should return false when score is lower than lowest entry', () => {
      for (let i = 1; i <= 10; i += 1) {
        addLeaderboardEntry(i * 100, i * 10);
      }

      expect(isLeaderboardScore(50)).toBe(false);
    });
  });
});
