import { RefObject } from 'react';

/**
 * Partial interface for Butterchurn visualizer integration
 */
export interface ButterchurnVisualizer {
  connectAudio: (node: AnalyserNode | null) => void;
  render: () => void;
  setRendererSize: (width: number, height: number) => void;
  disconnect: () => void;
  loadPreset: (preset: any, blendTime: number) => void;
}

/**
 * State and refs managed by the visualizer hook
 */
export interface VisualizerState {
  visualizerRef: RefObject<ButterchurnVisualizer | null>;
  analyserRef: RefObject<AnalyserNode | null>;
  presetsRef: RefObject<any>;
}

/**
 * Result of the canvas resize logic
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}
