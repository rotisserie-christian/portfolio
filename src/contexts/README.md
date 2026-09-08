### Contexts
- **`SequencerContext.ts`** - Typed context shared by the sequencer and visualizer
- **`SequencerContext.jsx`** - Provider for playback state and the sequencer gain-node ref

---

**Provider Setup:**
- `SequencerProvider` wraps sequencer and visualizer siblings
- Initializes `isPlaying: false`, `bpm` to the sequencer default, and `sequencerGainRef: null`

**State Updates:**
- **SequencerInner** writes to context:
  - Synchronizes playback state with `setIsPlaying(isPlaying)`
  - Copies its Tone.js gain node into the shared `sequencerGainRef`
  - Reads and writes `bpm` for the tempo slider so visualizers can follow candle rate

**State Consumption:**
- **Visualizer** and **StocksVisualizer** read from context:
  - Gets `isPlaying`, `bpm`, and `sequencerGainRef` through `useSequencerContext()`
