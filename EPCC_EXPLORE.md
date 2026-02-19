# Exploration: 2048 React Game

**Date**: 2026-02-19 | **Scope**: Medium | **Status**: ✅ Complete

## 1. Foundation (What exists)

**Tech stack**:
- React 19.2.0 (latest) with TypeScript 5.9.3
- Vite 7.3.1 (build tool & dev server)
- Jest 30.2.0 + Testing Library (testing)
- ESLint + Prettier (code quality)

**Architecture**: React SPA with custom hooks for state management (useReducer pattern)

**Structure**:
```
src/
├── components/     7 React components + 1 index barrel export
├── hooks/          2 custom hooks (useGame, useKeyboard)
├── utils/          4 utility modules (gameLogic, tileHelpers, leaderboard, constants)
├── types/          1 TypeScript definitions file
├── App.tsx         Root component (simple wrapper)
└── main.tsx        Entry point with StrictMode
```

**CLAUDE.md instructions** (from /workshop/CLAUDE.md):
- ✅ MANDATORY: Write unit tests for ALL new components and utilities
- ✅ MANDATORY: Always include error handling in async functions
- ✅ MANDATORY: TypeCheck after making code changes (`npm run typecheck`)
- Code style: Airbnb + Prettier, arrow functions, destructured imports
- Test strategy: Prefer single test runs over full suite for performance
- Port: Always use 3000 (configured in vite.config.ts:8)
- Server: Allow testing from `https://*.cloudfront.net/` (configured in vite.config.ts:10)

## 2. Patterns (How it's built)

### Architectural Patterns

**State Management - useReducer Pattern** (src/hooks/useGame.ts:14-44):
- Redux-style reducer for game state
- Actions: MOVE, NEW_GAME, CONTINUE, LOAD_BEST_SCORE
- Pure reducer function with immutable updates
- When to use: Complex state logic with multiple action types

**Grid Rotation Algorithm** (src/utils/tileHelpers.ts:69-106):
- Normalizes all directions to "left" by rotating grid
- Applies merge logic in one direction only
- Unrotates result back to original orientation
- Reduces code duplication (4 directions → 1 algorithm)
- When to use: Algorithm applies to 2D array in any direction

**Component Composition** (src/components/Game.tsx:10-31):
- Parent component (Game) coordinates multiple child components
- Unidirectional data flow from hooks to components
- Separation of concerns: Board (display), ScoreBoard (status), GameControls (actions)

**Custom Hooks Pattern**:
- `useGame` (src/hooks/useGame.ts): Encapsulates game state + localStorage persistence
- `useKeyboard` (src/hooks/useKeyboard.ts): Isolates keyboard event handling with cleanup
- Both use proper effect cleanup (return cleanup function)

**Barrel Export Pattern** (src/components/index.ts:1-8):
- Single import point for all components
- Usage: `import { Board, Game } from './components'`

### Testing Patterns

**Framework**: Jest 30.2.0 with ts-jest, jsdom environment

**Test structure**:
- Import pattern: `import { describe, expect, it } from '@jest/globals'` (src/utils/gameLogic.test.ts:1)
- Nested describe blocks for logical grouping
- Clear test names: "should [expected behavior]"

**Component testing**:
- Testing Library: `render`, `screen`, `renderHook`, `act` (src/components/Board.test.tsx:2)
- Query methods: `screen.getByText()`, `container.querySelector()`
- Hook testing: `renderHook()` + `act()` for state updates (src/hooks/useGame.test.tsx:15-19)

**localStorage mocking**:
- `beforeEach`/`afterEach` to clear localStorage (src/hooks/useGame.test.tsx:6-12)
- Tests localStorage persistence across hook remounts (src/hooks/useGame.test.tsx:50-65)

**Coverage**:
- Target: 80% (branches, functions, lines, statements) - enforced in jest.config.js:13-19
- Current: 11 test files cover core logic
- Excludes: main.tsx, *.d.ts files (jest.config.js:10-11)

**CSS mocking**: identity-obj-proxy for CSS imports (jest.config.js:23)

### Error Handling

