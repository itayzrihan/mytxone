# Developer Notes - Teleprompter Series & Countdown

## Code Overview

### CountdownRecorder Component (`countdown-recorder.tsx`)

**Architecture:**
- Functional component using React hooks
- Uses `useRef` for Web Audio API context
- Uses `useState` for countdown number
- Uses `useEffect` for countdown sequence management

**Key Implementation Details:**

1. **Web Audio API Integration**
```typescript
const audioContextRef = useRef<AudioContext | null>(null);

const playBeep = (frequency: number = 440, duration: number = 200) => {
  if (!audioContextRef.current) {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Oscillator generates sine wave at specified frequency
  // Gain node controls volume envelope (exponential decay)
};
```

2. **Countdown Sequence**
```typescript
const startCountdown = (currentCount: number) => {
  if (currentCount === 0) {
    playGoSound();  // Special double-tone for "GO!"
  } else {
    playBeep(440 + currentCount * 40, 200);  // Ascending frequency
    setTimeout(() => startCountdown(currentCount - 1), 1000);
  }
};
```

3. **Visual Effects (CSS)**
- Multiple glow layers with different blur radii
- Pulsing animations with staggered delays
- Scale transforms for text feedback

---

### TeleprompterPageContent Enhancement

**Key Changes:**

1. **Series Data Fetching**
```typescript
useEffect(() => {
  const fetchSeriesInfo = async () => {
    const response = await fetch(`/api/scripts/${scriptId}/series`);
    if (response.ok) {
      const data = await response.json();
      setSeriesInfo(data);
    }
  };
  if (scriptId) fetchSeriesInfo();
}, [scriptId]);
```

2. **Recording Flow Split**
```typescript
// User interaction layer
const startRecording = async () => {
  setShowCountdown(true);  // Shows countdown first
};

// Internal implementation
const startRecordingInternal = async () => {
  // Original recording logic
  // Requests permissions, sets up MediaRecorder
};
```

3. **Navigation Handler**
```typescript
const navigateToScript = (nextScriptId: string | undefined) => {
  if (nextScriptId) {
    router.push(`/teleprompter/${nextScriptId}`);
  }
};
```

---

### API Route Enhancement

**GET `/api/scripts/[id]/series`**

**Query Logic:**
1. Authenticate user
2. Fetch script with `getScriptById()`
3. Get series array with `getScriptSeries()`
4. If no series → return null object
5. Get first series from array
6. Fetch all scripts in series with `getSeriesScripts()`
7. Find current index
8. Extract prev/next scripts

**Response Format:**
```typescript
{
  id?: string;           // Series ID or null
  name?: string;         // Series name or null
  description?: string;  // Series description
  previousScript?: Script | null;  // Full script object or null
  nextScript?: Script | null;      // Full script object or null
  currentIndex: number;  // 0-based position in series
  totalScripts: number;  // Total scripts in series
}
```

---

## Styling Approach

### CSS-in-JS vs Tailwind

**Decision:** Mix of both
- **Tailwind:** Button classes, layout, colors
- **CSS-in-JS:** Dynamic animations, glow effects

**Why:**
- Animations need `<style jsx>` for performance
- Tailwind handles static styles efficiently
- Combination avoids runtime CSS generation

### Glow Effect Implementation

```typescript
// Multiple layers create depth
const glowStyle = {
  background: "radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, ...)",
  animation: "pulse 1s ease-in-out"
};

// Separate animation delays for stagger effect
style={{ animation: `pulse 1s ease-in-out ${i * 0.1}s` }}
```

---

## Type Safety

### New Interfaces

```typescript
interface SeriesInfo {
  id?: string;
  name?: string;
  description?: string;
  previousScript?: Script | null;
  nextScript?: Script | null;
  currentIndex: number;
  totalScripts: number;
}
```

**Notes:**
- Optional fields (`?`) handle null cases
- `Script` type comes from `@/db/schema`
- `currentIndex` and `totalScripts` always present

### Type Casting

```typescript
// In API route - unsafe but necessary for dynamic scripts
const currentIndex = seriesScripts.findIndex((s: any) => s.id === params.id);

// Could be improved with proper typing if needed:
// const currentIndex = seriesScripts.findIndex((s: Script) => s.id === params.id);
```

---

## Performance Considerations

### Memory Management

**Countdown Component:**
```typescript
useEffect(() => {
  // ... countdown logic
  return () => {
    if (countdownTimeoutRef.current) {
      clearTimeout(countdownTimeoutRef.current);
    }
  };
}, [isActive]);
```
- Cleans up timeouts on unmount
- Prevents memory leaks
- Web Audio context reused (not recreated)

**Recording State:**
- MediaRecorder cleared after stop
- Streams properly stopped
- Event listeners removed

### CPU Usage

- **CSS Animations:** GPU-accelerated (transform, opacity)
- **Web Audio:** Single audio context reused
- **React Renders:** Minimal re-renders (series info fetched once)

### Network

- **Series Endpoint:** Single API call on mount
- **Data Size:** ~500 bytes response
- **Caching:** Could add for frequently accessed series

---

## Error Handling

### Countdown Component
```typescript
try {
  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContext();
  }
  // ... audio code
} catch (error) {
  console.error("Error playing beep:", error);
  return null;  // Graceful degradation
}
```

### Series Fetching
```typescript
try {
  const response = await fetch(`/api/scripts/${scriptId}/series`);
  if (response.ok) {
    // ... handle data
  }
} catch (error) {
  console.error("Failed to fetch series info:", error);
  // Series nav simply won't show
}
```

### Recording
```typescript
// Existing error handling preserved
if (error.name === 'NotAllowedError') {
  errorMessage += 'Please allow camera and microphone permissions...';
}
```

