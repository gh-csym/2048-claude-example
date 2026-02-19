# Plan: Score History Sidebar

**Created**: 2026-02-19 | **Effort**: 6-8h | **Complexity**: Medium

## 1. Objective

**Goal**: Add an always-visible sidebar that displays complete game history chronologically

**Why**: Players can track their progress over time and see all games played (not just top 10), providing better engagement and motivation

**Success**:
- Sidebar displays all previous games with score and date
- History persists in localStorage across sessions
- Sidebar is always visible and doesn't break existing UI
- Full test coverage (≥80%) maintained
- No regressions to existing leaderboard functionality

## 2. Approach

**High-level architecture**: Add sidebar component alongside existing game board, create separate localStorage storage for full history

**From EPCC_EXPLORE.md**:
- Follow localStorage pattern with try-catch + console.error (src/utils/leaderboard.ts:10-20)
- Use pure functions for data operations (src/utils/ pattern)
- Create React component with named export (src/components/ pattern)
- Add to barrel export (src/components/index.ts)
- Use arrow functions and destructured imports (CLAUDE.md requirements)
- MUST write tests for all new code (80% coverage required)

**Integration points**:
- **Existing**: Keep leaderboard (top 10) separate and unchanged
- **New**: Score history (all games) in dedicated sidebar
- **Storage**: New localStorage key `2048-score-history` (separate from `2048-leaderboard`)
- **Hook**: Update useGame.ts to save to history on game end (similar to leaderboard save at line 86-92)
- **Layout**: Modify Game.tsx to add sidebar alongside game board

**Data model**:
```typescript
interface ScoreHistoryEntry {
  id: string;              // Unique identifier (timestamp-random)
  score: number;           // Final score
  date: string;            // ISO timestamp
  moves: number;           // Number of moves made
  won: boolean;            // Whether player reached 2048
}
```

**Trade-offs**:

**Decision**: Store unlimited history vs limited history
- **Chosen**: Unlimited history (simpler implementation)
- **Rationale**: localStorage limit is 5-10MB, each entry ~100 bytes, supports 50k-100k games (unrealistic to hit)
- **Alternative considered**: Limit to last 50-100 games (adds complexity with rotation logic)
- **Future**: Can add pagination if needed

**Decision**: Always visible vs toggle-able sidebar
- **Chosen**: Always visible (per user requirement)
- **Rationale**: Better UX for tracking progress, no interaction needed
- **Alternative considered**: Toggle button (more screen space but requires clicks)
- **Mobile**: Will use responsive design to collapse/hide on small screens

**Decision**: Separate storage vs reuse leaderboard
- **Chosen**: Separate localStorage key
- **Rationale**: Leaderboard = top 10 sorted by score, History = all games chronological - different purposes
- **Alternative considered**: Single storage with different views (more complex filtering logic)

**Layout strategy**: CSS Grid for main game container
```
┌─────────────────────────────────────┐
│  Game Controls & Title              │
├─────────────────┬───────────────────┤
│                 │  Score History    │
│   Game Board    │  ┌─────────────┐ │
│   (existing)    │  │ 1234 - 2m ago│ │
│                 │  │  512 - 5m ago│ │
│                 │  │  256 - 1h ago│ │
│                 │  └─────────────┘ │
└─────────────────┴───────────────────┘
```

## 3. Tasks

### Phase 1: Data Layer (~2-3h)

1. **Create ScoreHistory utility module** (1.5h)
   - File: `src/utils/scoreHistory.ts`
   - Functions: `getScoreHistory()`, `addScoreHistoryEntry()`, `clearScoreHistory()`
   - Pattern: Follow `leaderboard.ts` structure (src/utils/leaderboard.ts:9-43)
   - Error handling: try-catch with console.error
   - Storage key: `2048-score-history`
   - Return: Chronological order (newest first)
   - Dependencies: None
   - Risk: Low (proven pattern from leaderboard)

2. **Add ScoreHistoryEntry type** (0.5h)
   - File: `src/types/game.ts`
   - Add interface to existing type definitions (line 32)
   - Fields: id, score, date, moves, won
   - Dependencies: None
   - Risk: Low (simple type addition)

