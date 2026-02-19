import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreHistory } from './ScoreHistory';
import * as scoreHistoryUtils from '../utils/scoreHistory';

// Mock the scoreHistory utility functions
jest.mock('../utils/scoreHistory');

describe('ScoreHistory', () => {
  const mockGetScoreHistory = scoreHistoryUtils.getScoreHistory as jest.MockedFunction<
    typeof scoreHistoryUtils.getScoreHistory
  >;
  const mockClearScoreHistory = scoreHistoryUtils.clearScoreHistory as jest.MockedFunction<
    typeof scoreHistoryUtils.clearScoreHistory
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render empty state when no history exists', () => {
    mockGetScoreHistory.mockReturnValue([]);

    render(<ScoreHistory />);

    expect(screen.getByText('No games yet!')).toBeTruthy();
    expect(screen.getByText('Your game history will appear here.')).toBeTruthy();
  });

  it('should not show clear button when history is empty', () => {
    mockGetScoreHistory.mockReturnValue([]);

    render(<ScoreHistory />);

    const clearButton = screen.queryByText('Clear');
    expect(clearButton).toBeNull();
  });

  it('should render history entries', () => {
    const mockEntries = [
      {
        id: '1',
        score: 500,
        date: new Date().toISOString(),
        moves: 25,
        won: false,
      },
      {
        id: '2',
        score: 1024,
        date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        moves: 40,
        won: false,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    render(<ScoreHistory />);

    expect(screen.getByText('500')).toBeTruthy();
    expect(screen.getByText('1,024')).toBeTruthy();
  });

  it('should display move counts for each entry', () => {
    const mockEntries = [
      {
        id: '1',
        score: 500,
        date: new Date().toISOString(),
        moves: 25,
        won: false,
      },
      {
        id: '2',
        score: 1024,
        date: new Date(Date.now() - 3600000).toISOString(),
        moves: 42,
        won: false,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    render(<ScoreHistory />);

    expect(screen.getByText('25 moves')).toBeTruthy();
    expect(screen.getByText('42 moves')).toBeTruthy();
  });

  it('should show trophy emoji for won games', () => {
    const mockEntries = [
      {
        id: '1',
        score: 2048,
        date: new Date().toISOString(),
        moves: 50,
        won: true,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    const { container } = render(<ScoreHistory />);

    expect(screen.getByText('2,048')).toBeTruthy();
    expect(container.querySelector('.score-history-won')).toBeTruthy();
  });

  it('should format dates correctly', () => {
    const now = Date.now();
    const mockEntries = [
      {
        id: '1',
        score: 100,
        date: new Date(now - 30000).toISOString(), // 30 seconds ago
        moves: 10,
        won: false,
      },
      {
        id: '2',
        score: 200,
        date: new Date(now - 3600000).toISOString(), // 1 hour ago
        moves: 20,
        won: false,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    render(<ScoreHistory />);

    expect(screen.getByText('Just now')).toBeTruthy();
    expect(screen.getByText('1h ago')).toBeTruthy();
  });

  it('should show clear button when history exists', () => {
    const mockEntries = [
      {
        id: '1',
        score: 100,
        date: new Date().toISOString(),
        moves: 10,
        won: false,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    render(<ScoreHistory />);

    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('should clear history when clear button clicked and confirmed', async () => {
    const user = userEvent.setup({ delay: null });
    const mockEntries = [
      {
        id: '1',
        score: 100,
        date: new Date().toISOString(),
        moves: 10,
        won: false,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true) as unknown as typeof window.confirm;

    render(<ScoreHistory />);

    const clearButton = screen.getByText('Clear');
    await user.click(clearButton);

    expect(mockClearScoreHistory).toHaveBeenCalled();

    // Restore
    window.confirm = originalConfirm;
  });

  it('should not clear history when clear button clicked and cancelled', async () => {
    const user = userEvent.setup({ delay: null });
    const mockEntries = [
      {
        id: '1',
        score: 100,
        date: new Date().toISOString(),
        moves: 10,
        won: false,
      },
    ];

    mockGetScoreHistory.mockReturnValue(mockEntries);

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false) as unknown as typeof window.confirm;

    render(<ScoreHistory />);

    const clearButton = screen.getByText('Clear');
    await user.click(clearButton);

    expect(mockClearScoreHistory).not.toHaveBeenCalled();

    // Restore
    window.confirm = originalConfirm;
  });

  it('should refresh history periodically', async () => {
    mockGetScoreHistory.mockReturnValue([]);

    render(<ScoreHistory />);

    // Initially called once
    expect(mockGetScoreHistory).toHaveBeenCalledTimes(1);

    // Fast-forward 2 seconds
    jest.advanceTimersByTime(2000);

    // Should be called again
    await waitFor(() => {
      expect(mockGetScoreHistory).toHaveBeenCalledTimes(2);
    });

    // Fast-forward another 2 seconds
    jest.advanceTimersByTime(2000);

    // Should be called a third time
    await waitFor(() => {
      expect(mockGetScoreHistory).toHaveBeenCalledTimes(3);
    });
  });

  it('should render History title', () => {
    mockGetScoreHistory.mockReturnValue([]);

    render(<ScoreHistory />);

    expect(screen.getByText('History')).toBeTruthy();
  });
});
