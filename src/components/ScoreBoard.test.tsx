import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('should render score and best score', () => {
    render(<ScoreBoard score={100} bestScore={200} status="playing" />);

    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('200')).toBeTruthy();
  });

  it('should show win message when status is won', () => {
    render(<ScoreBoard score={2048} bestScore={2048} status="won" />);

    expect(screen.getByText('You Win!')).toBeTruthy();
  });

  it('should show game over message when status is lost', () => {
    render(<ScoreBoard score={500} bestScore={1000} status="lost" />);

    expect(screen.getByText('Game Over!')).toBeTruthy();
  });

  it('should not show message when status is playing', () => {
    render(<ScoreBoard score={100} bestScore={200} status="playing" />);

    expect(screen.queryByText('You Win!')).toBeNull();
    expect(screen.queryByText('Game Over!')).toBeNull();
  });
});
