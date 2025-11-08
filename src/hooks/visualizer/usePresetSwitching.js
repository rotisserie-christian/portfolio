import { useState, useEffect } from 'react';
import { loadPreset } from '../../utils/presetLoader';
import { PRESET_BLEND_TIME, PRESET_INDICES } from '../../utils/visualizerConstants';

/**
 * Manages preset switching logic for the visualizer
 * @param {React.RefObject} visualizerRef - Reference to the Butterchurn visualizer instance
 * @param {React.RefObject} presetsRef - Reference to the loaded presets object
 * @returns {{ currentPresetSelection: number, presetName: string, switchPreset: (direction: 'next' | 'prev') => void }}
 */
export const usePresetSwitching = (visualizerRef, presetsRef) => {
  const [currentPresetSelection, setCurrentPresetSelection] = useState(0); // 0, 1, or 2
  const [presetsLoaded, setPresetsLoaded] = useState(false);

  // Polling to see if presets are loaded (refs don't trigger re-renders)
  useEffect(() => {
    if (presetsLoaded) return;
    
    const checkPresets = () => {
      if (presetsRef.current) {
        setPresetsLoaded(true);
      }
    };
    
    checkPresets();
    
    // Poll every 100ms until presets are loaded
    const interval = setInterval(checkPresets, 100);
    
    return () => clearInterval(interval);
  }, [presetsLoaded, presetsRef]);

  const getPresetName = () => {
    if (!presetsRef.current) return 'Loading...';
    const keys = Object.keys(presetsRef.current);
    const actualIndex = PRESET_INDICES[currentPresetSelection];
    if (actualIndex >= 0 && actualIndex < keys.length) {
      return keys[actualIndex];
    }
    return 'Unknown Preset';
  };

  // Handle preset switching
  const switchPreset = (direction) => {
    if (!visualizerRef.current || !presetsRef.current) return;
    
    let newSelection;
    if (direction === 'next') {
      newSelection = (currentPresetSelection + 1) % PRESET_INDICES.length;
    } else {
      newSelection = (currentPresetSelection - 1 + PRESET_INDICES.length) % PRESET_INDICES.length;
    }
    
    setCurrentPresetSelection(newSelection);
    const actualPresetIndex = PRESET_INDICES[newSelection];
    loadPreset(visualizerRef.current, presetsRef.current, actualPresetIndex, PRESET_BLEND_TIME);
  };

  // Load preset when selection changes or when visualizer initializes
  useEffect(() => {
    if (visualizerRef.current && presetsRef.current) {
      const actualPresetIndex = PRESET_INDICES[currentPresetSelection];
      loadPreset(visualizerRef.current, presetsRef.current, actualPresetIndex, PRESET_BLEND_TIME);
    }
  }, [currentPresetSelection, visualizerRef, presetsRef]);

  return {
    currentPresetSelection,
    presetName: getPresetName(),
    switchPreset,
  };
};

