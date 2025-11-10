### Utilities

**Functions:**
- **`cn.js`** - Merge Tailwind CSS classes using clsx and tailwind-merge

**Constants:**
- **`visualizerConstants.js`** - Visualizer configuration constants (shared across hooks and components)

---

#### Functions

##### `cn`

Merges Tailwind CSS classes using clsx and tailwind-merge. Enables conditional classes and removes duplicates.

**Parameters:**
- `...inputs` (string | object | array) - Class names or conditional class objects

**Returns:**
- `string` - Merged class names

**Used in:** `ShootingStars.jsx:1`, `StarsBackground.jsx:1`

---

#### Constants

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