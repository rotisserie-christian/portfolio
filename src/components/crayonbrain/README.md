## Crayonbrain
- **`/hooks`** - Logic for sequencing audio and rendering visuals
- **`/ui`** - Drum pad, visualizer, and sequencer controls
- **`/utils`** - Constants, utilities, and error classes
- **`Crayonbrain.jsx`** - Legacy feature container that coordinates the sequencer, visualizer gate, and lazy visualizer loading
- **`DemoSequencer.jsx`** - Suspense shell that lazy-loads `SequencerInner`
- **`SequencerInner.jsx`** - Interactive drum sequencer; initializes Tone.js and sample players after the first Play action
- **`Visualizer.jsx`** - Butterchurn canvas and preset controls backed by sequencer context
