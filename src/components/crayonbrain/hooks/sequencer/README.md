# Hooks

## Sequencer
- **`sequencerConstants.js`** - Sequencer configuration constants
- **`useSequencer.js`** - Orchestrator
- **`useTempo.js`** - Manages tempo synchronization between React state and Tone.js Transport
- **`useTonePlayers.js`** - Initializes and manages Tone.Player instances
- **`useToneSequence.js`** - Sets up and manages Tone.Sequence
- **`useTransport.js`** - Manages Tone.js Transport play/stop functionality

## Main Hook
### `useSequencer`

Main orchestrator that handles player initialization, sequence scheduling, tempo management, and transport control.

**Parameters:**
- `drumSequence` (Array) - Array of drum tracks with step patterns
  - Format: `[{ steps: [boolean, ...] }, ...]`
  - Each track represents one sound (kick, snare, etc.)
  - Each step is a boolean indicating if sound plays at that step
- `drumSounds` (Array) - Array of sound objects
  - Format: `[{ id: string, name: string, src: string }, ...]`
- `tempoBpm` (number, optional) - Tempo in BPM (default: 170)
- `shouldInitialize` (boolean, optional) - Whether to initialize audio players (default: true)
  - Used for lazy loading - pass `hasIntersected` from `useIntersectionObserver`

**Returns:**
- `isPlaying` (boolean) - Current playback state
- `currentStep` (number) - Current step in sequence (0-7)
- `handlePlay` (Function) - Function to start/stop playback
- `sequencerGainRef` (RefObject) - Reference to sequencer's audio gain node
- `isInitializing` (boolean) - Whether audio players are still loading
- `playersRef` (RefObject) - Reference to Tone.Player instances

**Used in:** `DemoSequencer.jsx`

## Supporting Hooks
### `useTonePlayers`

Initializes and manages Tone.Player instances. Creates a shared gain node that all players connect to.

**Parameters:**
- `drumSounds` (Array) - Array of sound objects { id, name, src }
- `playersRef` (RefObject) - React ref to store player instances
- `sequencerGainRef` (RefObject) - React ref to store sequencer gain node
- `isInitializingRef` (RefObject) - React ref to track initialization state
- `setIsInitializing` (Function) - Function to update initialization state
- `shouldInitialize` (boolean, optional) - Whether to initialize players (default: true)

**Returns:** `void`

**Used internally by:** `useSequencer`

### `useToneSequence`

Sets up and manages Tone.Sequence for playback. Schedules audio playback at each step and updates current step state.

**Parameters:**
- `stableDrumSounds` (Array) - Memoized array of drum sound objects
- `playersRef` (RefObject) - React ref containing Tone.Player instances
- `drumSequenceRef` (RefObject) - React ref to current drum sequence pattern
- `sequenceRef` (RefObject) - React ref to store Tone.Sequence instance
- `setCurrentStep` (Function) - Function to update current step state

**Returns:** `void`

**Used internally by:** `useSequencer`

### `useTempo`

Manages tempo synchronization between React state and Tone.js Transport

**Parameters:**
- `tempoBpm` (number) - Current tempo in BPM
- `tempoBpmRef` (RefObject) - React ref to store current tempo value

**Returns:** `void`

**Used internally by:** `useSequencer`

### `useTransport`

Manages Tone.js Transport play/stop functionality. Handles audio context activation and sequence control.

**Parameters:**
- `isPlaying` (boolean) - Current playback state
- `setIsPlaying` (Function) - Function to update playback state
- `setCurrentStep` (Function) - Function to reset step to 0
- `sequenceRef` (RefObject) - React ref to Tone.Sequence instance
- `tempoBpmRef` (RefObject) - React ref to current tempo value

**Returns:**
- `handlePlay` (Function) - Function to start/stop playback

**Used internally by:** `useSequencer`

