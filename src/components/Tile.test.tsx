import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Tile } from './Tile';
import type { Tile as TileType } from '../types/game';

describe('Tile', () => {
  it('should render tile with correct value', () => {
    const tile: TileType = {
      id: '1',
      value: 2,
      position: { row: 0, col: 0 },
    };

    render(<Tile tile={tile} />);

    expect(screen.getByText('2')).toBeTruthy();
  });

  it('should apply correct CSS classes for new tile', () => {
    const tile: TileType = {
      id: '1',
      value: 4,
      position: { row: 1, col: 1 },
      isNew: true,
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('.tile-new');

    expect(tileElement).toBeTruthy();
  });

  it('should apply correct CSS classes for merged tile', () => {
    const tile: TileType = {
      id: '1',
      value: 8,
      position: { row: 2, col: 2 },
      isMerged: true,
    };

    const { container } = render(<Tile tile={tile} />);
    const tileElement = container.querySelector('.tile-merged');

    expect(tileElement).toBeTruthy();
  });

  it('should render tile with large value', () => {
    const tile: TileType = {
      id: '1',
      value: 2048,
      position: { row: 3, col: 3 },
    };

    render(<Tile tile={tile} />);

    expect(screen.getByText('2048')).toBeTruthy();
  });
});
