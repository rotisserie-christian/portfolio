import { FFT_SIZE, SMOOTHING_TIME_CONSTANT } from '../../../../utils/visualizerConstants';

/**
 * Creates and configures a Web Audio analyser node
 * 
 * @param {AudioContext} audioContext - Web Audio context
 * @param {number} fftSize - FFT size for frequency analysis (default: 2048)
 * @param {number} smoothingTimeConstant - Temporal smoothing (default: 0.3)
 * @returns {AnalyserNode} Configured analyser node
 */
export const createAnalyser = (
  audioContext,
  fftSize = FFT_SIZE,
  smoothingTimeConstant = SMOOTHING_TIME_CONSTANT
) => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = smoothingTimeConstant;
  return analyser;
};

