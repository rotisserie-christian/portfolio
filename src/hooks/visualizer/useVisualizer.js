import { useEffect, useRef } from 'react';
import { useAudioConnection } from '../useAudioConnection';
import { useCanvasResize } from './useCanvasResize';
import { useRenderLoop } from './useRenderLoop';
import { useSetupVisualizer } from './useSetupVisualizer';

/**
 * Renders reactive visuals from the main audio output
 * 
 * @param {Object} canvasRef - React ref to the canvas element
 * @param {boolean} isPlaying -  Is audio playing
 * @param {Object} sequencerGainRef - Reference to sequencer's gain node
 * @returns {Object} Visualizer state and controls
 * @returns {Object} returns.visualizerRef - Reference to the Butterchurn visualizer instance
 * @returns {Object} returns.analyserRef - Reference to the Web Audio analyser node
 */
export const useVisualizer = (canvasRef, isPlaying, sequencerGainRef) => {
  const visualizerRef = useRef(null);
  const analyserRef = useRef(null);
  const presetsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const connectedGainRef = useRef(null);
  const audioCtxRef = useRef(null);


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
  // disabled because canvasRef does not change between renders 

  return {
    visualizerRef,
    analyserRef,
    presetsRef
  };
};

