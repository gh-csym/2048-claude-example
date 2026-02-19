import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Game } from './Game';
import type { UseGameReturn } from '../hooks/useGame';

// Mock the hooks
jest.mock('../hooks/useGame');
jest.mock('../hooks/useKeyboard');

// Mock child components to simplify testing
jest.mock('./Board', () => ({
  Board: () => <div data-testid="board">Board</div>,
}));
jest.mock('./ScoreBoard', () => ({
  ScoreBoard: () => <div data-testid="scoreboard">ScoreBoard</div>,
}));
jest.mock('./GameControls', () => ({
  GameControls: () => <div data-testid="game-controls">GameControls</div>,
}));
jest.mock('./Leaderboard', () => ({
  Leaderboard: () => <div data-testid="leaderboard">Leaderboard</div>,
}));
jest.mock('./ScoreHistory', () => ({
  ScoreHistory: () => <div data-testid="score-history">ScoreHistory</div>,
}));

describe('Game', () => {
  const mockMove = jest.fn();
  const mockNewGame = jest.fn();
  const mockContinueGame = jest.fn();

  const defaultGameState: UseGameReturn = {
    tiles: [],
    score: 100,
    bestScore: 200,
    status: 'playing',
    moveCount: 10,
    move: mockMove,
    newGame: mockNewGame,
    continueGame: mockContinueGame,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useGame } = jest.requireMock('../hooks/useGame') as {
      useGame: jest.Mock<() => UseGameReturn>;
    };
    const { useKeyboard } = jest.requireMock('../hooks/useKeyboard') as {
      useKeyboard: jest.Mock;
    };
    useGame.mockReturnValue(defaultGameState);
    useKeyboard.mockReturnValue(undefined);
  });

  it('should render the game container', () => {
    render(<Game />);

    expect(screen.getByTestId('board')).toBeTruthy();
    expect(screen.getByTestId('scoreboard')).toBeTruthy();
    expect(screen.getByTestId('game-controls')).toBeTruthy();
  });

  it('should render reset button', () => {
    render(<Game />);

    const resetButton = screen.getByRole('button', { name: /reset game/i });
    expect(resetButton).toBeTruthy();
    expect(resetButton.textContent).toContain('Reset Game');
  });

  it('should call newGame when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Game />);

    const resetButton = screen.getByRole('button', { name: /reset game/i });
    await user.click(resetButton);

    expect(mockNewGame).toHaveBeenCalledTimes(1);
  });

  it('should render leaderboard button', () => {
    render(<Game />);

    const leaderboardButton = screen.getByRole('button', { name: /leaderboard/i });
    expect(leaderboardButton).toBeTruthy();
    expect(leaderboardButton.textContent).toContain('Leaderboard');
  });

  it('should render score history', () => {
    render(<Game />);

    expect(screen.getByTestId('score-history')).toBeTruthy();
  });
});