**Try-catch with console.error** (src/hooks/useGame.ts:71-73):
```typescript
try {
  // localStorage operation
} catch (error) {
  console.error('Failed to [operation]:', error);
}
```
- Used consistently across localStorage operations
- Used in leaderboard utils (src/utils/leaderboard.ts:10-20, 26-42, 48-53)
- Graceful degradation - app continues if localStorage fails

**Null checks** (src/main.tsx:8-10):
```typescript
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
```

**Optional event cleanup** (src/hooks/useKeyboard.ts:18-19):
```typescript
if (!enabled) {
  return undefined; // Effect cleanup not needed
}
```

## 3. Constraints (What limits decisions)

### Technical

**Language**: TypeScript 5.9.3 with strict mode (project references in tsconfig.json)
- Strict type checking enforced
- No implicit any, strict null checks

**Browser**: Modern browsers only (ES2022, CSS Grid, CSS custom properties)
- Vite target: ES modules
- No IE11 support needed

**React version**: 19.2.0 (latest, February 2026)
- Uses new React 19 features
- No legacy JSX transform needed (eslintrc.cjs:27-28)

### Quality Gates

**Pre-commit checks** (from CLAUDE.md):
1. `npm run typecheck` - TypeScript compiler check (MANDATORY)
2. `npm run lint` - ESLint + Prettier (package.json:10)
3. `npm run test` - All tests must pass
4. Coverage must meet 80% threshold (jest.config.js:14-19)

**ESLint rules** (.eslintrc.cjs:26-31):
- Airbnb + Airbnb TypeScript base
- Prettier integration (errors on format violations)
- No console.log (only warn/error allowed)
- Named exports preferred over default

### Security

**localStorage usage**:
- Two keys: `2048-best-score`, `2048-leaderboard` (src/hooks/useGame.ts:12, src/utils/leaderboard.ts:3)
- No sensitive data stored
- Input validation: `parseInt()` with `isNaN()` check (src/hooks/useGame.ts:66-68)
- JSON.parse wrapped in try-catch (src/utils/leaderboard.ts:15)

**No external APIs**: Fully client-side game, no network requests

**Input sanitization**: Arrow key input from known key map only (src/hooks/useKeyboard.ts:9-14)

### Operational

**Development server**: Port 3000, allows cloudfront.net hosts (vite.config.ts:7-11)
**Build**: TypeScript compilation + Vite bundling (package.json:8)
**No CI/CD configuration**: No .github/workflows or similar
**No Docker**: Direct Node.js execution

## 4. Reusability (What to leverage)

### Core Game Logic (Pure Functions)

**Grid manipulation** (src/utils/tileHelpers.ts):
- `buildGrid(tiles)` - Convert tile array to 2D grid
- `getEmptyCells(grid)` - Find available positions
- `rotateGrid(grid, direction)` - Transform for any direction
- `unrotateGrid(grid, direction)` - Reverse transformation
- `mergeLine(tiles)` - Combine adjacent equal tiles
- `gridToTiles(grid)` - Convert back to tile array
- All pure, testable, reusable for similar grid games

**State management pattern** (src/hooks/useGame.ts):
- Reducer pattern with localStorage persistence
- Can be adapted for other games needing save/load
- Pattern: state in reducer + side effects in useEffect

### Reusable Components

**Modal component** (src/components/Modal.tsx) - confirmed exists from file list
- Likely a generic overlay/dialog
- Can be reused for any popup (settings, help, leaderboard)

**Leaderboard system** (src/utils/leaderboard.ts):
- Generic top-N scoring system
- Can be adapted for any score-based game
- Functions: getLeaderboard(), addLeaderboardEntry(), clearLeaderboard(), isLeaderboardScore()

### Testing Utilities

**localStorage test pattern** (src/hooks/useGame.test.tsx:6-12):
```typescript
beforeEach(() => { localStorage.clear(); });
afterEach(() => { localStorage.clear(); });
```
- Prevents test pollution
- Reusable for any localStorage-dependent code

