import React from 'react';
import type { Tile as TileType } from '../types/game';
import { TILE_COLORS, TILE_TEXT_COLORS } from '../utils/constants';
import './Tile.css';

interface TileProps {
  tile: TileType;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
  const { value, position, isNew, isMerged } = tile;
  const backgroundColor = TILE_COLORS[value] || '#cdc1b4';
  const textColor = TILE_TEXT_COLORS[value] || '#776e65';

  const style = {
    '--tile-row': position.row,
    '--tile-col': position.col,
    backgroundColor,
    color: textColor,
  } as React.CSSProperties;

  const className = `tile tile-${value}${isNew ? ' tile-new' : ''}${isMerged ? ' tile-merged' : ''}`;

  return (
    <div className={className} style={style}>
      <div className="tile-inner">{value}</div>
    </div>
  );
};
