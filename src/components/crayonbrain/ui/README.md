- **`DrumPad.jsx`** - Grid for step sequencing
- **`PresetControls.jsx`** - Controls for visualizer presets
- **`SequencerControls.jsx`** - Play/Stop and Clear buttons for sequencer
- **`TempoSlider.jsx`** - BPM tempo control with slider and increment/decrement buttons

## `DrumPad`
**Parameters:**
- `drumSounds` (Array) - Array of drum sound objects { id, name, src }
- `drumSequence` (Array) - Array of objects, each with a `steps` property containing an array of booleans
- `currentStep` (number) - Current step in sequence (0-7)
- `isPlaying` (boolean) - Whether sequencer is currently playing
- `onCellClick` (Function) - Callback when a step cell is clicked (soundIndex, stepIndex)

**Returns:** JSX element

**Used in:** `DemoSequencer.jsx:77`

## `SequencerControls`
**Parameters:**
- `isPlaying` (boolean) - Whether sequencer is currently playing
- `isInitializing` (boolean) - Whether audio players are still loading
- `onPlay` (Function) - Callback when Play/Stop button is clicked
- `onClear` (Function) - Callback when Clear button is clicked

**Used in:** `DemoSequencer.jsx:68`

## `TempoSlider`
**Parameters:**
- `bpm` (number) - Current tempo in BPM
- `onBpmChange` (Function) - Callback: called with a value (if using slider) or function (if incrementing using the icons) 
- `minBpm` (number, optional) - Minimum BPM (default: 75)
- `maxBpm` (number, optional) - Maximum BPM (default: 175)

**Used in:** `DemoSequencer.jsx:75`

## `PresetControls`
**Parameters:**
- `currentPresetSelection` (number) - Current preset index (0, 1, or 2)
- `presetName` (string) - Name of the current preset
- `onPrevious` (Function) - Callback when Previous button is clicked
- `onNext` (Function) - Callback when Next button is clicked
- `totalPresets` (number, optional) - Total number of presets (default: 3)

**Used in:** `Visualizer.jsx:26`
