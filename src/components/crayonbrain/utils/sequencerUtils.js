import { TIME_STEPS, DARKER_STEP_INDICES } from './sequencerConstants';

/**
 * Determines if a step should have a darker background to highlight 1/4 notes
 * @param {number} timeStep - The step index (0-7)
 * @returns {boolean} - True if the step should be darker
 */
export const shouldBeDarkerStep = (timeStep) => {
  return DARKER_STEP_INDICES.includes(timeStep);
};

/**
 * Creates a default drum sequence pattern
 * @param {number} numSounds - Number of drum sounds (default: 6)
 * @returns {Array} - Array of track objects with step patterns
 */
export const createDefaultSequence = (numSounds = 6) => {
  const defaultPatterns = [
    [true, false, false, false, false, true, false, false],  // kick
    [false, false, true, false, false, false, true, false],  // snare
    [false, false, false, false, false, false, false, false], // snare2
    [true, false, false, false, true, false, false, false],  // hat
  ];
  
  // Fill remaining sounds with empty patterns
  const emptyPattern = Array(TIME_STEPS).fill(false);
  const patterns = [...defaultPatterns];
  while (patterns.length < numSounds) {
    patterns.push([...emptyPattern]);
  }
  
  return patterns.map(steps => ({ steps }));
};

/**
 * Creates an empty sequence with all steps set to false
 * @param {number} numTracks - Number of tracks in the sequence
 * @returns {Array} - Array of track objects with all steps set to false
 */
export const createEmptySequence = (numTracks) => {
  return Array(numTracks).fill(null).map(() => ({
    steps: Array(TIME_STEPS).fill(false)
  }));
};

/**
 * Toggles a step in a drum sequence
 * @param {Array} sequence - Current drum sequence array
 * @param {number} soundIndex - Index of the sound track to modify
 * @param {number} stepIndex - Index of the step to toggle
 * @returns {Array} - New sequence with the step toggled
 */
export const toggleStep = (sequence, soundIndex, stepIndex) => {
  return sequence.map((track, currentSoundIndex) => {
    if (currentSoundIndex === soundIndex) {
      const newSteps = [...track.steps];
      newSteps[stepIndex] = !newSteps[stepIndex];
      return { ...track, steps: newSteps };
    }
    return track;
  });
};
