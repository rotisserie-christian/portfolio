import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

/**
 * Renders reactive visuals, connects to main audio output to generate visual effects
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
  const rafRef = useRef(null);
  const presetsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const connectedGainRef = useRef(null);
  const audioCtxRef = useRef(null);

  const loadPreset = useCallback((viz) => {
    const visualizer = viz || visualizerRef.current;
    if (!visualizer) return;
    
    const presets = presetsRef.current || {};
    const keys = Object.keys(presets);
    if (keys.length === 0) return;
    
    // Set preset 
    const presetName = keys[58];
    const preset = presets[presetName];
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

  const connectAnalyser = useCallback(() => {
    if (!analyserRef.current || !audioCtxRef.current) return;
    
    const analyser = analyserRef.current;
    const audioCtx = audioCtxRef.current;
    const sequencerGain = sequencerGainRef?.current;
    
    // Disconnect from previous source if any
    try {
      if (connectedGainRef.current) {
        connectedGainRef.current.disconnect(analyser);
        connectedGainRef.current = null;
      }
    } catch {
      // Ignore disconnect errors
    }
    
    try {
      if (sequencerGain) {
        sequencerGain.connect(analyser);
        connectedGainRef.current = sequencerGain;
      } else {
        // Fallback: gain node connected to master output
        const fallbackGain = audioCtx.createGain();
        fallbackGain.connect(analyser);
        connectedGainRef.current = fallbackGain;
        
        const masterGain = Tone.getDestination().input;
        if (masterGain && masterGain.connect) {
          masterGain.connect(fallbackGain);
        } else {
          // Fallback: create a silent node
          const source = audioCtx.createMediaStreamDestination();
          source.connect(fallbackGain);
          console.warn('Using alternative audio routing fallback');
        }
      }
    } catch (err) {
      console.warn('failed to connect analyser to audio source', err);
    }
  }, [sequencerGainRef]);

  // Reconnect when sequencerGainRef becomes available
  // Polling approach since refs don't trigger re-renders
  useEffect(() => {
    let interval = null;
    let isCleanedUp = false;
    
    const checkConnection = () => {
      if (isCleanedUp) return;
      
      const sequencerGain = sequencerGainRef?.current;
      const currentConnection = connectedGainRef.current;
      
      // If we have a sequencer gain and it's different from what we're connected to, reconnect
      if (sequencerGain && analyserRef.current) {
        if (currentConnection !== sequencerGain) {
          connectAnalyser();
          // Stop polling once connected to sequencer gain
          if (interval && connectedGainRef.current === sequencerGain) {
            clearInterval(interval);
            interval = null;
          }
        }
      }
    };
    
    // Check immediately
    checkConnection();
    
    // Poll periodically to catch when sequencerGainRef becomes available
    // Stop polling once we're connected to the sequencer gain
    interval = setInterval(() => {
      if (!connectedGainRef.current || connectedGainRef.current !== sequencerGainRef?.current) {
        checkConnection();
      } else if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }, 100);
    
    return () => {
      isCleanedUp = true;
      if (interval) clearInterval(interval);
    };
  }, [sequencerGainRef, connectAnalyser]);

  // Audio and visual pipeline 
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const audioCtx = Tone.getContext().rawContext;
    audioCtxRef.current = audioCtx;

    // Splits audio into 2048 frequency bands (bass, mid, treble)
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.3;
    analyserRef.current = analyser;
    
    // Try to connect immediately if sequencerGain is available
    connectAnalyser();

    // listen for resize events and update the canvas size
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
        // Always render, but visualizer will show static if no audio
        viz.render();
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
        if (connectedGainRef.current) {
          connectedGainRef.current.disconnect(analyser);
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
  }, [loadPreset, connectAnalyser]); // eslint-disable-line react-hooks/exhaustive-deps
  // disabled because canvasRef does not change between renders 

  return {
    visualizerRef,
    analyserRef
  };
};
