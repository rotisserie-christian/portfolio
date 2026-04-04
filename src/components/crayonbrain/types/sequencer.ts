import { RefObject } from 'react';
import * as Tone from 'tone';

/**
 * Drum sound asset
 */
export interface DrumSound {
  id: string;
  name: string;
  src: string;
}

/**
 * Sequence track for a specific sound
 * pattern: Array of 0 (off) or 1 (on)
 */
export interface DrumSequenceTrack {
  id: string;
  name: string;
  pattern: number[];
}

/**
 * State and controls returned by the useSequencer hook
 */
export interface SequencerState {
  isPlaying: boolean;
  currentStepRef: RefObject<number>;
  handlePlay: () => void;
  playersRef: RefObject<Record<string, Tone.Player>>;
  sequencerGainRef: RefObject<Tone.Gain | null>;
  isInitializing: boolean;
}
