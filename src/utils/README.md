### Utilities

**Functions:**
- **`analyserSetup.js`** - Creates and configures Web Audio analyser nodes
- **`cn.js`** - Merge Tailwind CSS classes using clsx and tailwind-merge
- **`presetLoader.js`** - Loads Butterchurn presets

**Constants:**
- **`sequencerConstants.js`** - Sequencer configuration constants
- **`visualizerConstants.js`** - Visualizer configuration constants

---

#### Functions

##### `createAnalyser`

Creates and configures a Web Audio analyser node for frequency analysis.

**Parameters:**
- `audioContext` (AudioContext) - Web Audio context
- `fftSize` (number, optional) - FFT size for frequency analysis (default: 2048)
- `smoothingTimeConstant` (number, optional) - Temporal smoothing (default: 0.2)

**Returns:**
- `AnalyserNode` - Configured analyser node

**Used in:** `useSetupVisualizer.js:5`

---

##### `cn`

Merges Tailwind CSS classes using clsx and tailwind-merge. Enables conditional classes and removes duplicates.

**Parameters:**
- `...inputs` (string | object | array) - Class names or conditional class objects

**Returns:**
- `string` - Merged class names

**Used in:** `ShootingStars.jsx:1`, `StarsBackground.jsx:1`

---

##### `loadPreset`

Loads a Butterchurn preset into the visualizer with validation and error handling.

**Parameters:**
- `visualizer` (Object) - Butterchurn visualizer instance
- `presets` (Object) - Object containing preset data
- `presetIndex` (number, optional) - Index of preset to load (default: 58)
- `blendTime` (number, optional) - Time in seconds for preset transition (default: 1.0)

**Returns:**
- `boolean` - Whether preset was successfully loaded

**Used in:** `useSetupVisualizer.js:6`, `usePresetSwitching.js:2`

---

#### Constants

##### `sequencerConstants.js`

Configuration constants for the sequencer system.

**Exports:**
- `TIME_STEPS` (number) - Number of steps in sequence (8)
- `DEFAULT_TEMPO_BPM` (number) - Default tempo in BPM (170)

**Used in:** `useSequencer.js:2`, `useToneSequence.js:3`

---

##### `visualizerConstants.js`

Configuration constants for the visualizer system.

**Exports:**
- `FFT_SIZE` (number) - Frequency resolution (2048)
- `SMOOTHING_TIME_CONSTANT` (number) - Temporal smoothing (0.2)
- `DEFAULT_PRESET_INDEX` (number) - Default Butterchurn preset index (94)
- `PRESET_BLEND_TIME` (number) - Preset transition time in seconds (1.0)
- `PRESET_INDICES` (Array) - Map UI selection indices to actual preset indices [0, 54, 77]
- `MAX_DEVICE_PIXEL_RATIO` (number) - Maximum device pixel ratio (2)

**Used in:** `useSetupVisualizer.js:7`, `usePresetSwitching.js:3`, `Visualizer.jsx:6`