**Hook testing pattern** (src/hooks/useGame.test.tsx:14-19):
```typescript
const { result } = renderHook(() => useGame());
act(() => {
  result.current.move('left');
});
expect(result.current.tiles.length).toBeGreaterThanOrEqual(2);
```

## 5. Handoff (What's next)

### For PLAN Phase

**Existing patterns to follow**:
- All new state management: Use useReducer pattern (see useGame.ts)
- All grid operations: Use pure functions (see tileHelpers.ts)
- All persistence: Use try-catch with console.error (see leaderboard.ts)
- Component composition: Follow Game.tsx structure (hooks at top, JSX at bottom)

**Key constraints**:
- MUST write tests for new code (80% coverage required)
- MUST use TypeScript strict mode (no any, proper types)
- MUST follow Airbnb style guide (enforced by ESLint)
- MUST use arrow functions for components (CLAUDE.md:14)
- MUST destructure imports (CLAUDE.md:13)

**Naming conventions**:
- Components: PascalCase with named exports (Board.tsx → export const Board)
- Hooks: camelCase starting with "use" (useGame.ts)
- Utils: camelCase (gameLogic.ts)
- Types: PascalCase interfaces (Tile, Position, GameState)
- Test files: Same name + .test.ts(x) suffix

### For CODE Phase

**Development commands**:
```bash
npm run dev         # Start dev server (port 3000)
npm run test        # Run all tests
npm test -- [file]  # Run single test file (preferred per CLAUDE.md)
npm run typecheck   # Run after code changes (MANDATORY)
npm run lint        # Check style compliance
npm run build       # Production build
```

**File creation rules**:
1. New component? → Create in src/components/ + export from index.ts
2. New utility? → Create in src/utils/ with descriptive name
3. New hook? → Create in src/hooks/ with "use" prefix
4. New type? → Add to src/types/game.ts (single source of truth)

**Testing requirements**:
- Unit test: Every new util function (see gameLogic.test.ts for examples)
- Component test: Every new component (see Board.test.tsx for examples)
- Hook test: Every new hook (see useGame.test.tsx for examples)
- Must use @jest/globals imports (not default jest globals)

### For COMMIT Phase

**Quality gates to pass**:
1. `npm run typecheck` → Must exit 0
2. `npm run lint` → Must exit 0 (no warnings)
3. `npm test` → All tests pass + 80% coverage maintained
4. No console.log statements (only console.error/warn allowed)

**Security checks**:
- No localStorage of sensitive data (only game state/scores)
- All JSON.parse wrapped in try-catch
- All user input validated (key map, parseInt with isNaN check)

**Documentation updates**:
- README.md: Update if adding major features
- LEADERBOARD.md: Exists but not explored (may need updates)

### Gaps

**Not explored** (exist but not examined in detail):
- CSS files: All .css files in components/ (styling patterns unknown)
- Modal component implementation: Only confirmed existence
- GameControls.test.tsx, ScoreBoard.test.tsx: Test patterns for these
- LEADERBOARD.md: Purpose and content unknown
- Coverage report: Actual coverage percentage not checked

**Unclear areas**:
- Tile animations: CSS-based or JavaScript? (Tile.tsx uses classes but mechanism not explored)
- CSS custom properties usage: Tile.tsx uses `--tile-row`, `--tile-col` (src/components/Tile.tsx:16-17)
- Mobile touch support: No touch handlers found (keyboard only)

**Potential improvements** (not requirements, just observations):
- No undo/redo functionality
- No save/load game state (only best score persists)
- No animation configuration (speeds hardcoded in CSS)
- Limited to 4x4 grid (GRID_SIZE constant but not configurable at runtime)

---

## Summary Statistics

**Files explored**: 17 source files, 11 test files, 4 config files (32 total)
**Test coverage**: 11/17 source modules have tests (65% file coverage)
**Components**: 7 components (6 have tests = 86% component coverage)
**Hooks**: 2 hooks (2 have tests = 100% hook coverage)
**Utils**: 3 utils (3 have tests = 100% util coverage)

**Exploration time**: ~15 minutes (17 file reads + 7 bash commands)

**Recommended next phase**: `/epcc-plan [feature-name]` based on user requirements
