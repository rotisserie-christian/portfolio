import { FFT_SIZE, SMOOTHING_TIME_CONSTANT } from '@/components/crayonbrain/utils/visualizerConstants';

/**
 * Creates and configures a Web Audio analyser node
 * 
 * @param audioContext - Web Audio context
 * @param fftSize - FFT size for frequency analysis (default: 2048)
 * @param smoothingTimeConstant - Temporal smoothing (default: 0.3)
 * @returns Configured analyser node
 */
export const createAnalyser = (
  audioContext: BaseAudioContext,
  fftSize: number = FFT_SIZE,
  smoothingTimeConstant: number = SMOOTHING_TIME_CONSTANT
): AnalyserNode => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = smoothingTimeConstant;
  return analyser;
};
