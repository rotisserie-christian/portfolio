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
 */
export interface DrumSequenceTrack {
  steps: boolean[];
}

/**
 * State and controls returned by the useSequencer hook
 */
export interface SequencerState {
  isPlaying: boolean;
  currentStepRef: RefObject<number>;
  handlePlay: () => void | Promise<void>;
  playersRef: RefObject<Record<string, Tone.Player>>;
  sequencerGainRef: RefObject<Tone.Gain | null>;
  isInitializing: boolean;
}

/**
 * Shared context between sequencer controls and visualizers
 */
export interface SequencerContextValue {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  sequencerGainRef: RefObject<Tone.Gain | null>;
}
