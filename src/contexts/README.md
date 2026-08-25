### Contexts
- **`SequencerContext.ts`** - Typed context shared by the sequencer and visualizer
- **`SequencerContext.jsx`** - Provider for playback state and the sequencer gain-node ref

---

**Provider Setup:**
- `SequencerProvider` wraps sequencer and visualizer siblings
- Initializes `isPlaying: false` and `sequencerGainRef: null`

**State Updates:**
- **SequencerInner** writes to context:
  - Synchronizes playback state with `setIsPlaying(isPlaying)`
  - Copies its Tone.js gain node into the shared `sequencerGainRef`

**State Consumption:**
- **Visualizer** reads from context:
  - Gets `isPlaying` and `sequencerGainRef` through `useSequencerContext()`
  - Passes `sequencerGainRef` to `useVisualizer` for audio connection
