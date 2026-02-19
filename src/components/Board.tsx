import React from 'react';
import type { Tile as TileType } from '../types/game';
import { Tile } from './Tile';
import { GRID_SIZE } from '../utils/constants';
import './Board.css';

interface BoardProps {
  tiles: TileType[];
}

export const Board: React.FC<BoardProps> = ({ tiles }) => {
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  return (
    <div className="board">
      <div className="grid-container">
        {gridCells.map((_, index) => (
          <div key={index} className="grid-cell" />
        ))}
      </div>
      <div className="tiles-container">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};
