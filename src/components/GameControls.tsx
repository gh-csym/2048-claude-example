import React from 'react';
import type { GameStatus } from '../types/game';
import './GameControls.css';

interface GameControlsProps {
  status: GameStatus;
  onNewGame: () => void;
  onContinue: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ status, onNewGame, onContinue }) => {
  return (
    <div className="game-controls">
      <div className="controls-header">
        <h1 className="game-title">2048</h1>
        <button type="button" className="new-game-button" onClick={onNewGame}>
          New Game
        </button>
      </div>
      <div className="instructions">
        <p>
          <strong>How to play:</strong> Use arrow keys to move tiles. When two tiles with the same
          number touch, they merge into one!
        </p>
      </div>
      {status === 'won' && (
        <div className="continue-section">
          <button type="button" className="continue-button" onClick={onContinue}>
            Keep Playing
          </button>
        </div>
      )}
    </div>
  );
};
