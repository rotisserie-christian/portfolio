import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

export const useVisualizer = (canvasRef, isPlaying, sequencerGainRef) => {
  const visualizerRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const presetsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);

  const loadPreset = useCallback((viz) => {
    const visualizer = viz || visualizerRef.current;
    if (!visualizer) return;
    
    const presets = presetsRef.current || {};
    const keys = Object.keys(presets);
    if (keys.length === 0) return;
    
    // Just use the first available preset
    const preset = presets[keys[0]];
    if (!preset) return;
    
    try {
      visualizer.loadPreset(preset, 1.0);
    } catch (err) {
      console.warn('failed to load preset', err);
    }
  }, []);

  // Update playing state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // audio and video pipeline 
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const audioCtx = Tone.getContext().rawContext;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.3;
    
    // Capture the ref value to avoid stale closure issues
    const sequencerGain = sequencerGainRef?.current;
    
    try {
      if (sequencerGain) {
        // Connect to sequencer audio if available
        sequencerGain.connect(analyser);
      } else {
        // Fallback to master destination
        const destination = Tone.getDestination();
        destination.input.connect(analyser);
      }
    } catch (err) {
      console.warn('failed to connect analyser to audio source', err);
    }
    analyserRef.current = analyser;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      if (visualizerRef.current) {
        visualizerRef.current.setRendererSize(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const viz = butterchurn.createVisualizer(audioCtx, canvas, {
      width: canvas.width,
      height: canvas.height,
      pixelRatio: dpr,
    });
    viz.connectAudio(analyser);
    visualizerRef.current = viz;

    // Cache presets
    presetsRef.current = butterchurnPresets.getPresets();

    // Load preset
    loadPreset(viz);

    const render = () => {
      try {
        if (isPlayingRef.current) {
          viz.render();
        }
      } catch (err) {
        if (import.meta?.env?.MODE === 'development') {
          console.warn('visualizer render error', err);
        }
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      try {
        if (sequencerGain) {
          sequencerGain.disconnect(analyser);
        } else {
          const destination = Tone.getDestination();
          destination.input.disconnect(analyser);
        }
      } catch (err) {
        if (import.meta?.env?.MODE === 'development') {
          console.debug('visualizer disconnect error', err);
        }
      }
    };
  }, [loadPreset, sequencerGainRef]); // eslint-disable-line react-hooks/exhaustive-deps
  // disabled because canvasRef does not change between renders 

  return {
    visualizerRef,
    analyserRef
  };
};
