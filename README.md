# 2048 Game - React + TypeScript

A fully functional 2048 game built with React, TypeScript, and Vite. Features smooth animations, responsive design, and comprehensive test coverage.

## Features

- Classic 2048 gameplay with tile merging
- Smooth animations for tile movements and merges
- Score tracking with localStorage persistence
- **Leaderboard system** - Track top 10 scores with automatic saving
- Win/lose detection
- Responsive design (desktop, tablet, mobile)
- Keyboard controls (arrow keys)
- Full TypeScript type safety
- Comprehensive test coverage (>80%)

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Jest** - Testing framework
- **Testing Library** - Component testing
- **CSS3** - Styling and animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint and Prettier

## How to Play

Use the arrow keys on your keyboard to move tiles:
- **↑** Move up
- **↓** Move down
- **←** Move left
- **→** Move right

When two tiles with the same number touch, they merge into one! The goal is to reach the 2048 tile.

## Project Structure

```
src/
├── components/       # React components
│   ├── Board.tsx    # Game board grid
│   ├── Tile.tsx     # Individual tile
│   ├── ScoreBoard.tsx # Score display
│   ├── GameControls.tsx # Game controls
│   └── Game.tsx     # Main game component
├── hooks/           # Custom React hooks
│   ├── useGame.ts   # Game state management
│   └── useKeyboard.ts # Keyboard event handling
├── utils/           # Utility functions
│   ├── gameLogic.ts # Core game logic
│   ├── tileHelpers.ts # Grid manipulation
│   └── constants.ts # Game constants
├── types/           # TypeScript type definitions
│   └── game.ts
└── App.tsx          # Root component
```

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

Test coverage includes:
- Unit tests for game logic utilities
- Hook tests for state management
- Component tests for UI elements

## Architecture

### Game Logic

The game uses a reducer pattern for state management:
- All movements are normalized to "left" direction using grid rotation
- Tiles are merged using a line-merge algorithm
- State updates are immutable and predictable

### Component Hierarchy

```
App
└── Game (state management)
    ├── GameControls (new game, instructions)
    ├── ScoreBoard (scores, game status)
    └── Board (grid and tiles)
        └── Tile[] (individual tiles with animations)
```

### Key Algorithms

1. **Movement**: Rotate grid → merge lines → rotate back → add random tile
2. **Merging**: Slide tiles left, combine adjacent equal values
3. **Win/Lose Detection**: Check for 2048 tile or no valid moves

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

Inspired by the original [2048 game](https://github.com/gabrielecirulli/2048) by Gabriele Cirulli.
