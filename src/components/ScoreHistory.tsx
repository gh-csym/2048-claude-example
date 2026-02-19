import React, { useState, useEffect } from 'react';
import type { ScoreHistoryEntry } from '../types/game';
import { getScoreHistory, clearScoreHistory } from '../utils/scoreHistory';
import './ScoreHistory.css';

/**
 * Format date to readable string
 */
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString();
};

/**
 * ScoreHistory component for displaying complete game history
 *
 * Features:
 * - Always-visible sidebar
 * - Displays all games chronologically (newest first)
 * - Shows score, date, and win/loss indicator
 * - Clear history functionality
 * - Empty state message
 * - Responsive design (hidden on mobile <768px)
 *
 * @example
 * ```tsx
 * <ScoreHistory />
 * ```
 */
export const ScoreHistory: React.FC = () => {
  const [entries, setEntries] = useState<ScoreHistoryEntry[]>([]);

  // Load history on mount and set up refresh interval
  useEffect(() => {
    const loadHistory = (): void => {
      setEntries(getScoreHistory());
    };

    loadHistory();

    // Refresh history every 2 seconds to catch new games
    const interval = setInterval(loadHistory, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClear = (): void => {
    if (window.confirm('Are you sure you want to clear all score history?')) {
      clearScoreHistory();
      setEntries([]);
    }
  };

  return (
    <div className="score-history">
      <div className="score-history-header">
        <h2 className="score-history-title">History</h2>
        {entries.length > 0 && (
          <button
            type="button"
            className="score-history-clear-button"
            onClick={handleClear}
            title="Clear all history"
          >
            Clear
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="score-history-empty">
          <p>No games yet!</p>
          <p className="score-history-empty-subtitle">Your game history will appear here.</p>
        </div>
      ) : (
        <div className="score-history-list">
          {entries.map((entry) => (
            <div key={entry.id} className="score-history-item">
              <div className="score-history-score">
                {entry.score.toLocaleString()}
                {entry.won && <span className="score-history-won">🏆</span>}
              </div>
              <div className="score-history-meta">{formatDate(entry.date)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
