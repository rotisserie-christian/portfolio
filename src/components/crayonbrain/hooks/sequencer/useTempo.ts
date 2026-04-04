import { useEffect, RefObject } from 'react';
import * as Tone from 'tone';

/**
 * Manages tempo synchronization between React state and Tone.js Transport
 * 
 * @param tempoBpm - Current tempo in BPM
 * @param tempoBpmRef - React ref to store current tempo value
 */
export const useTempo = (
  tempoBpm: number,
  tempoBpmRef: RefObject<number>
): void => {
  useEffect(() => {
    tempoBpmRef.current = tempoBpm;
    if (Tone.getTransport().state === 'started') {
      Tone.getTransport().bpm.value = tempoBpm;
    }
  }, [tempoBpm, tempoBpmRef]);
};
