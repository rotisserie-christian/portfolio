import { useEffect, RefObject } from 'react';
import * as Tone from 'tone';
// @ts-ignore - butterchurn does not have types package
import butterchurn from 'butterchurn';
// @ts-ignore
import butterchurnPresets from 'butterchurn-presets';
import { createAnalyser } from './analyserSetup';
import { loadPreset } from './presetLoader';
import { PRESET_BLEND_TIME, MAX_DEVICE_PIXEL_RATIO } from '../../utils/visualizerConstants';
import { VisualizerSetupError } from '../../utils/errors';

/**
 * Sets up Butterchurn visualizer with audio context, analyser, and presets
 * 
 * @param canvasRef - React ref to the canvas element
 * @param visualizerRef - React ref to store the visualizer instance
 * @param analyserRef - React ref to store the analyser node
 * @param audioCtxRef - React ref to store the audio context
 * @param presetsRef - React ref to cache presets
 * @param connectedGainRef - React ref to track connected gain node
 * @param connectAnalyser - Function to connect analyser to audio source
 */
export const useSetupVisualizer = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  visualizerRef: RefObject<any>,
  analyserRef: RefObject<AnalyserNode | null>,
  audioCtxRef: RefObject<AudioContext | null>,
  presetsRef: RefObject<any>,
  connectedGainRef: RefObject<any>,
  connectAnalyser: () => void
): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const audioCtx = (Tone.getContext().rawContext) as AudioContext;
      (audioCtxRef as any).current = audioCtx;

      // Create and configure analyser for frequency analysis
      (analyserRef as any).current = createAnalyser(audioCtx);

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
      (visualizerRef as any).current = viz;

      // Cache presets
      (presetsRef as any).current = butterchurnPresets.getPresets();

      // Load initial preset: index 0 = $$$ Royal - Mashup (197)
      loadPreset(viz, presetsRef.current, 0, PRESET_BLEND_TIME);

      // Dispatch event to allow other components to sequence their loading
      window.dispatchEvent(new CustomEvent('butterchurn-loaded'));
      (window as any).butterchurnLoaded = true; // Also set a flag for components that mount after loading
    } catch (error) {
      const vizError = new VisualizerSetupError('Error setting up visualizer', error as Error);
      if (import.meta.env?.MODE === 'development') {
        console.error(vizError.message, vizError.cause);
      }
      // Reset refs to safe state
      (visualizerRef as any).current = null;
      (analyserRef as any).current = null;
      (presetsRef as any).current = null;
    }

    return () => {
      try {
        if (connectedGainRef.current && analyserRef.current) {
          if (connectedGainRef.current.disconnect) {
            connectedGainRef.current.disconnect(analyserRef.current);
          }
          (connectedGainRef as any).current = null;
        }
      } catch (err) {
        if (import.meta.env?.MODE === 'development') {
          console.debug('visualizer disconnect error', err);
        }
      }
      if (visualizerRef.current) {
        try {
          visualizerRef.current.disconnect();
        } catch (err) {
          if (import.meta.env?.MODE === 'development') {
            console.debug('visualizer disconnect error', err);
          }
        }
      }
    };
  }, [canvasRef, visualizerRef, analyserRef, audioCtxRef, presetsRef, connectedGainRef, connectAnalyser]);
};
