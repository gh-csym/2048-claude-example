import { useEffect } from 'react';
import type { Direction } from '../types/game';

interface UseKeyboardProps {
  onMove: (direction: Direction) => void;
  enabled?: boolean;
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export const useKeyboard = ({ onMove, enabled = true }: UseKeyboardProps): void => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      const direction = KEY_MAP[event.key];

      if (direction) {
        event.preventDefault();
        onMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove, enabled]);
};
