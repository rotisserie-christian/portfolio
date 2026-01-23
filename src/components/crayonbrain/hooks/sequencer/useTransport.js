import { useCallback } from 'react';
import * as Tone from 'tone';
import { TransportError } from '../../utils/errors';

/**
 * Manages Tone.js Transport play/stop functionality
 * 
 * @param {boolean} isPlaying - Current playback state
 * @param {Function} setIsPlaying - Function to update playback state
 * @param {Object} currentStepRef - React ref to store current step (avoids re-renders)
 * @param {Object} sequenceRef - React ref to Tone.Sequence instance
 * @param {Object} tempoBpmRef - React ref to current tempo value
 * @returns {Function} handlePlay - Function to start/stop playback
 */
export const useTransport = (
  isPlaying,
  setIsPlaying,
  currentStepRef,
  sequenceRef,
  tempoBpmRef
) => {
  const handlePlay = useCallback(async () => {
    try {
      if (Tone.getContext().state !== 'running') {
        await Tone.start();
      }

      if (!isPlaying) {
        if (!sequenceRef.current) {
          console.warn('Sequence not ready, cannot start playback');
          return;
        }
        
        Tone.getTransport().bpm.value = tempoBpmRef.current;
        sequenceRef.current.start();
        Tone.getTransport().start();
        
        // Update state after confirming transport started
        if (Tone.getTransport().state === 'started') {
          setIsPlaying(true);
        }
      } else {
        Tone.getTransport().stop();
        setIsPlaying(false);
        currentStepRef.current = 0;
        
        // Clear cell highlighting
        const drumPad = document.querySelector('.demo-sequencer');
        if (drumPad) {
          const highlightedCells = drumPad.querySelectorAll('.drum-cell.playing');
          highlightedCells.forEach(cell => cell.classList.remove('playing'));
        }
      }
    } catch (error) {
      const transportError = new TransportError('Error controlling playback', error);
      if (import.meta?.env?.MODE === 'development') {
        console.error(transportError.message, transportError.cause);
      }
      // Reset state on error
      setIsPlaying(false);
      currentStepRef.current = 0;
      
      // Clear cell highlighting
      const drumPad = document.querySelector('.demo-sequencer');
      if (drumPad) {
        const highlightedCells = drumPad.querySelectorAll('.drum-cell.playing');
        highlightedCells.forEach(cell => cell.classList.remove('playing'));
      }
    }
  }, [isPlaying, setIsPlaying, currentStepRef, sequenceRef, tempoBpmRef]);

  return handlePlay;
};

