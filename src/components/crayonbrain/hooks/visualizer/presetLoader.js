/**
 * Loads a Butterchurn preset into the visualizer
 * 
 * @param {Object} visualizer - Butterchurn visualizer instance
 * @param {Object} presets - Object containing preset data
 * @param {number} presetIndex - Index of preset to load
 * @param {number} blendTime - Time in seconds for preset transition
 * @returns {boolean} Whether preset was successfully loaded
 */
export const loadPreset = (visualizer, presets, presetIndex = 58, blendTime = 1.0) => {
  if (!visualizer) {
    console.warn('Cannot load preset: visualizer is not initialized');
    return false;
  }

  if (!presets || typeof presets !== 'object') {
    console.warn('Cannot load preset: presets data is invalid');
    return false;
  }

  const keys = Object.keys(presets);
  if (keys.length === 0) {
    console.warn('Cannot load preset: no presets available');
    return false;
  }

  // Validate preset index
  if (presetIndex < 0 || presetIndex >= keys.length) {
    console.warn(`Preset index ${presetIndex} is out of range (0-${keys.length - 1})`);
    return false;
  }

  const presetName = keys[presetIndex];
  const preset = presets[presetName];
  
  if (!preset) {
    console.warn(`Preset at index ${presetIndex} (${presetName}) is not available`);
    return false;
  }

  try {
    visualizer.loadPreset(preset, blendTime);
    return true;
  } catch (err) {
    console.warn('Failed to load preset:', err);
    return false;
  }
};