---

## Testing Scenarios

### Unit Test Ideas

```typescript
// Countdown Component
test('displays numbers 5 through 1', () => {
  // Verify count state updates correctly
});

test('plays different frequencies', () => {
  // Mock Web Audio API
  // Verify oscillator frequencies
});

test('calls callback when countdown completes', async () => {
  // Mock timer
  // Verify onCountdownComplete fired
});

// Series Navigation
test('disables previous button at series start', () => {
  // Render with currentIndex = 0
  // Verify button disabled
});

test('navigates to next script on button click', () => {
  // Mock router
  // Click next button
  // Verify router.push called with correct ID
});
```

### Integration Test Ideas

```typescript
// Full recording flow
test('countdown displays before recording starts', async () => {
  // Click record button
  // Verify countdown visible
  // Wait for countdown
  // Verify recording starts
});

test('series navigation persists during recording', () => {
  // Start series recording
  // Navigate to next script
  // Verify new script content loads
  // Verify can continue recording with new script
});
```

---

## Browser Compatibility Notes

### Web Audio API

**Issue:** Safari requires user gesture before audio context creation
```typescript
// This works (in event handler):
const audioContext = new AudioContext();

// This doesn't (in component setup):
const audioContext = new AudioContext();  // May be blocked
```

**Solution:** Create context in `playBeep()` (called from useEffect with proper timing)

### Fullscreen API

**Note:** Countdown overlay works in fullscreen
```typescript
// Countdown uses position: fixed (not fullscreen-specific)
// Works with or without fullscreen mode
```

---

## Configuration & Customization

### Easy Tweaks

```typescript
// Countdown duration per number
const COUNTDOWN_DURATION = 1000;  // 1 second
// Change to: 800ms = faster, 1500ms = slower

// Sound frequency base
const BASE_FREQUENCY = 440;
const FREQUENCY_STEP = 40;
// Higher step = bigger frequency differences

// Glow layer sizes
const GLOW_SIZES = [300, 240, 180];  // pixels
// Smaller = tighter glow, Larger = more spread

// Glow colors
const GLOW_COLORS = [
  'rgba(34, 211, 238, 0.8)',    // Cyan
  'rgba(59, 130, 246, 0.6)',    // Blue
  'rgba(99, 102, 241, 0.5)'     // Indigo
];
```

---

## Dependencies

### Added
- None (uses browser APIs only)

### Utilized (Existing)
- `react` - Hooks (useRef, useState, useEffect)
- `next/navigation` - Router for navigation
- `lucide-react` - Icons (ChevronLeft, ChevronRight, Folder)
- `@/db/queries` - Database functions

---

## Edge Cases Handled

1. **Script not in series**
   - Series buttons don't render
   - Navigation functions exit early
   - No error thrown

2. **At series boundaries**
   - Previous button disabled at start
   - Next button disabled at end
   - Users can't navigate beyond bounds

3. **Network failure on series fetch**
   - Try/catch prevents errors
   - Series nav simply won't show
   - Teleprompter still works

4. **Audio context creation fails**
   - Try/catch in playBeep
   - Function returns null
   - Countdown still displays visually

5. **User navigates during countdown**
   - Countdown state clears
   - New script loads
   - Clean transition

---

## Security Considerations

### API Route
- ✅ Checks user authentication
- ✅ Validates user owns script (or script is public)
- ✅ Prevents unauthorized series access

### Web Audio API
- ✅ Requires user gesture (security model)
- ✅ No network requests in audio code
- ✅ No sensitive data in audio

### Recording
- ✅ Existing permission checks preserved
- ✅ MediaRecorder uses secure contexts
- ✅ HTTPS required for production

---

## Maintenance Notes

### Future Updates

**If adding countdown customization:**
```typescript
// Store in user settings/preferences
const countdownSettings = {
  enabled: true,
  duration: 5,  // seconds
  sound: 'beep',
  visualStyle: 'glow'
};
```

**If adding series persistence:**
```typescript
// Cache series data to localStorage
const cacheSeriesInfo = (scriptId, data) => {
  localStorage.setItem(`series_${scriptId}`, JSON.stringify(data));
};
```

**If adding analytics:**
```typescript
// Track countdown completion
trackEvent('countdown_completed', { scriptId, duration });
trackEvent('series_navigation', { from: oldScriptId, to: newScriptId });
```

---

## Debugging Tips

### Countdown Issues

```javascript
// Check if countdown state is updating
console.log('Countdown active:', showCountdown);
console.log('Current count:', count);  // Inside component

// Check audio context
console.log('Audio context:', audioContextRef.current);
console.log('Audio context state:', audioContextRef.current?.state);
```

### Series Navigation Issues

```javascript
// Check if series data loaded
console.log('Series info:', seriesInfo);
console.log('Previous script:', seriesInfo?.previousScript);
console.log('Next script:', seriesInfo?.nextScript);

// Check API response
fetch('/api/scripts/[id]/series')
  .then(r => r.json())
  .then(d => console.log('Series API response:', d));
```

### Recording Flow Issues

```javascript
// Check countdown to recording transition
console.log('Show countdown:', showCountdown);
console.log('Is recording:', isRecording);
console.log('Recording type:', recordingType);

// Check media stream
console.log('Media stream:', mediaStreamRef.current);
console.log('Media recorder:', mediaRecorder);
```

---

## Version History

- **v1.0** (Current)
  - ✅ Series navigation with prev/next buttons
  - ✅ 5-4-3-2-1-GO! countdown with sound
  - ✅ Visual glow effects
  - ✅ Integrated recording flow
  - ✅ Full documentation

---

