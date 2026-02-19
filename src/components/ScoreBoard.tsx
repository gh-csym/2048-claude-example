import React, { useEffect, useState } from 'react';
import type { GameStatus } from '../types/game';
import './ScoreBoard.css';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  status: GameStatus;
  moveCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore, status, moveCount }) => {
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const [isBestScoreAnimating, setIsBestScoreAnimating] = useState(false);
  const [isMoveCountAnimating, setIsMoveCountAnimating] = useState(false);

  useEffect(() => {
    if (score > 0) {
      setIsScoreAnimating(true);
      const timer = setTimeout(() => setIsScoreAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]);

  useEffect(() => {
    if (bestScore > 0) {
      setIsBestScoreAnimating(true);
      const timer = setTimeout(() => setIsBestScoreAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [bestScore]);

  useEffect(() => {
    if (moveCount > 0) {
      setIsMoveCountAnimating(true);
      const timer = setTimeout(() => setIsMoveCountAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [moveCount]);

  return (
    <div className="score-board">
      <div className="scores">
        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className={`score-value ${isScoreAnimating ? 'score-update' : ''}`}>{score}</div>
        </div>
        <div className="score-container">
          <div className="score-label">BEST</div>
          <div className={`score-value ${isBestScoreAnimating ? 'score-update' : ''}`}>{bestScore}</div>
        </div>
        <div className="score-container">
          <div className="score-label">MOVES</div>
          <div className={`score-value ${isMoveCountAnimating ? 'score-update' : ''}`}>{moveCount}</div>
        </div>
      </div>
      {status === 'won' && (
        <div className="game-message won">
          <p>You Win!</p>
        </div>
      )}
      {status === 'lost' && (
        <div className="game-message lost">
          <p>Game Over!</p>
        </div>
      )}
    </div>
  );
};
