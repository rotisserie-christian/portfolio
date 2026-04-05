/**
 * Props for the Visualizer component
 */
export interface VisualizerProps {
  className?: string;
  canvasId: string;
  fillParent?: boolean;
}

/**
 * Props for the SequencerControls component
 */
export interface SequencerControlsProps {
  isPlaying: boolean;
  isInitializing: boolean;
  onPlay: () => void;
  onClear: () => void;
}

/**
 * Props for the TempoSlider component
 */
export interface TempoSliderProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

/**
 * Props for the DrumPad component
 */
export interface DrumPadProps {
  drumSounds: Array<{ id: string; name: string }>;
  drumSequence: boolean[][];
  isPlaying: boolean;
  onCellClick: (soundIndex: number, stepIndex: number) => void;
}
