import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameControls } from './GameControls';

describe('GameControls', () => {
  it('should render game title', () => {
    const onNewGame = jest.fn();
    const onContinue = jest.fn();

    render(<GameControls status="playing" onNewGame={onNewGame} onContinue={onContinue} />);

    expect(screen.getByText('2048')).toBeTruthy();
  });

  it('should render new game button', () => {
    const onNewGame = jest.fn();
    const onContinue = jest.fn();

    render(<GameControls status="playing" onNewGame={onNewGame} onContinue={onContinue} />);

    expect(screen.getByText('New Game')).toBeTruthy();
  });

  it('should call onNewGame when button is clicked', async () => {
    const user = userEvent.setup();
    const onNewGame = jest.fn();
    const onContinue = jest.fn();

    render(<GameControls status="playing" onNewGame={onNewGame} onContinue={onContinue} />);

    await user.click(screen.getByText('New Game'));

    expect(onNewGame).toHaveBeenCalledTimes(1);
  });

  it('should show continue button when status is won', () => {
    const onNewGame = jest.fn();
    const onContinue = jest.fn();

    render(<GameControls status="won" onNewGame={onNewGame} onContinue={onContinue} />);

    expect(screen.getByText('Keep Playing')).toBeTruthy();
  });

  it('should call onContinue when continue button is clicked', async () => {
    const user = userEvent.setup();
    const onNewGame = jest.fn();
    const onContinue = jest.fn();

    render(<GameControls status="won" onNewGame={onNewGame} onContinue={onContinue} />);

    await user.click(screen.getByText('Keep Playing'));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('should render instructions', () => {
    const onNewGame = jest.fn();
    const onContinue = jest.fn();

    render(<GameControls status="playing" onNewGame={onNewGame} onContinue={onContinue} />);

    expect(screen.getByText(/How to play:/i)).toBeTruthy();
  });
});
