import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Leaderboard } from './Leaderboard';
import { addLeaderboardEntry } from '../utils/leaderboard';

describe('Leaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should not render when isOpen is false', () => {
    const onClose = jest.fn();
    const { container } = render(<Leaderboard isOpen={false} onClose={onClose} />);

    expect(container.firstChild).toBeNull();
  });

  it('should show empty state when no entries', () => {
    const onClose = jest.fn();
    render(<Leaderboard isOpen onClose={onClose} />);

    expect(screen.getByText('No scores yet!')).toBeTruthy();
  });

  it('should display leaderboard entries', () => {
    addLeaderboardEntry(1000, 50);
    addLeaderboardEntry(2000, 40);

    const onClose = jest.fn();
    render(<Leaderboard isOpen onClose={onClose} />);

    expect(screen.getByText('2,000')).toBeTruthy();
    expect(screen.getByText('1,000')).toBeTruthy();
  });

  it('should show medal emojis for top 3', () => {
    addLeaderboardEntry(1000, 50);
    addLeaderboardEntry(2000, 40);
    addLeaderboardEntry(1500, 45);

    const onClose = jest.fn();
    render(<Leaderboard isOpen onClose={onClose} />);

    expect(screen.getByText('🥇')).toBeTruthy();
    expect(screen.getByText('🥈')).toBeTruthy();
    expect(screen.getByText('🥉')).toBeTruthy();
  });

  it('should show clear button when entries exist', () => {
    addLeaderboardEntry(1000, 50);

    const onClose = jest.fn();
    render(<Leaderboard isOpen onClose={onClose} />);

    expect(screen.getByText('Clear Leaderboard')).toBeTruthy();
  });

  it('should not show clear button when no entries', () => {
    const onClose = jest.fn();
    render(<Leaderboard isOpen onClose={onClose} />);

    expect(screen.queryByText('Clear Leaderboard')).toBeNull();
  });

  it('should clear leaderboard when confirmed', async () => {
    const user = userEvent.setup();
    addLeaderboardEntry(1000, 50);

    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true) as unknown as typeof window.confirm;

    const onClose = jest.fn();
    const { rerender } = render(<Leaderboard isOpen onClose={onClose} />);

    const clearButton = screen.getByText('Clear Leaderboard');
    await user.click(clearButton);

    // Re-render to see the updated state
    rerender(<Leaderboard isOpen onClose={onClose} />);

    expect(screen.getByText('No scores yet!')).toBeTruthy();

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should not clear leaderboard when cancelled', async () => {
    const user = userEvent.setup();
    addLeaderboardEntry(1000, 50);

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false) as unknown as typeof window.confirm;

    const onClose = jest.fn();
    render(<Leaderboard isOpen onClose={onClose} />);

    const clearButton = screen.getByText('Clear Leaderboard');
    await user.click(clearButton);

    expect(screen.getByText('1,000')).toBeTruthy();

    // Restore original confirm
    window.confirm = originalConfirm;
  });
});
