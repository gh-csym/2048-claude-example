import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTheme } from '../hooks/useTheme';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';
import { GameControls } from './GameControls';
import { Leaderboard } from './Leaderboard';
import { ScoreHistory } from './ScoreHistory';
import { ThemeToggle } from './ThemeToggle';
import './Game.css';

export const Game: React.FC = () => {
  const { tiles, score, bestScore, status, moveCount, move, newGame, continueGame } = useGame();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useKeyboard({ onMove: move, enabled: status !== 'lost' });

  return (
    <div className="game-container">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <div className="game-main">
        <GameControls status={status} onNewGame={newGame} onContinue={continueGame} />
        <ScoreBoard score={score} bestScore={bestScore} status={status} moveCount={moveCount} />
        <Board tiles={tiles} />
        <button
          type="button"
          className="leaderboard-button"
          onClick={() => setShowLeaderboard(true)}
        >
          🏆 Leaderboard
        </button>
        <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      </div>
      <ScoreHistory />
    </div>
  );
};
