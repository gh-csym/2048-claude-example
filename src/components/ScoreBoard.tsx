import React from 'react';
import type { GameStatus } from '../types/game';
import './ScoreBoard.css';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  status: GameStatus;
  moveCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore, status, moveCount }) => {
  return (
    <div className="score-board">
      <div className="scores">
        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score}</div>
        </div>
        <div className="score-container">
          <div className="score-label">BEST</div>
          <div className="score-value">{bestScore}</div>
        </div>
        <div className="score-container">
          <div className="score-label">MOVES</div>
          <div className="score-value">{moveCount}</div>
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
