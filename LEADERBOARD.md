# Leaderboard Feature Documentation

## Overview

The leaderboard feature tracks and displays the top 10 scores from completed games. Scores are automatically saved when a game ends (status becomes 'lost') and are persisted in localStorage.

## Components

### Modal Component

**Location:** `src/components/Modal.tsx`

A reusable modal/popup component with the following features:
- Backdrop click to close
- Escape key to close
- Prevents body scroll when open
- Accessible with proper ARIA attributes
- Smooth fade-in and slide-up animations

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;        // Whether the modal is open
  onClose: () => void;    // Callback when modal should close
  title: string;          // Modal title
  children: React.ReactNode; // Modal content
}
```

**Usage:**
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="My Modal">
  <p>Modal content here</p>
</Modal>
```

### Leaderboard Component

**Location:** `src/components/Leaderboard.tsx`

Displays the top 10 scores with the following features:
- Sorted by score (highest first)
- Medal emojis (🥇🥈🥉) for top 3 positions
- Shows score, number of moves, and relative time
- Clear leaderboard functionality with confirmation
- Empty state message

**Props:**
```typescript
interface LeaderboardProps {
  isOpen: boolean;        // Whether the leaderboard modal is open
  onClose: () => void;    // Callback when modal should close
}
```

**Usage:**
```tsx
<Leaderboard
  isOpen={showLeaderboard}
  onClose={() => setShowLeaderboard(false)}
/>
```

## Data Management

### Leaderboard Utilities

**Location:** `src/utils/leaderboard.ts`

Provides functions to manage leaderboard data:

- `getLeaderboard(): LeaderboardEntry[]` - Retrieves all entries, sorted by score
- `addLeaderboardEntry(score: number, moves: number): void` - Adds a new entry
- `clearLeaderboard(): void` - Removes all entries
- `isLeaderboardScore(score: number): boolean` - Checks if a score qualifies

### Data Structure

```typescript
interface LeaderboardEntry {
  id: string;       // Unique identifier
  score: number;    // Final game score
  date: string;     // ISO date string
  moves: number;    // Number of moves made
}
```

### Storage

- **Key:** `2048-leaderboard`
- **Location:** localStorage
- **Format:** JSON array of LeaderboardEntry objects
- **Max entries:** 10 (automatically trimmed)

## Integration

### Automatic Score Saving

Scores are automatically saved to the leaderboard when a game ends. This is handled in the `useGame` hook:

```typescript
// Save to leaderboard when game ends
useEffect(() => {
  if (prevStatusRef.current !== 'lost' && state.status === 'lost') {
    if (state.score > 0) {
      addLeaderboardEntry(state.score, state.moveCount);
    }
  }
  prevStatusRef.current = state.status;
}, [state.status, state.score, state.moveCount]);
```

### User Interface

The leaderboard button is displayed at the bottom of the game container:

```tsx
<button
  type="button"
  className="leaderboard-button"
  onClick={() => setShowLeaderboard(true)}
>
  🏆 Leaderboard
</button>
```

## Styling

### Colors

- **Button background:** `#edc22e` (gold color from 2048 tile)
- **Button hover:** `#edc850`
- **Item background:** `#eee4da`
- **Item hover:** `#ede0c8`
- **Text color:** `#776e65`
- **Meta text:** `#9e9489`

### Responsive Design

- Desktop: Full width button with larger padding
- Mobile: Adjusted padding and font sizes for better mobile experience

## Testing

### Unit Tests

**Leaderboard Utility Tests:** `src/utils/leaderboard.test.ts`
- Tests for retrieving, adding, clearing entries
- Tests for score qualification logic
- Tests for entry limit (max 10)

**Modal Component Tests:** `src/components/Modal.test.tsx`
- Tests for open/close behavior
- Tests for backdrop and close button clicks
- Tests for ARIA attributes

**Leaderboard Component Tests:** `src/components/Leaderboard.test.tsx`
- Tests for displaying entries
- Tests for empty state
- Tests for medal emojis
- Tests for clear functionality

### Test Coverage

All new components and utilities have comprehensive test coverage:
- 22 new tests added
- All tests passing
- Coverage >80% for new code

## Usage Examples

### Opening the Leaderboard

```tsx
const [showLeaderboard, setShowLeaderboard] = useState(false);

// Open leaderboard
<button onClick={() => setShowLeaderboard(true)}>
  View Leaderboard
</button>

// Render leaderboard
<Leaderboard
  isOpen={showLeaderboard}
  onClose={() => setShowLeaderboard(false)}
/>
```

### Manually Adding an Entry

```typescript
import { addLeaderboardEntry } from '../utils/leaderboard';

// Add entry with score and moves
addLeaderboardEntry(5000, 150);
```

### Checking if Score Qualifies

```typescript
import { isLeaderboardScore } from '../utils/leaderboard';

const score = 3000;
if (isLeaderboardScore(score)) {
  console.log('New high score!');
}
```

## Future Enhancements

Potential improvements for the leaderboard feature:

1. **Online Leaderboard:** Sync scores to a backend server
2. **Player Names:** Allow users to enter their name with scores
3. **Filters:** Filter by date range or number of moves
4. **Statistics:** Show average score, best streak, etc.
5. **Share Feature:** Share scores on social media
6. **Achievements:** Add badges for reaching milestones

## Browser Support

The leaderboard feature uses localStorage and modern JavaScript features:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Modal has proper ARIA attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- Close button has `aria-label` for screen readers
- Keyboard navigation supported (Escape to close)
- Focus management when modal opens/closes
