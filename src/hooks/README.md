# Hooks

## Data Flow
##### Lazy Loading → Sequencer → Context → Visualizer

## Shared Hooks
- **`useIntersectionObserver.js`** - Observes element intersection with viewport for lazy loading
- **`useSequencerContext.js`** - Access sequencer context
- **`useAudioConnection.js`** - Connects analyzer node to an audio source 

1. **useIntersectionObserver** (DemoSequencer)
   - Observes when sequencer enters viewport, for progressive loading
   - Returns `hasIntersected: boolean`

2. **useSequencer** (DemoSequencer)
   - Receives `hasIntersected` as `shouldInitialize` parameter
   - Only initializes Tone.js players when `hasIntersected === true`
   - Returns `isPlaying` and `sequencerGainRef`

3. **useSequencerContext** (DemoSequencer → Visualizer)
   - **In DemoSequencer**: Writes sequencer state to context
     - `isPlaying` → `setIsPlaying(isPlaying)` (line 46)
     - `sequencerGainRef` → `contextGainRef.current = sequencerGainRef.current` (line 52)
   - **In Visualizer**: Reads sequencer state from context
     - Gets `isPlaying` and `sequencerGainRef` (line 11)

4. **useAudioConnection** (inside useVisualizer)
   - Receives `sequencerGainRef` from context
   - Connects analyser node to sequencer's audio output
