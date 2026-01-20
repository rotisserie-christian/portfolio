# Hooks

## Data Flow
##### Lazy Loading → Sequencer → Context → Visualizer

## State Synchronization
Even though it's generally a bad practice to set state within useEffect, it has to be done this way to avoid conflicts with Tone.js scheduling. 

## Crayonbrain Hooks
- **`useSequencerContext.js`** - Access sequencer context (shared between sequencer and visualizer)
- **`sequencer/`** - Sequencer hooks (see sequencer/README.md)
- **`visualizer/`** - Visualizer hooks (see visualizer/README.md)