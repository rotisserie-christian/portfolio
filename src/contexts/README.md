### Contexts
- **`SequencerContext.js`** - Creates the shared context object
- **`SequencerContext.jsx`** - Provider component

---

#### `SequencerContext`

Enables communication between `DemoSequencer` and `Visualizer` components

**Exports:**
- `SequencerContext` (Context) - React context object created with `createContext(null)`

---

#### `SequencerProvider`

Manages sequencer state and provides it to its children

**Parameters:**
- `children` (ReactNode, required) - Child components that need access to sequencer context

**Returns:**
- `JSX.Element` - Context provider wrapping children

**Context Value:**
- `isPlaying` (boolean) - Current playback state
- `setIsPlaying` (Function) - Function to update playback state
- `sequencerGainRef` (RefObject) - Reference to sequencer's audio gain node

**Used in:** `Crayonbrain.jsx:43`

**Usage:**
```jsx
<SequencerProvider>
  <DemoSequencer />
  <Visualizer />
</SequencerProvider>
```

**Access Pattern:**
- Components access context via `useSequencerContext()` hook
- Hook throws error if used outside provider
- See `hooks/useSequencerContext.js` for hook implementation

---

#### Data Flow

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