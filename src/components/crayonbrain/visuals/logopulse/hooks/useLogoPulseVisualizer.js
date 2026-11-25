import { useEffect, useRef } from 'react';
import { useParentCanvasResize } from '../../hooks/useParentCanvasResize';
import {
  shouldRunVisualizerLoop,
  usePageVisible,
} from '../../hooks/usePageVisible';
import { useSyncRef } from '../../hooks/useSyncRef';
import { getCanvasDrawingSize } from '../../getCanvasDrawingSize';
import { createLogoPulseRenderer } from '../logoPulseRenderCore';
import {
  DEFAULT_LOGOPULSE_MODE,
  DEFAULT_LOGOPULSE_SETTINGS,
} from '../logoPulseConstants';

/**
 * Canvas RAF loop for Logo Pulse.
 * Audio + resize + image loading live here; draw logic is in logoPulseRenderCore.
 */
export const useLogoPulseVisualizer = ({
  canvasRef,
  visible = true,
  isPlaying = false,
  analyser = null,
  mode = DEFAULT_LOGOPULSE_MODE,
  logoSrc = null,
  backgroundSrc = null,
  settings = DEFAULT_LOGOPULSE_SETTINGS,
  overlay = false,
}) => {
  const rafRef = useRef(null);
  const rendererRef = useRef(null);
  const isPlayingRef = useSyncRef(isPlaying);
  const modeRef = useSyncRef(mode);
  const logoSrcRef = useSyncRef(logoSrc);
  const backgroundSrcRef = useSyncRef(backgroundSrc);
  const settingsRef = useSyncRef(settings);
  const lastFrameTimeRef = useRef(performance.now());
  const pageVisible = usePageVisible();
  const loopActive = shouldRunVisualizerLoop(visible, pageVisible);
  useParentCanvasResize(canvasRef, { enabled: visible });

  // Keep mode and settings in sync without tearing down the RAF loop.
  useEffect(() => {
    rendererRef.current?.setMode?.(mode);
  }, [mode]);

  useEffect(() => {
    rendererRef.current?.setSettings?.(settings);
  }, [settings]);

  // Load / swap logo image whenever src changes.
  useEffect(() => {
    if (!logoSrc) {
      rendererRef.current?.setLogoImage?.(null);
      return undefined;
    }

    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      rendererRef.current?.setLogoImage?.(img);
    };
    img.onerror = () => {
      if (cancelled) return;
      rendererRef.current?.setLogoImage?.(null);
    };
    img.src = logoSrc;

    return () => {
      cancelled = true;
    };
  }, [logoSrc]);

  useEffect(() => {
    if (!backgroundSrc) {
      rendererRef.current?.setBackgroundImage?.(null);
      return undefined;
    }

    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      rendererRef.current?.setBackgroundImage?.(img);
    };
    img.onerror = () => {
      if (cancelled) return;
      rendererRef.current?.setBackgroundImage?.(null);
    };
    img.src = backgroundSrc;

    return () => {
      cancelled = true;
    };
  }, [backgroundSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    if (!loopActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return undefined;
    }

    const renderer = createLogoPulseRenderer({
      canvas,
      mode: modeRef.current,
      settings: settingsRef.current,
      overlay,
    });
    if (!renderer.ready) return undefined;
    renderer.resetState();
    rendererRef.current = renderer;

    // If an image already loaded before this effect ran, re-apply it.
    if (logoSrcRef.current) {
      const img = new Image();
      img.onload = () => renderer.setLogoImage(img);
      img.src = logoSrcRef.current;
    }
    if (backgroundSrcRef.current) {
      const img = new Image();
      img.onload = () => renderer.setBackgroundImage(img);
      img.src = backgroundSrcRef.current;
    }

    let dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let timeArray = analyser ? new Uint8Array(analyser.fftSize) : null;

    const render = () => {
      if (!canvas) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      const { width, height } = getCanvasDrawingSize(canvas);
      if (width <= 0 || height <= 0) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      let freqData = null;
      let timeData = null;
      if (analyser) {
        if (!dataArray || dataArray.length !== analyser.frequencyBinCount) {
          dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
        if (!timeArray || timeArray.length !== analyser.fftSize) {
          timeArray = new Uint8Array(analyser.fftSize);
        }
        analyser.getByteFrequencyData(dataArray);
        analyser.getByteTimeDomainData(timeArray);
        freqData = dataArray;
        timeData = timeArray;
      }

      renderer.renderFrame({
        freqData,
        timeData,
        deltaMs,
        sampleRate: analyser?.context?.sampleRate || 44100,
        isPlaying: isPlayingRef.current,
        width,
        height,
      });

      rafRef.current = requestAnimationFrame(render);
    };

    lastFrameTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (rendererRef.current === renderer) rendererRef.current = null;
    };
  }, [
    canvasRef,
    loopActive,
    analyser,
    overlay,
    modeRef,
    logoSrcRef,
    backgroundSrcRef,
    settingsRef,
    isPlayingRef,
  ]);
};
