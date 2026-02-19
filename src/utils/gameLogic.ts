import type { GameState, Direction, Tile } from '../types/game';
import {
  buildGrid,
  getEmptyCells,
  rotateGrid,
  unrotateGrid,
  mergeLine,
  gridToTiles,
} from './tileHelpers';
import { GRID_SIZE, WIN_VALUE } from './constants';

let tileIdCounter = 0;

export const generateTileId = (): string => {
  tileIdCounter += 1;
  return `tile-${tileIdCounter}`;
};

export const addRandomTile = (tiles: Tile[]): Tile[] => {
  const grid = buildGrid(tiles);
  const emptyCells = getEmptyCells(grid);

  if (emptyCells.length === 0) {
    return tiles;
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newTile: Tile = {
    id: generateTileId(),
    value,
    position: randomCell,
    isNew: true,
  };

  return [...tiles, newTile];
};

export const initializeGame = (): GameState => {
  tileIdCounter = 0;
  let tiles: Tile[] = [];
  tiles = addRandomTile(tiles);
  tiles = addRandomTile(tiles);

  return {
    tiles,
    score: 0,
    bestScore: 0,
    status: 'playing',
    moveCount: 0,
  };
};

export const moveTiles = (state: GameState, direction: Direction): GameState => {
  const grid = buildGrid(state.tiles);
  const rotated = rotateGrid(grid, direction);

  let moved = false;
  let scoreGained = 0;
  const newGrid = rotated.map((row) => {
    const tilesInRow = row.filter((cell) => cell !== null) as Tile[];
    const { tiles: mergedTiles, score } = mergeLine(tilesInRow);

    if (score > 0 || tilesInRow.length !== mergedTiles.length) {
      moved = true;
    }

    // Fill the rest with nulls
    const newRow: (Tile | null)[] = [...mergedTiles];
    while (newRow.length < GRID_SIZE) {
      newRow.push(null);
    }

    // Check if tiles moved positions by comparing original row with new row
    if (!moved) {
      for (let i = 0; i < GRID_SIZE; i += 1) {
        const oldTile = row[i];
        const newTile = newRow[i];
        if ((oldTile === null) !== (newTile === null)) {
          moved = true;
          break;
        }
        if (oldTile && newTile && oldTile.id !== newTile.id) {
          moved = true;
          break;
        }
      }
    }

    scoreGained += score;

    return newRow;
  });

  if (!moved) {
    return state;
  }

  const unrotated = unrotateGrid(newGrid, direction);
  let newTiles = gridToTiles(unrotated);

  // Add a new random tile
  newTiles = addRandomTile(newTiles);

  // Remove isNew and isMerged flags from previous tiles, add to new ones
  newTiles = newTiles.map((tile) => ({
    ...tile,
    isNew: tile.isNew || false,
    isMerged: tile.isMerged || false,
  }));

  const newScore = state.score + scoreGained;
  const newBestScore = Math.max(state.bestScore, newScore);

  let newStatus = state.status;
  if (hasWon({ ...state, tiles: newTiles }) && state.status === 'playing') {
    newStatus = 'won';
  } else if (!canMove({ ...state, tiles: newTiles })) {
    newStatus = 'lost';
  }

  return {
    tiles: newTiles,
    score: newScore,
    bestScore: newBestScore,
    status: newStatus,
    moveCount: state.moveCount + 1,
  };
};

export const hasWon = (state: GameState): boolean => {
  return state.tiles.some((tile) => tile.value >= WIN_VALUE);
};

export const canMove = (state: GameState): boolean => {
  const grid = buildGrid(state.tiles);

  // Check for empty cells
  if (getEmptyCells(grid).length > 0) {
    return true;
  }

  // Check for possible merges horizontally
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE - 1; col += 1) {
      const current = grid[row][col];
      const next = grid[row][col + 1];
      if (current && next && current.value === next.value) {
        return true;
      }
    }
  }

  // Check for possible merges vertically
  for (let col = 0; col < GRID_SIZE; col += 1) {
    for (let row = 0; row < GRID_SIZE - 1; row += 1) {
      const current = grid[row][col];
      const next = grid[row + 1][col];
      if (current && next && current.value === next.value) {
        return true;
      }
    }
  }

  return false;
};
