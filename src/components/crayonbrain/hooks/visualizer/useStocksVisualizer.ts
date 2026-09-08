import { useEffect, useRef, RefObject } from 'react';
import * as Tone from 'tone';
import { useAudioConnection } from './useAudioConnection';
import { useCanvasResize } from './useCanvasResize';
import { createAnalyser } from './analyserSetup';
import { createStocksRenderer } from '@/components/crayonbrain/utils/stocksRenderCore';
import { DEFAULT_STOCKS_PRESET } from '@/components/crayonbrain/utils/stocksConstants';
import { getCanvasDrawingSize } from '@/components/crayonbrain/utils/stocksHelpers';

const readEnergy = (analyser: AnalyserNode, dataArray: Uint8Array) => {
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
  return sum / dataArray.length / 255;
};

export const useStocksVisualizer = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  isPlaying: boolean,
  sequencerGainRef: RefObject<Tone.Gain | null>,
  bpm = 120,
  mode: string = DEFAULT_STOCKS_PRESET
) => {
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<ReturnType<typeof createStocksRenderer> | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const bpmRef = useRef(bpm);
  const lastFrameTimeRef = useRef(performance.now());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const connectedGainRef = useRef<any>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    bpmRef.current = bpm;
    rendererRef.current?.setBpm?.(bpm);
  }, [bpm]);

  const connectAnalyser = useAudioConnection(
    sequencerGainRef,
    analyserRef,
    audioCtxRef,
    connectedGainRef
  );

  useCanvasResize(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;

    try {
      const audioCtx = Tone.getContext().rawContext as AudioContext;
      audioCtxRef.current = audioCtx;
      analyserRef.current = createAnalyser(audioCtx);
      connectAnalyser();
    } catch (err) {
      if (import.meta.env?.MODE === 'development') {
        console.warn('stocks analyser setup failed', err);
      }
    }

    const renderer = createStocksRenderer({ canvas, mode, bpm: bpmRef.current });
    if (!renderer.ready) return undefined;
    renderer.resetState(mode, bpmRef.current);
    rendererRef.current = renderer;

    let dataArray = analyserRef.current
      ? new Uint8Array(analyserRef.current.frequencyBinCount)
      : null;

    const render = () => {
      const now = performance.now();
      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      const { width, height } = getCanvasDrawingSize(canvas);
      if (width > 0 && height > 0) {
        let instEnergy = 0.3;
        const analyser = analyserRef.current;
        if (analyser) {
          if (!dataArray || dataArray.length !== analyser.frequencyBinCount) {
            dataArray = new Uint8Array(analyser.frequencyBinCount);
          }
          instEnergy = readEnergy(analyser, dataArray);
        }

        renderer.renderFrame({
          energy: instEnergy,
          deltaMs,
          isPlaying: isPlayingRef.current,
          width,
          height,
        });
      }

      rafRef.current = requestAnimationFrame(render);
    };

    lastFrameTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (rendererRef.current === renderer) rendererRef.current = null;
      try {
        if (connectedGainRef.current && analyserRef.current) {
          connectedGainRef.current.disconnect(analyserRef.current);
          connectedGainRef.current = null;
        }
      } catch {
        // ignore disconnect errors
      }
    };
  }, [canvasRef, analyserRef, audioCtxRef, connectedGainRef, connectAnalyser, mode]);
};
