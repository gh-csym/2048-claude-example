import type { Tile, Direction, Position } from '../types/game';
import { GRID_SIZE } from './constants';

export type Grid = (Tile | null)[][];

export const buildGrid = (tiles: Tile[]): Grid => {
  const grid: Grid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

  tiles.forEach((tile) => {
    grid[tile.position.row][tile.position.col] = tile;
  });

  return grid;
};

export const mergeLine = (
  tiles: Tile[]
): {
  tiles: Tile[];
  score: number;
} => {
  if (tiles.length === 0) {
    return { tiles: [], score: 0 };
  }

  const merged: Tile[] = [];
  let score = 0;
  let i = 0;

  while (i < tiles.length) {
    const current = tiles[i];

    // Check if we can merge with the next tile
    if (i + 1 < tiles.length && current.value === tiles[i + 1].value) {
      const newValue = current.value * 2;
      merged.push({
        id: `${current.id}-${tiles[i + 1].id}`,
        value: newValue,
        position: current.position,
        isMerged: true,
      });
      score += newValue;
      i += 2; // Skip both tiles
    } else {
      merged.push({ ...current });
      i += 1;
    }
  }

  return { tiles: merged, score };
};

export const getEmptyCells = (grid: Grid): Position[] => {
  const emptyCells: Position[] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (grid[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  return emptyCells;
};

export const rotateGrid = (grid: Grid, direction: Direction): Grid => {
  const size = GRID_SIZE;

  if (direction === 'left') {
    // No rotation needed
    return grid;
  }

  if (direction === 'right') {
    // Rotate 180 degrees
    return grid.map((row) => [...row].reverse()).reverse();
  }

  if (direction === 'up') {
    // Rotate 90 degrees clockwise
    const rotated: Grid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        rotated[col][size - 1 - row] = grid[row][col];
      }
    }
    return rotated;
  }

  // direction === 'down'
  // Rotate 90 degrees counter-clockwise
  const rotated: Grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      rotated[size - 1 - col][row] = grid[row][col];
    }
  }
  return rotated;
};

export const unrotateGrid = (grid: Grid, direction: Direction): Grid => {
  if (direction === 'left') {
    return grid;
  }

  if (direction === 'right') {
    // Rotate 180 degrees back
    return grid.map((row) => [...row].reverse()).reverse();
  }

  if (direction === 'up') {
    // Rotate 90 degrees counter-clockwise (reverse of clockwise)
    const size = GRID_SIZE;
    const unrotated: Grid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        unrotated[row][col] = grid[col][size - 1 - row];
      }
    }
    return unrotated;
  }

  // direction === 'down'
  // Rotate 90 degrees clockwise (reverse of counter-clockwise)
  const size = GRID_SIZE;
  const unrotated: Grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      unrotated[row][col] = grid[size - 1 - col][row];
    }
  }
  return unrotated;
};

export const gridToTiles = (grid: Grid): Tile[] => {
  const tiles: Tile[] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const tile = grid[row][col];
      if (tile !== null) {
        tiles.push({
          ...tile,
          position: { row, col },
        });
      }
    }
  }

  return tiles;
};
