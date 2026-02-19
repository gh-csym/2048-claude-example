import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { getScoreHistory, addScoreHistoryEntry, clearScoreHistory } from './scoreHistory';

describe('scoreHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getScoreHistory', () => {
    it('should return empty array when no history exists', () => {
      const history = getScoreHistory();
      expect(history).toEqual([]);
    });

    it('should return entries in chronological order (newest first)', () => {
      const oldDate = new Date('2024-01-01').toISOString();
      const newDate = new Date('2024-01-02').toISOString();

      localStorage.setItem(
        '2048-score-history',
        JSON.stringify([
          { id: '1', score: 100, date: oldDate, moves: 10, won: false },
          { id: '2', score: 200, date: newDate, moves: 20, won: true },
        ])
      );

      const history = getScoreHistory();
      expect(history).toHaveLength(2);
      expect(history[0].id).toBe('2'); // Newest first
      expect(history[1].id).toBe('1');
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('2048-score-history', 'invalid json');
      const history = getScoreHistory();
      expect(history).toEqual([]);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = (): never => {
        throw new Error('Storage error');
      };

      const history = getScoreHistory();
      expect(history).toEqual([]);

      // Restore
      localStorage.getItem = originalGetItem;
    });
  });

  describe('addScoreHistoryEntry', () => {
    it('should add new entry to empty history', () => {
      addScoreHistoryEntry(500, 25, false);

      const history = getScoreHistory();
      expect(history).toHaveLength(1);
      expect(history[0].score).toBe(500);
      expect(history[0].moves).toBe(25);
      expect(history[0].won).toBe(false);
      expect(history[0].id).toBeTruthy();
      expect(history[0].date).toBeTruthy();
    });

    it('should add entry to existing history', () => {
      addScoreHistoryEntry(100, 10, false);
      addScoreHistoryEntry(200, 20, true);

      const history = getScoreHistory();
      expect(history).toHaveLength(2);
    });

    it('should create unique IDs for each entry', () => {
      addScoreHistoryEntry(100, 10, false);
      addScoreHistoryEntry(200, 20, true);

      const history = getScoreHistory();
      expect(history[0].id).not.toBe(history[1].id);
    });

    it('should include won status in entry', () => {
      addScoreHistoryEntry(2048, 50, true);

      const history = getScoreHistory();
      expect(history[0].won).toBe(true);
    });

    it('should handle localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = (): never => {
        throw new Error('Storage error');
      };

      // Should not throw
      expect(() => addScoreHistoryEntry(100, 10, false)).not.toThrow();

      // Restore
      localStorage.setItem = originalSetItem;
    });
  });

  describe('clearScoreHistory', () => {
    it('should remove all history entries', () => {
      addScoreHistoryEntry(100, 10, false);
      addScoreHistoryEntry(200, 20, true);

      clearScoreHistory();

      const history = getScoreHistory();
      expect(history).toEqual([]);
    });

    it('should handle clearing when no history exists', () => {
      expect(() => clearScoreHistory()).not.toThrow();
    });

    it('should handle localStorage errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = (): never => {
        throw new Error('Storage error');
      };

      expect(() => clearScoreHistory()).not.toThrow();

      // Restore
      localStorage.removeItem = originalRemoveItem;
    });
  });
});
