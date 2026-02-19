import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import type { Tile } from '../types/game';

describe('Board', () => {
  it('should render empty board with grid cells', () => {
    const { container } = render(<Board tiles={[]} />);
    const gridCells = container.querySelectorAll('.grid-cell');

    expect(gridCells).toHaveLength(16);
  });

  it('should render board with tiles', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, position: { row: 0, col: 0 } },
      { id: '2', value: 4, position: { row: 1, col: 1 } },
    ];

    render(<Board tiles={tiles} />);

    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('should render board container', () => {
    const { container } = render(<Board tiles={[]} />);
    const board = container.querySelector('.board');

    expect(board).toBeTruthy();
  });
});
