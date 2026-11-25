import { useEffect, useRef } from 'react';
import { useParentCanvasResize } from '../../hooks/useParentCanvasResize';
import {
  shouldRunVisualizerLoop,
  usePageVisible,
} from '../../hooks/usePageVisible';
import { useSyncRef } from '../../hooks/useSyncRef';
import { attachContextLossHandlers } from '../../webgl/glContext';
import { DEFAULT_SHADER_PRESET } from '../presets';
import { createShaderRenderer, readShaderAudioFeatures } from '../shaderRenderCore';

/**
 * RAF loop for the "shader" Crayonbrain sub-visualizer: a raw WebGL
 * fullscreen fragment shader driven by a preset from `presets/`.
 *
 * Per-frame GL + audio math lives in `shaderRenderCore.js`. This hook only
 * wires canvas resize, audio input, RAF, and context-loss recovery.
 */
export const useShaderVisualizer = ({
  canvasRef,
  visible = true,
  isPlaying = false,
  analyser = null,
  waveAnalyser = null,
  preset = DEFAULT_SHADER_PRESET,
}) => {
  const rafRef = useRef(null);
  const presetIdRef = useRef(preset);
  const isPlayingRef = useSyncRef(isPlaying);
  const freqDataRef = useRef(null);
  const timeDataRef = useRef(null);
  const rendererRef = useRef(null);
  const pageVisible = usePageVisible();
  const loopActive = shouldRunVisualizerLoop(visible, pageVisible);

  useEffect(() => {
    presetIdRef.current = preset;
    // Failed setups return a stub without setPreset — guard so a bad compile
    // doesn't take down the whole Create page when modes change.
    rendererRef.current?.setPreset?.(preset);
  }, [preset]);

  useParentCanvasResize(canvasRef, { enabled: visible });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loopActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return undefined;
    }

    let disposed = false;
    let lastFrameTime = performance.now();

    const setup = () => {
      rendererRef.current?.dispose();
      const renderer = createShaderRenderer({
        canvas,
        presetId: presetIdRef.current,
      });
      rendererRef.current = renderer;
      return renderer.ready;
    };

    const render = () => {
      if (disposed) return;

      const renderer = rendererRef.current;
      if (!renderer?.ready) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const rawDeltaMs = now - lastFrameTime;
      lastFrameTime = now;

      const rawFeatures = readShaderAudioFeatures(analyser, freqDataRef, timeDataRef, waveAnalyser);

      renderer.renderFrame({
        rawFeatures,
        deltaMs: rawDeltaMs,
        isPlaying: isPlayingRef.current,
      });

      rafRef.current = requestAnimationFrame(render);
    };

    const detachContextHandlers = attachContextLossHandlers(canvas, {
      onLost: () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      },
      onRestored: () => {
        if (setup()) {
          lastFrameTime = performance.now();
          rafRef.current = requestAnimationFrame(render);
        }
      },
    });

    if (setup()) {
      lastFrameTime = performance.now();
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      detachContextHandlers();
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [canvasRef, loopActive, analyser, waveAnalyser]);
};
