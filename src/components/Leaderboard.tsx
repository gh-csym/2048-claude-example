import React, { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../types/game';
import { getLeaderboard, clearLeaderboard } from '../utils/leaderboard';
import { Modal } from './Modal';
import './Leaderboard.css';

/**
 * Props for the Leaderboard component
 */
export interface LeaderboardProps {
  /** Whether the leaderboard modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
}

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
 * Leaderboard component for displaying top scores
 *
 * Features:
 * - Displays top 10 scores
 * - Shows score, moves, and date
 * - Medal icons for top 3
 * - Clear leaderboard functionality
 * - Empty state message
 *
 * @example
 * ```tsx
 * <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
 * ```
 */
export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEntries(getLeaderboard());
    }
  }, [isOpen]);

  const handleClear = (): void => {
    if (window.confirm('Are you sure you want to clear the leaderboard?')) {
      clearLeaderboard();
      setEntries([]);
    }
  };

  const getMedalEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leaderboard">
      <div className="leaderboard-container">
        {entries.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No scores yet!</p>
            <p className="leaderboard-empty-subtitle">
              Play a game to get on the leaderboard.
            </p>
          </div>
        ) : (
          <>
            <div className="leaderboard-list">
              {entries.map((entry, index) => (
                <div key={entry.id} className="leaderboard-item">
                  <div className="leaderboard-rank">
                    {getMedalEmoji(index) || `#${index + 1}`}
                  </div>
                  <div className="leaderboard-details">
                    <div className="leaderboard-score">{entry.score.toLocaleString()}</div>
                    <div className="leaderboard-meta">
                      {entry.moves} moves · {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="leaderboard-clear-button" onClick={handleClear}>
              Clear Leaderboard
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
