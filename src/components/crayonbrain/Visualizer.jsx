import { useEffect, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

const Visualizer = ({ className = '', presetLabel = 'Maxawow', canvasId, fillParent = false, isPlaying = true }) => {
  const canvasRef = useRef(null);
  const visualizerRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const presetsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const [isLoadingLibraries, setIsLoadingLibraries] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  // Dynamic import
  useEffect(() => {
    setIsLoadingLibraries(true);
    
    Promise.all([
      import('tone'),
      import('butterchurn'),
      import('butterchurn-presets')
    ])
    .then(([toneModule, butterchurnModule, presetsModule]) => {
      // Store Tone globally for the component
      window.Tone = toneModule.default;
      
      // Store butterchurn and presets
      window.butterchurn = butterchurnModule.default;
      window.butterchurnPresets = presetsModule.default;
      
      setLibrariesLoaded(true);
      setIsLoadingLibraries(false);
    })
    .catch(err => {
      console.error('Failed to load audio/visualization libraries:', err);
      setIsLoadingLibraries(false);
    });
  }, []);

  const resolvePresetKey = (label) => {
    const presets = presetsRef.current || {};
    const keys = Object.keys(presets);
    if (keys.length === 0) return null;
    const lc = (label || '').toLowerCase();

    // Variety buckets by common authors/themes
    const candidates = [];
    if (lc.includes('maxawow')) candidates.push('maxawow', 'sherwin');
    if (lc.includes('morph')) candidates.push('morph', 'orb');
    if (lc.includes('light')) candidates.push('lightning', 'tight light');
    if (lc.includes('fractal')) candidates.push('fractal', 'mandelbrot', 'julia', 'spiral', 'kaleidoscope');
    if (lc.includes('hurricane')) candidates.push('hurricane', 'nightmare');
    if (lc.includes('wormhole')) candidates.push('wormhole', 'pillars');

    // Try to match any token
    for (const token of candidates) {
      const found = keys.find(k => k.toLowerCase().includes(token));
      if (found) return found;
    }

    // Fallbacks by author variety
    const authorTokens = ['flexi', 'geiss', 'yomama', 'stahlregen', 'eos', 'rovastar', 'loadus'];
    for (const token of authorTokens) {
      const found = keys.find(k => k.toLowerCase().includes(token));
      if (found) return found;
    }

    // Absolute fallback
    return keys[0];
  };

  const loadPresetByLabel = useCallback((label, viz) => {
    const visualizer = viz || visualizerRef.current;
    if (!visualizer) return;
    const key = resolvePresetKey(label) || resolvePresetKey('Maxawow');
    const preset = presetsRef.current?.[key];
    if (!preset) return;
    try {
      visualizer.loadPreset(preset, 1.0);
      if (import.meta?.env?.MODE === 'development') {
        console.log(`ButterchurnVisualizer: Successfully loaded preset "${key}" for label "${label}"`);
      }
    } catch (err) {
      if (import.meta?.env?.MODE === 'development') {
        console.warn('ButterchurnVisualizer: failed to load selected preset', label, err);
      }
    }
  }, []);

  // audio and video pipeline 
  useEffect(() => {
    if (!librariesLoaded || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const Tone = window.Tone;
    const butterchurn = window.butterchurn;
    const butterchurnPresets = window.butterchurnPresets;

    const audioCtx = Tone.getContext().rawContext;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.3;
    try {
      const destination = Tone.getDestination();
      destination.input.connect(analyser);
    } catch (err) {
      console.warn('ButterchurnVisualizer: failed to connect analyser to Tone destination', err);
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

    // Initial preset
    loadPresetByLabel(presetLabel, viz);

    const render = () => {
      try {
        if (isPlayingRef.current) {
          viz.render();
        }
      } catch (err) {
        if (import.meta?.env?.MODE === 'development') {
          console.warn('ButterchurnVisualizer: render error', err);
        }
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      try {
        const destination = Tone.getDestination();
        destination.input.disconnect(analyser);
      } catch (err) {
        if (import.meta?.env?.MODE === 'development') {
          console.debug('ButterchurnVisualizer: disconnect error', err);
        }
      }
    };
  }, [librariesLoaded, presetLabel, loadPresetByLabel]);

  // Update playing state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Update preset when label changes
  useEffect(() => {
    if (librariesLoaded) {
      loadPresetByLabel(presetLabel);
    }
  }, [presetLabel, loadPresetByLabel, librariesLoaded]);

  const canvasClasses = fillParent
    ? 'w-full h-full lg:rounded-2xl shadow-lg'
    : 'w-full max-w-7xl h-[220px] md:h-[280px] lg:h-[360px] lg:rounded-2xl shadow-lg';

  if (isLoadingLibraries) {
    return (
      <div className={`w-full flex items-center justify-center ${className}`}>
        <div className="text-neutral-content/85">Loading audio libraries...</div>
      </div>
    );
  }

  if (!librariesLoaded) {
    return (
      <div className={`w-full flex items-center justify-center ${className}`}>
        <div className="text-red-400">Failed to load audio libraries</div>
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <canvas id={canvasId} ref={canvasRef} className={canvasClasses} />
    </div>
  );
};

Visualizer.propTypes = {
  className: PropTypes.string,
  presetLabel: PropTypes.string,
  canvasId: PropTypes.string,
  fillParent: PropTypes.bool,
  isPlaying: PropTypes.bool,
};

export default Visualizer;