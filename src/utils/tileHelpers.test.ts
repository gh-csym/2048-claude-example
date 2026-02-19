import { describe, expect, it } from '@jest/globals';
import { buildGrid, mergeLine, getEmptyCells, rotateGrid } from './tileHelpers';
import type { Tile } from '../types/game';

describe('tileHelpers', () => {
  describe('buildGrid', () => {
    it('should create an empty 4x4 grid when no tiles', () => {
      const grid = buildGrid([]);
      expect(grid).toHaveLength(4);
      expect(grid[0]).toHaveLength(4);
      expect(grid.flat().every((cell) => cell === null)).toBe(true);
    });

    it('should place tiles in correct positions', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 4, position: { row: 1, col: 2 } },
      ];
      const grid = buildGrid(tiles);
      expect(grid[0][0]).toEqual(tiles[0]);
      expect(grid[1][2]).toEqual(tiles[1]);
    });
  });

  describe('mergeLine', () => {
    it('should return empty array for empty line', () => {
      const result = mergeLine([]);
      expect(result.tiles).toEqual([]);
      expect(result.score).toBe(0);
    });

    it('should merge two identical tiles', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 2, position: { row: 0, col: 1 } },
      ];
      const result = mergeLine(tiles);
      expect(result.tiles).toHaveLength(1);
      expect(result.tiles[0].value).toBe(4);
      expect(result.tiles[0].isMerged).toBe(true);
      expect(result.score).toBe(4);
    });

    it('should not merge different tiles', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 4, position: { row: 0, col: 1 } },
      ];
      const result = mergeLine(tiles);
      expect(result.tiles).toHaveLength(2);
      expect(result.score).toBe(0);
    });

    it('should merge multiple pairs: [2,2,2,2] -> [4,4]', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 2, position: { row: 0, col: 1 } },
        { id: '3', value: 2, position: { row: 0, col: 2 } },
        { id: '4', value: 2, position: { row: 0, col: 3 } },
      ];
      const result = mergeLine(tiles);
      expect(result.tiles).toHaveLength(2);
      expect(result.tiles[0].value).toBe(4);
      expect(result.tiles[1].value).toBe(4);
      expect(result.score).toBe(8);
    });

    it('should merge only first pair: [2,2,4] -> [4,4]', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 2, position: { row: 0, col: 1 } },
        { id: '3', value: 4, position: { row: 0, col: 2 } },
      ];
      const result = mergeLine(tiles);
      expect(result.tiles).toHaveLength(2);
      expect(result.tiles[0].value).toBe(4);
      expect(result.tiles[0].isMerged).toBe(true);
      expect(result.tiles[1].value).toBe(4);
      expect(result.tiles[1].isMerged).toBeFalsy();
      expect(result.score).toBe(4);
    });
  });

  describe('getEmptyCells', () => {
    it('should return all cells for empty grid', () => {
      const grid = buildGrid([]);
      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(16);
    });

    it('should return empty positions only', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 4, position: { row: 1, col: 1 } },
      ];
      const grid = buildGrid(tiles);
      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(14);
      expect(emptyCells.every((pos) => !(pos.row === 0 && pos.col === 0))).toBe(true);
      expect(emptyCells.every((pos) => !(pos.row === 1 && pos.col === 1))).toBe(true);
    });
  });

  describe('rotateGrid', () => {
    it('should not rotate for left direction', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { row: 0, col: 0 } },
        { id: '2', value: 4, position: { row: 0, col: 3 } },
      ];
      const grid = buildGrid(tiles);
      const rotated = rotateGrid(grid, 'left');
      expect(rotated[0][0]?.value).toBe(2);
      expect(rotated[0][3]?.value).toBe(4);
    });

    it('should rotate 180 degrees for right direction', () => {
      const tiles: Tile[] = [{ id: '1', value: 2, position: { row: 0, col: 0 } }];
      const grid = buildGrid(tiles);
      const rotated = rotateGrid(grid, 'right');
      expect(rotated[3][3]?.value).toBe(2);
    });

    it('should rotate 90 degrees clockwise for up direction', () => {
      const tiles: Tile[] = [{ id: '1', value: 2, position: { row: 0, col: 0 } }];
      const grid = buildGrid(tiles);
      const rotated = rotateGrid(grid, 'up');
      expect(rotated[0][3]?.value).toBe(2);
    });

    it('should rotate 90 degrees counter-clockwise for down direction', () => {
      const tiles: Tile[] = [{ id: '1', value: 2, position: { row: 0, col: 0 } }];
      const grid = buildGrid(tiles);
      const rotated = rotateGrid(grid, 'down');
      expect(rotated[3][0]?.value).toBe(2);
    });
  });
});
