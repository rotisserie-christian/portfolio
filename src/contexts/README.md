### Contexts
- **`SequencerContext.js`** - Enables communication between `DemoSequencer` and `Visualizer`
- **`SequencerContext.jsx`** - Provider component

---

**Provider Setup:**
- `SequencerProvider` wraps both sequencer and visualizer components
- Initializes `isPlaying: false` and `sequencerGainRef: null`

**State Updates:**
- **DemoSequencer** writes to context:
  - `isPlaying` state → `setIsPlaying(isPlaying)` (DemoSequencer.jsx:46)
  - `sequencerGainRef` → `contextGainRef.current = sequencerGainRef.current` (DemoSequencer.jsx:52)

**State Consumption:**
- **Visualizer** reads from context:
  - Gets `isPlaying` and `sequencerGainRef` via `useSequencerContext()` (Visualizer.jsx:11)
  - Passes `sequencerGainRef` to `useVisualizer` for audio connection

**See also:** `hooks/README.md`
