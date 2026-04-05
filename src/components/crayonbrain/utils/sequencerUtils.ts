import { TIME_STEPS, DARKER_STEP_INDICES } from './sequencerConstants';
import { DrumSequenceTrack } from '../types';

/**
 * Determines if a step should have a darker background to highlight 1/4 notes
 * @param timeStep - The step index (0-7)
 * @returns True if the step should be darker
 */
export const shouldBeDarkerStep = (timeStep: number): boolean => {
  return DARKER_STEP_INDICES.includes(timeStep);
};

/**
 * Creates a default drum sequence pattern
 * @param numSounds - Number of drum sounds (default: 6)
 * @returns Array of track objects with step patterns
 */
export const createDefaultSequence = (numSounds: number = 6): DrumSequenceTrack[] => {
  const defaultPatterns: boolean[][] = [
    [true, false, false, false, false, true, false, false],  // kick
    [false, false, true, false, false, false, true, false],  // snare
    [false, false, false, false, false, false, false, false], // snare2
    [true, false, false, false, true, false, false, false],  // hat
  ];
  
  // Fill remaining sounds with empty patterns
  const emptyPattern = Array(TIME_STEPS).fill(false);
  const patterns: boolean[][] = [...defaultPatterns];
  while (patterns.length < numSounds) {
    patterns.push([...emptyPattern]);
  }
  
  return patterns.map(steps => ({ steps }));
};

/**
 * Creates an empty sequence with all steps set to false
 * @param numTracks - Number of tracks in the sequence
 * @returns Array of track objects with all steps set to false
 */
export const createEmptySequence = (numTracks: number): DrumSequenceTrack[] => {
  return Array(numTracks).fill(null).map(() => ({
    steps: Array(TIME_STEPS).fill(false)
  }));
};

/**
 * Toggles a step in a drum sequence
 * @param sequence - Current drum sequence array
 * @param soundIndex - Index of the sound track to modify
 * @param stepIndex - Index of the step to toggle
 * @returns New sequence with the step toggled
 */
export const toggleStep = (
  sequence: DrumSequenceTrack[], 
  soundIndex: number, 
  stepIndex: number
): DrumSequenceTrack[] => {
  return sequence.map((track, currentSoundIndex) => {
    if (currentSoundIndex === soundIndex) {
      const newSteps = [...track.steps];
      newSteps[stepIndex] = !newSteps[stepIndex];
      return { ...track, steps: newSteps };
    }
    return track;
  });
};