3. **Write scoreHistory utility tests** (1h)
   - File: `src/utils/scoreHistory.test.ts`
   - Test: getScoreHistory (empty, with entries, parse errors)
   - Test: addScoreHistoryEntry (new entry, multiple entries, localStorage failure)
   - Test: clearScoreHistory (successful clear, error handling)
   - Pattern: Follow `leaderboard.test.ts` structure (src/utils/leaderboard.test.ts)
   - Dependencies: Task 1 must complete first
   - Risk: Low (standard unit tests)

### Phase 2: Component Implementation (~2-3h)

4. **Create ScoreHistory component** (1.5h)
   - File: `src/components/ScoreHistory.tsx`
   - Props: None (self-contained, loads from localStorage)
   - Features: Display all entries, "Clear History" button, empty state
   - Date formatting: Reuse formatDate logic from Leaderboard.tsx:20-42
   - Pattern: Similar to Leaderboard.tsx but no Modal wrapper
   - State: `useState<ScoreHistoryEntry[]>` loaded on mount
   - Dependencies: Tasks 1, 2 must complete
   - Risk: Low (similar to existing Leaderboard component)

5. **Add ScoreHistory CSS** (1h)
   - File: `src/components/ScoreHistory.css`
   - Sidebar styling: Fixed width (~200px), scrollable, border
   - Responsive: Hide on screens <768px width (mobile)
   - Empty state styling
   - Dependencies: Task 4 in progress
   - Risk: Medium (layout changes could affect existing UI)

6. **Write ScoreHistory component tests** (1h)
   - File: `src/components/ScoreHistory.test.tsx`
   - Test: Renders empty state
   - Test: Displays history entries
   - Test: Clear button functionality
   - Test: Date formatting
   - Mock: localStorage (beforeEach/afterEach clear)
   - Pattern: Follow Board.test.tsx structure (src/components/Board.test.tsx)
   - Dependencies: Task 4 must complete
   - Risk: Low (standard component tests)

### Phase 3: Integration (~1.5-2h)

7. **Update Game.tsx layout** (0.5h)
   - File: `src/components/Game.tsx`
   - Add ScoreHistory component to JSX (line ~29)
   - Update CSS Grid layout in Game.css
   - Pattern: Follow component composition pattern (Game.tsx:16-30)
   - Dependencies: Task 4 must complete
   - Risk: Medium (layout changes)

8. **Update useGame hook to save history** (0.5h)
   - File: `src/hooks/useGame.ts`
   - Add effect similar to leaderboard save (line 86-93)
   - Call `addScoreHistoryEntry()` when game ends (status changes to 'lost' or 'won')
   - Include won status in entry
   - Dependencies: Tasks 1, 2 must complete
   - Risk: Low (proven pattern from leaderboard)

9. **Update barrel export** (0.1h)
   - File: `src/components/index.ts`
   - Add: `export { ScoreHistory } from './ScoreHistory';`
   - Pattern: Follow existing exports (line 1-7)
   - Dependencies: Task 4 must complete
   - Risk: Low (trivial change)

10. **Integration testing and QA** (0.5h)
    - Manual testing: Play games, verify history saves
    - Test: Sidebar layout doesn't break existing UI
    - Test: Leaderboard still works independently
    - Test: localStorage persistence across page refreshes
    - Test: Responsive design on mobile
    - Dependencies: All previous tasks complete
    - Risk: Medium (could reveal layout issues)

**Total estimated effort**: 6-8 hours

## 4. Quality Strategy

**Tests**:
- Unit tests: scoreHistory utility (3 functions × 2-3 tests each = 6-9 tests)
- Component tests: ScoreHistory component (4 tests minimum)
- Integration: Manual QA of full feature
- Target coverage: ≥80% for new code (enforced by jest.config.js:14-19)

**Test cases**:
- Empty history state (no games played)
- Single game entry
- Multiple game entries (5-10 for scrolling)
- localStorage failure scenarios (JSON parse errors, quota exceeded)
- Clear history confirmation and execution
- History persists across page refreshes
- Date formatting (recent vs old dates)
- Won vs lost game indicators

