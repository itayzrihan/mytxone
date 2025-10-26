# Teleprompter Series Feature - Visual Guide

## Screen Layout

### Teleprompter with Series Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TELEPROMPTER WITH SERIES                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                          [SCRIPT CONTENT HERE]                         │
│                         Large readable text                            │
│                    (Auto-scrolls during playback)                      │
│                                                                         │
│                                                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  SERIES NAVIGATION AT TOP:                                              │
│  ┌─ ← ─┬─ My Video Series  2 / 5 ─┬─ → ─┐                             │
│  │ Back│◀ Previous    Folder Icon   Next ▶│                           │
│  └─────┴──────────────────────────────────┘                            │
│                                                                         │
│  CENTER CONTROLS:                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ ◀◀ 10s  ↻ Reset  ▶ PLAY  >> 10s  |  Settings  ⛶ Fullscreen   │  │
│  │                                     🎬 Teleprompter Mode        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  RECORDING CONTROLS:                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  🎥 → 🎙️  [ ●  RECORD ]  🔴 (while recording)  📥 (recordings) │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Countdown Animation Sequence

### State 1: Record Button Clicked
```
User clicks [ ● RECORD ] button
            ↓
Countdown overlay appears
```

### State 2: Countdown Display (5-4-3-2-1)
```
╔═════════════════════════════════════════════════════════════════════╗
║                                                                     ║
║                         ✨ Glow Layer 1 ✨                         ║
║                      (Outer cyan blur - 300px)                     ║
║                                                                     ║
║                        ✨ Glow Layer 2 ✨                          ║
║                      (Middle blue blur - 240px)                    ║
║                                                                     ║
║                        ✨ Glow Layer 3 ✨                          ║
║                     (Inner indigo blur - 180px)                    ║
║                                                                     ║
║                      ╔═══════════════════╗                         ║
║                      ║                   ║                         ║
║                      ║   ✨  5  ✨       ║   ← GLOW TEXT            ║
║                      ║                   ║                         ║
║                      ║  200px Font Size  ║                         ║
║                      ║                   ║                         ║
║                      ╚═══════════════════╝                         ║
║                                                                     ║
║                  🔵 🔵 🔵  Pulsing Rings  🔵 🔵 🔵                  ║
║                                                                     ║
║            🔊 SOUND: 440Hz Beep (200ms)  📊 RINGS: Scale 0→1.3    ║
║                                                                     ║
╚═════════════════════════════════════════════════════════════════════╝

TIME: 1.0 second per number
SOUND: Ascending frequency (440 → 480 → 520 → 560 → 600 Hz)
```

### State 3: Countdown Sequence
```
Time 0s:    5️⃣  (beep: 440 Hz)
Time 1s:    4️⃣  (beep: 480 Hz)
Time 2s:    3️⃣  (beep: 520 Hz)
Time 3s:    2️⃣  (beep: 560 Hz)
Time 4s:    1️⃣  (beep: 600 Hz)
Time 5s:   🎬 GO!  (double beep: 600 + 800 Hz)
Time 5.3s: Recording Starts → Countdown fades out
```

### Sound Wave Pattern
```
Frequency progression (each beep):
│
│     ┌─┐     ┌─┐     ┌─┐     ┌─┐     ┌─┐     ┌─┐┌─┐
│     │5│     │4│     │3│     │2│     │1│     │G││O│
│────┬┴─┴┬───┬┴─┴┬───┬┴─┴┬───┬┴─┴┬───┬┴─┴┬───┬┴─┴┴─┴┬───
└────┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───────┴─→ Time
0s   1s  2s  3s  4s  5s  6s

Frequency:
440 Hz → 480 Hz → 520 Hz → 560 Hz → 600 Hz → GO! (double tone)
```

---

## Series Navigation Flow

### Script in Series - Navigation Available
```
┌────────────────────────────────────────────────────────┐
│ Teleprompter: "Episode 2 - Main Content"               │
│                                                         │
│ Series: "My 5-Part Training Series"                    │
│ Position: 2/5                                          │
│                                                         │
│ TOP CONTROLS:                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │  Back  │ ◀ Series Name 2/5 ▶ │  Main Controls      ││
│ │        │ Prev  [My Series]  Next                   ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘

Navigation:
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Script 1   │────▶│  Script 2 ◀──┼────▶│  Script 3    │
│   (No Prev) │     │ (Active) ✓   │     │  (Can Next)  │
└─────────────┘     └──────────────┘     └──────────────┘
```

### Script NOT in Series - Navigation Hidden
```
┌────────────────────────────────────────────────────────┐
│ Teleprompter: "Standalone Script"                      │
│                                                         │
│ (Not part of any series)                               │
│                                                         │
│ TOP CONTROLS:                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │  Back │  Main Controls                              ││
│ │       │  (Series buttons hidden)                    ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

---

## Recording Workflow Timeline

### Complete Recording Session with Countdown

```
TIME EVENT DESCRIPTION                    USER INTERFACE
─────────────────────────────────────────────────────────
 0s  User ready                           [ ● RECORD ] button visible
     
     USER CLICKS RECORD
     ↓
 0.1s Countdown starts                    Full-screen overlay appears
     Screen shows: 5️⃣                     Sound: 440 Hz beep 🔊
     Glow effect activates                 
     Rings pulse outward

 1.0s Countdown: 4️⃣                      Sound: 480 Hz beep 🔊
     Scale animation

 2.0s Countdown: 3️⃣                      Sound: 520 Hz beep 🔊
     Rings expand further

 3.0s Countdown: 2️⃣                      Sound: 560 Hz beep 🔊
     Pulsing intensifies

 4.0s Countdown: 1️⃣                      Sound: 600 Hz beep 🔊
     Ready to perform

 5.0s GO! 🎬                              Sound: 600 + 800 Hz beep 🔊
     Double tone activation               Text scales down
     
 5.3s RECORDING STARTS                    [ ■ STOP ] button appears
     Countdown fades out                  Recording indicator: 🔴 Recording
     Script ready for reading             Timer shows elapsed time
     
 5.3s onwards: ACTIVE RECORDING          User reads/performs script
     Media being captured                 Continue until ready to stop
     Teleprompter scrolls if enabled     Audio input: Microphone

