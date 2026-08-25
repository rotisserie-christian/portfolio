- **`utils/sequencerConstants.ts`** - Sequencer configuration constants (located in `components/crayonbrain/utils/`)
- **`useSequencer.ts`** - Orchestrator
- **`useTempo.ts`** - Manages tempo synchronization between React state and Tone.js Transport
- **`useTonePlayers.ts`** - Initializes and manages Tone.Player instances
- **`useToneSequence.ts`** - Sets up and manages Tone.Sequence
- **`useTransport.ts`** - Manages Tone.js Transport play/stop functionality

# Main Hook: `useSequencer`
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
  - `SequencerInner` passes its user-activation state so Tone.js initializes after the first Play action

**Returns:**
- `isPlaying` (boolean) - Current playback state
- `currentStepRef` (RefObject) - Current step in sequence without triggering React renders
- `handlePlay` (Function) - Function to start/stop playback
- `sequencerGainRef` (RefObject) - Reference to sequencer's audio gain node
- `isInitializing` (boolean) - Whether audio players are still loading
- `playersRef` (RefObject) - Reference to Tone.Player instances

**Used in:** `SequencerInner.jsx`, which is lazy-loaded by `DemoSequencer.jsx`

# Supporting Hooks:
## `useTonePlayers`

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

## `useToneSequence`

Sets up and manages Tone.Sequence playback, stores the current step in a ref, and updates drum-cell highlighting directly in the DOM.

**Parameters:**
- `stableDrumSounds` (Array) - Memoized array of drum sound objects
- `playersRef` (RefObject) - React ref containing Tone.Player instances
- `drumSequenceRef` (RefObject) - React ref to current drum sequence pattern
- `sequenceRef` (RefObject) - React ref to store Tone.Sequence instance
- `currentStepRef` (RefObject) - React ref storing the current step

**Returns:** `void`

**Used internally by:** `useSequencer`

## `useTempo`

Manages tempo synchronization between React state and Tone.js Transport

**Parameters:**
- `tempoBpm` (number) - Current tempo in BPM
- `tempoBpmRef` (RefObject) - React ref to store current tempo value

**Returns:** `void`

**Used internally by:** `useSequencer`

## `useTransport`

Manages Tone.js Transport play/stop functionality. Handles audio context activation and sequence control.

**Parameters:**
- `isPlaying` (boolean) - Current playback state
- `setIsPlaying` (Function) - Function to update playback state
- `currentStepRef` (RefObject) - Current step ref, reset to 0 when playback stops
- `sequenceRef` (RefObject) - React ref to Tone.Sequence instance
- `tempoBpmRef` (RefObject) - React ref to current tempo value

**Returns:**
- `handlePlay` (Function) - Function to start/stop playback

**Used internally by:** `useSequencer`

