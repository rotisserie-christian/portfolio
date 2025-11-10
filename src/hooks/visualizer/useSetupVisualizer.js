import { useEffect } from 'react';
import * as Tone from 'tone';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';
import { createAnalyser } from './analyserSetup';
import { loadPreset } from './presetLoader';
import { PRESET_BLEND_TIME, MAX_DEVICE_PIXEL_RATIO } from '../../utils/visualizerConstants';

/**
 * Sets up Butterchurn visualizer with audio context, analyser, and presets
 * 
 * @param {Object} canvasRef - React ref to the canvas element
 * @param {Object} visualizerRef - React ref to store the visualizer instance
 * @param {Object} analyserRef - React ref to store the analyser node
 * @param {Object} audioCtxRef - React ref to store the audio context
 * @param {Object} presetsRef - React ref to cache presets
 * @param {Object} connectedGainRef - React ref to track connected gain node
 * @param {Function} connectAnalyser - Function to connect analyser to audio source
 * @returns {void}
 */
export const useSetupVisualizer = (
  canvasRef,
  visualizerRef,
  analyserRef,
  audioCtxRef,
  presetsRef,
  connectedGainRef,
  connectAnalyser
) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const audioCtx = Tone.getContext().rawContext;
      audioCtxRef.current = audioCtx;

      // Create and configure analyser for frequency analysis
      analyserRef.current = createAnalyser(audioCtx);
      
      // Try to connect immediately if audio source is available
      connectAnalyser();

      // Get initial canvas dimensions for visualizer setup
      const dpr = Math.min(MAX_DEVICE_PIXEL_RATIO, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const initialWidth = Math.max(1, Math.floor(rect.width * dpr));
      const initialHeight = Math.max(1, Math.floor(rect.height * dpr));
      
      const viz = butterchurn.createVisualizer(audioCtx, canvas, {
        width: initialWidth,
        height: initialHeight,
        pixelRatio: dpr,
      });
      viz.connectAudio(analyserRef.current);
      visualizerRef.current = viz;

      // Cache presets
      presetsRef.current = butterchurnPresets.getPresets();

      // Load initial preset (index 0 - first preset in our selection)
      loadPreset(viz, presetsRef.current, 0, PRESET_BLEND_TIME);
    } catch (error) {
      // Log error but don't crash the component
      console.error('Error setting up visualizer:', error);
      // Reset refs to safe state
      visualizerRef.current = null;
      analyserRef.current = null;
      presetsRef.current = null;
    }

    return () => {
      try {
        if (connectedGainRef.current && analyserRef.current) {
          connectedGainRef.current.disconnect(analyserRef.current);
          connectedGainRef.current = null;
        }
      } catch (err) {
        if (import.meta?.env?.MODE === 'development') {
          console.debug('visualizer disconnect error', err);
        }
      }
      if (visualizerRef.current) {
        try {
          visualizerRef.current.disconnect();
        } catch {
          // Ignore disconnect errors
        }
      }
    };
  }, [canvasRef, visualizerRef, analyserRef, audioCtxRef, presetsRef, connectedGainRef, connectAnalyser]);
};