**Validation** (from objectives):
- ✅ Sidebar visible on Game page load
- ✅ Games appear in history after completion
- ✅ Score and date display correctly
- ✅ History persists in localStorage
- ✅ Existing leaderboard unchanged
- ✅ All tests pass with ≥80% coverage
- ✅ `npm run typecheck` passes
- ✅ `npm run lint` passes

**Manual testing checklist**:
1. Play a game, lose → verify appears in history
2. Play a game, win (reach 2048) → verify won indicator
3. Refresh page → verify history still there
4. Play 10+ games → verify scrolling works
5. Clear history → verify confirmation + clears
6. Check mobile view → verify responsive behavior
7. Check existing leaderboard → verify still works

## 5. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sidebar breaks existing layout on desktop | H | Test early with CSS Grid layout, use media queries, QA on multiple screen sizes |
| localStorage grows too large over time | L | Document limitation in code comments, can add pagination/limits in future if needed (50k+ games unlikely) |
| Sidebar unusable on mobile | M | Use responsive CSS to hide sidebar on screens <768px width, document this behavior |
| Date formatting inconsistencies | L | Reuse proven formatDate function from Leaderboard.tsx, add comprehensive tests |
| Performance with 100+ games | L | CSS `overflow: auto` for scrolling, React renders efficiently, test with large dataset |
| History and leaderboard data drift | L | Both save on same game end event, atomic operations, test both save correctly |

**Assumptions**:
- Players will play <10,000 games in practice (localStorage sufficient)
- Desktop screen width ≥1024px for optimal sidebar display
- Date formatting from Leaderboard.tsx is acceptable for history
- No server-side storage needed (client-side only)
- Existing Modal component not needed for sidebar (always visible)

**Out of scope** (defer to future):
- Filtering/searching history (e.g., "show only wins")
- Sorting history (chronological only, not by score)
- Exporting history to CSV/JSON
- Pagination for very large histories (>1000 games)
- Game statistics (average score, win rate) - can be added later
- Editing/deleting individual history entries
- Syncing history across devices (localStorage is per-browser)

**Dependencies on existing code**:
- useGame hook must expose status changes (already does: line 59, 86-93)
- Game.tsx layout must support additional component (Game.css needs update)
- Leaderboard functionality must remain independent (no changes to leaderboard.ts)

## 6. Pre-Implementation Checklist

Before starting CODE phase:
- [ ] User has reviewed and approved this plan
- [ ] All clarifications addressed (history vs leaderboard distinction)
- [ ] Task breakdown reviewed (all tasks <4h)
- [ ] Risk mitigation strategies accepted
- [ ] Layout approach confirmed (always-visible sidebar)

## 7. Implementation Notes

**File structure** (all new files):
```
src/
├── components/
│   ├── ScoreHistory.tsx       [NEW]
│   ├── ScoreHistory.css       [NEW]
│   ├── ScoreHistory.test.tsx  [NEW]
│   └── index.ts               [MODIFIED - add export]
├── hooks/
│   └── useGame.ts             [MODIFIED - save history]
├── types/
│   └── game.ts                [MODIFIED - add interface]
└── utils/
    ├── scoreHistory.ts        [NEW]
    └── scoreHistory.test.ts   [NEW]
```

**Coding standards** (from CLAUDE.md):
- Arrow functions for components and utilities
- Destructured imports: `import { useState } from 'react'`
- Named exports (no default exports)
- Try-catch with console.error for async/localStorage ops
- TypeScript strict mode (no `any` types)
- Run `npm run typecheck` after changes

**Commands for CODE phase**:
```bash
# Development
npm run dev                    # Start dev server

# Testing (prefer single file for performance)
npm test -- scoreHistory.test.ts
npm test -- ScoreHistory.test.tsx

# Quality checks (run after implementation)
npm run typecheck             # MANDATORY before commit
npm run lint                  # Fix any issues
npm test                      # All tests must pass
```

**Next steps**:
1. User approves plan → `/epcc-code` to begin implementation
2. Plan needs changes → Iterate on plan based on feedback
3. Questions remain → Ask for clarification before coding
