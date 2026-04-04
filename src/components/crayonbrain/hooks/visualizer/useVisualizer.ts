import { useEffect, useRef, RefObject } from 'react';
import * as Tone from 'tone';
import { useAudioConnection } from './useAudioConnection';
import { useCanvasResize } from './useCanvasResize';
import { useRenderLoop } from './useRenderLoop';
import { useSetupVisualizer } from './useSetupVisualizer';

export interface VisualizerState {
  visualizerRef: RefObject<any>;
  analyserRef: RefObject<AnalyserNode | null>;
  presetsRef: RefObject<any>;
}

/**
 * Renders reactive visuals from the main audio output
 * 
 * @param canvasRef - React ref to the canvas element
 * @param isPlaying - Is audio playing
 * @param sequencerGainRef - Reference to sequencer's gain node
 * @returns Visualizer state and controls
 */
export const useVisualizer = (
  canvasRef: RefObject<HTMLCanvasElement | null>, 
  isPlaying: boolean, 
  sequencerGainRef: RefObject<Tone.Gain | null>
): VisualizerState => {
  const visualizerRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const presetsRef = useRef<any>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const connectedGainRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Update playing state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Use audio connection hook to manage analyser connection
  const connectAnalyser = useAudioConnection(
    sequencerGainRef,
    analyserRef,
    audioCtxRef,
    connectedGainRef
  );

  // Handle canvas resize with DPR
  useCanvasResize(canvasRef, ({ width, height }) => {
    if (visualizerRef.current) {
      visualizerRef.current.setRendererSize(width, height);
    }
  });

  // Set up Butterchurn visualizer with audio context, analyser, and presets
  useSetupVisualizer(
    canvasRef,
    visualizerRef,
    analyserRef,
    audioCtxRef,
    presetsRef,
    connectedGainRef,
    connectAnalyser
  );

  // Start render loop
  useRenderLoop(() => {
    if (visualizerRef.current) {
      // Always render, but visualizer will show static if no audio
      visualizerRef.current.render();
    }
  }, true);

  return {
    visualizerRef,
    analyserRef,
    presetsRef
  };
};
