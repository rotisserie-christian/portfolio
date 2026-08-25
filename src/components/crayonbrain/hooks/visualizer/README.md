- **`analyserSetup.ts`** - Creates and configures Web Audio analyser nodes
- **`presetLoader.ts`** - Loads Butterchurn presets
- **`useAudioConnection.ts`** - Connects the analyser to the sequencer gain node, with polling and fallback routing
- **`useCanvasResize.ts`** - Handles canvas sizing on window resize events
- **`usePresetSwitching.ts`** - Manages preset selection, switching, and name display
- **`useRenderLoop.ts`** - Manages requestAnimationFrame render loop
- **`useSetupVisualizer.ts`** - Sets up Butterchurn with audio context, analyser, and presets
- **`useVisualizer.ts`** - Orchestrator


# Main Hook: `useVisualizer`
Main orchestrator that handles visualizer setup, audio connection, canvas resizing, and rendering.

**Parameters:**
- `canvasRef` (RefObject) - React ref to the canvas element
- `isPlaying` (boolean) - Whether audio is currently playing
- `sequencerGainRef` (RefObject) - Reference to sequencer's gain node (from context)

**Returns:**
- `visualizerRef` (RefObject) - Reference to the Butterchurn visualizer instance
- `analyserRef` (RefObject) - Reference to the Web Audio analyser node
- `presetsRef` (RefObject) - Reference to cached preset objects

**Features:**
- Connects analyser to sequencer audio via `useAudioConnection`
- Handles canvas resizing with device pixel ratio
- Sets up Butterchurn visualizer with audio context and presets
- Manages continuous render loop via requestAnimationFrame
- Always renders (shows static visualization when no audio)

**Used in:** `Visualizer.jsx`


# Supporting Hooks:
## `useAudioConnection`

Connects the analyser to the sequencer gain node. Because refs do not trigger renders, it polls until the source becomes available and then stops polling once connected.

**Parameters:**
- `audioSourceRef` (RefObject) - Reference to the sequencer gain node
- `analyserRef` (RefObject) - Reference to the Web Audio analyser
- `audioCtxRef` (RefObject) - Reference to the Web Audio context
- `connectedGainRef` (RefObject) - Tracks the currently connected source

**Returns:** `connectAnalyser` (Function) - Manually triggers the connection

**Used internally by:** `useVisualizer`


## `useSetupVisualizer`

Sets up Butterchurn with audio context, analyser, and presets. Initializes the visualizer instance and connects it to audio analysis.

**Parameters:**
- `canvasRef` (RefObject) - React ref to the canvas element
- `visualizerRef` (RefObject) - React ref to store the visualizer instance
- `analyserRef` (RefObject) - React ref to store the analyser node
- `audioCtxRef` (RefObject) - React ref to store the audio context
- `presetsRef` (RefObject) - React ref to cache presets
- `connectedGainRef` (RefObject) - React ref to track connected gain node
- `connectAnalyser` (Function) - Function to connect analyser to audio source

**Returns:** `void`

**Used internally by:** `useVisualizer`


## `useRenderLoop`

Manages a requestAnimationFrame render loop for continuous canvas rendering.

**Parameters:**
- `renderCallback` (Function) - Function to call on each frame
- `isActive` (boolean, optional) - Whether the loop should be running (default: true)

**Returns:** `void`

**Used internally by:** `useVisualizer`


## `usePresetSwitching`

Manages preset selection, switching, and name display for the visualizer.

**Parameters:**
- `visualizerRef` (RefObject) - Reference to the Butterchurn visualizer instance
- `presetsRef` (RefObject) - Reference to the loaded presets object

**Returns:**
- `currentPresetSelection` (number) - Current preset index (0, 1, or 2)
- `presetName` (string) - Name of the current preset
- `switchPreset` (Function) - Function to switch presets ('next' | 'prev')

**Used in:** `Visualizer.jsx`


## `useCanvasResize`

Handles canvas sizing on window resize events.

**Parameters:**
- `canvasRef` (RefObject) - React ref to the canvas element
- `onResize` (Function, optional) - Callback when canvas is resized
  - Receives `{ width, height, dpr }` object

**Returns:** `void`

**Used internally by:** `useVisualizer`

