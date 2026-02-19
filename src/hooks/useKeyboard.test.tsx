import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useKeyboard } from './useKeyboard';

describe('useKeyboard', () => {
  it('should call onMove with correct direction on arrow key press', () => {
    const onMove = jest.fn();
    renderHook(() => useKeyboard({ onMove }));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(onMove).toHaveBeenCalledWith('up');
  });

  it('should handle all arrow keys', () => {
    const onMove = jest.fn();
    renderHook(() => useKeyboard({ onMove }));

    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach((key) => {
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
    });

    expect(onMove).toHaveBeenCalledTimes(4);
  });

  it('should not call onMove when disabled', () => {
    const onMove = jest.fn();
    renderHook(() => useKeyboard({ onMove, enabled: false }));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(onMove).not.toHaveBeenCalled();
  });

  it('should clean up event listener on unmount', () => {
    const onMove = jest.fn();
    const { unmount } = renderHook(() => useKeyboard({ onMove }));

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(onMove).not.toHaveBeenCalled();
  });
});
