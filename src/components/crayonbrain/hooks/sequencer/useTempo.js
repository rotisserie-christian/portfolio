import { useEffect } from 'react';
import * as Tone from 'tone';

/**
 * Manages tempo synchronization between React state and Tone.js Transport
 * 
 * @param {number} tempoBpm - Current tempo in BPM
 * @param {Object} tempoBpmRef - React ref to store current tempo value
 * @returns {void}
 */
export const useTempo = (tempoBpm, tempoBpmRef) => {
  useEffect(() => {
    tempoBpmRef.current = tempoBpm;
    if (Tone.getTransport().state === 'started') {
      Tone.getTransport().bpm.value = tempoBpm;
    }
  }, [tempoBpm, tempoBpmRef]);
};

