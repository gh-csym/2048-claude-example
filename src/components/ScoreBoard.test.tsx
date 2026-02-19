import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('should render score and best score', () => {
    render(<ScoreBoard score={100} bestScore={200} status="playing" moveCount={5} />);

    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('200')).toBeTruthy();
  });

  it('should render move count', () => {
    render(<ScoreBoard score={100} bestScore={200} status="playing" moveCount={42} />);

    expect(screen.getByText('MOVES')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('should show win message when status is won', () => {
    render(<ScoreBoard score={2048} bestScore={2048} status="won" moveCount={100} />);

    expect(screen.getByText('You Win!')).toBeTruthy();
  });

  it('should show game over message when status is lost', () => {
    render(<ScoreBoard score={500} bestScore={1000} status="lost" moveCount={50} />);

    expect(screen.getByText('Game Over!')).toBeTruthy();
  });

  it('should not show message when status is playing', () => {
    render(<ScoreBoard score={100} bestScore={200} status="playing" moveCount={10} />);

    expect(screen.queryByText('You Win!')).toBeNull();
    expect(screen.queryByText('Game Over!')).toBeNull();
  });
});