FINAL: User clicks [ ■ STOP ]            Recording saved to memory
     Recording complete                   Available for download
```

---

## Button States & Interactions

### Series Navigation Buttons

#### ENABLED State (Prev/Next available)
```
┌─────────────┐
│    ◀  ▶     │  ← Clickable (full opacity)
│   0.5s ease-in animation on hover
└─────────────┘
```

#### DISABLED State (Boundary reached)
```
┌─────────────┐
│  ◀ (dimmed) │  ← Not clickable (50% opacity)
│  cursor: not-allowed
└─────────────┘
```

### Recording Button State Transition

```
BEFORE RECORDING:           COUNTDOWN ACTIVE:         RECORDING:
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│ ● GREEN BUTTON  │   →    │ COUNTDOWN: 5-4  │  →   │ ■ RED BUTTON    │
│ "Record Video"  │        │ (Overlay)       │       │ "Stop Recording"│
│ Click to start  │        │ Auto-transitions│       │ Click to stop   │
└─────────────────┘        └─────────────────┘       └─────────────────┘
```

---

## Visual Effects Breakdown

### Countdown Glow Layers
```
Center point: (screen center-x, screen center-y)

Layer 1 (Outer):
- Size: 300px diameter
- Color: rgba(34, 211, 238, 0.8) → rgba(34, 211, 238, 0.3)
- Blur: blur(48px)
- Opacity: 50-100% pulse

Layer 2 (Middle):
- Size: 240px diameter  
- Color: rgba(59, 130, 246, 0.6) → rgba(59, 130, 246, 0.2)
- Blur: blur(32px)
- Opacity: 60-100% pulse (staggered 0.1s)

Layer 3 (Inner):
- Size: 180px diameter
- Color: rgba(99, 102, 241, 0.5) → rgba(99, 102, 241, 0.1)
- Blur: blur(16px)
- Opacity: 40-100% pulse (staggered 0.2s)
```

### Pulsing Rings
```
Ring 1 (Closest):
- Start: 200px diameter, opacity 0.8
- End: 260px diameter, opacity 0
- Duration: 1s ease-out

Ring 2 (Middle):
- Start: 240px diameter, opacity 0.65
- End: 310px diameter, opacity 0
- Duration: 1s ease-out
- Delay: 0.2s

Ring 3 (Outer):
- Start: 280px diameter, opacity 0.45
- End: 360px diameter, opacity 0
- Duration: 1s ease-out
- Delay: 0.4s
```

### Text Shadow
```
Text color: White (#FFFFFF)
Font size: 200px (or 180px for "GO!")
Font weight: 900 (Black)

Text shadow layers (4 total):
1. 0 0 20px rgba(34, 211, 238, 0.8)     ← Cyan near
2. 0 0 40px rgba(59, 130, 246, 0.6)     ← Blue medium  
3. 0 0 60px rgba(99, 102, 241, 0.4)     ← Indigo far
4. 0 0 80px rgba(34, 211, 238, 0.2)     ← Cyan very far

Result: Multi-layered glow creating depth
```

---

## Component Architecture

```
TeleprompterPageContent
├── State Management
│   ├── [script] - Current script content
│   ├── [seriesInfo] - Series navigation data
│   ├── [showCountdown] - Countdown display flag
│   └── [isRecording] - Recording state
│
├── Effects
│   ├── useEffect - Fetch script
│   ├── useEffect - Fetch series info
│   └── useEffect - Handle recording state
│
├── Functions
│   ├── startRecording() → Shows countdown
│   ├── startRecordingInternal() → Actual recording
│   ├── navigateToScript() → Series navigation
│   └── stopRecording() → Stop and save
│
├── Render
│   ├── <CountdownRecorder /> - Overlay component
│   ├── Series Navigation Bar
│   ├── Main Controls
│   └── Recording Controls
│
└── Sub-components
    └── CountdownRecorder
        ├── Sound generation (Web Audio API)
        ├── Animation effects (CSS)
        └── Countdown sequence (useEffect)
```

---

## Color Scheme

### Countdown Colors
```
Cyan:      #22D3EE  (rgb(34, 211, 238))   - Primary glow
Blue:      #3B82F6  (rgb(59, 130, 246))   - Secondary glow  
Indigo:    #6366F1  (rgb(99, 102, 241))   - Tertiary glow
White:     #FFFFFF                         - Text
```

### UI Element Colors
```
Active buttons:     Cyan/Blue gradient
Disabled buttons:   White/50% opacity
Recording (active): Red (#EF4444)
Series indicator:   White/70% opacity
```

---

