import { describe, expect, it } from '@jest/globals';
import { initializeGame, moveTiles, canMove, hasWon, addRandomTile } from './gameLogic';
import type { Tile } from '../types/game';

describe('gameLogic', () => {
  describe('initializeGame', () => {
    it('should create initial state with 2 tiles', () => {
      const state = initializeGame();
      expect(state.tiles).toHaveLength(2);
      expect(state.score).toBe(0);
      expect(state.bestScore).toBe(0);
      expect(state.status).toBe('playing');
      expect(state.moveCount).toBe(0);
    });

    it('should place tiles with value 2 or 4', () => {
      const state = initializeGame();
      state.tiles.forEach((tile) => {
        expect([2, 4]).toContain(tile.value);
      });
    });
  });

  describe('addRandomTile', () => {
    it('should add a tile to empty position', () => {
      const tiles: Tile[] = [{ id: '1', value: 2, position: { row: 0, col: 0 } }];
      const newTiles = addRandomTile(tiles);
      expect(newTiles.length).toBeGreaterThan(tiles.length);
    });

    it('should not add tile when grid is full', () => {
      const tiles: Tile[] = [];
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          tiles.push({ id: `${row}-${col}`, value: 2, position: { row, col } });
        }
      }
      const newTiles = addRandomTile(tiles);
      expect(newTiles).toHaveLength(16);
    });
  });

  describe('moveTiles', () => {
    it('should not change state when no movement possible', () => {
      const state = {
        tiles: [{ id: '1', value: 2, position: { row: 0, col: 0 } }],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      const newState = moveTiles(state, 'left');
      expect(newState.tiles).toHaveLength(1);
      expect(newState.moveCount).toBe(0);
    });

    it('should move tiles left', () => {
      const state = {
        tiles: [{ id: '1', value: 2, position: { row: 0, col: 2 } }],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      const newState = moveTiles(state, 'left');
      const movedTile = newState.tiles.find((t) => t.id === '1');
      expect(movedTile?.position.col).toBe(0);
      expect(newState.moveCount).toBe(1);
    });

    it('should merge tiles and increase score', () => {
      const state = {
        tiles: [
          { id: '1', value: 2, position: { row: 0, col: 0 } },
          { id: '2', value: 2, position: { row: 0, col: 1 } },
        ],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      const newState = moveTiles(state, 'left');
      expect(newState.score).toBe(4);
      expect(newState.tiles.some((t) => t.value === 4)).toBe(true);
    });

    it('should add new tile after successful move', () => {
      const state = {
        tiles: [{ id: '1', value: 2, position: { row: 0, col: 2 } }],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      const newState = moveTiles(state, 'left');
      // Should have moved the tile plus added a new one
      expect(newState.tiles).toHaveLength(2);
      expect(newState.tiles.some((t) => t.id !== '1')).toBe(true);
    });

    it('should update best score', () => {
      const state = {
        tiles: [
          { id: '1', value: 2, position: { row: 0, col: 0 } },
          { id: '2', value: 2, position: { row: 0, col: 1 } },
        ],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      const newState = moveTiles(state, 'left');
      expect(newState.bestScore).toBe(4);
    });
  });

  describe('hasWon', () => {
    it('should return true when 2048 tile exists', () => {
      const state = {
        tiles: [{ id: '1', value: 2048, position: { row: 0, col: 0 } }],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      expect(hasWon(state)).toBe(true);
    });

    it('should return false when no 2048 tile', () => {
      const state = {
        tiles: [{ id: '1', value: 1024, position: { row: 0, col: 0 } }],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      expect(hasWon(state)).toBe(false);
    });
  });

  describe('canMove', () => {
    it('should return true when empty cells exist', () => {
      const state = {
        tiles: [{ id: '1', value: 2, position: { row: 0, col: 0 } }],
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      expect(canMove(state)).toBe(true);
    });

    it('should return true when adjacent tiles can merge', () => {
      const tiles: Tile[] = [];
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          tiles.push({ id: `${row}-${col}`, value: 2, position: { row, col } });
        }
      }
      const state = {
        tiles,
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      expect(canMove(state)).toBe(true);
    });

    it('should return false when grid is full and no merges possible', () => {
      const tiles: Tile[] = [
        { id: '0-0', value: 2, position: { row: 0, col: 0 } },
        { id: '0-1', value: 4, position: { row: 0, col: 1 } },
        { id: '0-2', value: 2, position: { row: 0, col: 2 } },
        { id: '0-3', value: 4, position: { row: 0, col: 3 } },
        { id: '1-0', value: 4, position: { row: 1, col: 0 } },
        { id: '1-1', value: 2, position: { row: 1, col: 1 } },
        { id: '1-2', value: 4, position: { row: 1, col: 2 } },
        { id: '1-3', value: 2, position: { row: 1, col: 3 } },
        { id: '2-0', value: 2, position: { row: 2, col: 0 } },
        { id: '2-1', value: 4, position: { row: 2, col: 1 } },
        { id: '2-2', value: 2, position: { row: 2, col: 2 } },
        { id: '2-3', value: 4, position: { row: 2, col: 3 } },
        { id: '3-0', value: 4, position: { row: 3, col: 0 } },
        { id: '3-1', value: 2, position: { row: 3, col: 1 } },
        { id: '3-2', value: 4, position: { row: 3, col: 2 } },
        { id: '3-3', value: 2, position: { row: 3, col: 3 } },
      ];
      const state = {
        tiles,
        score: 0,
        bestScore: 0,
        status: 'playing' as const,
        moveCount: 0,
      };
      expect(canMove(state)).toBe(false);
    });
  });
});
