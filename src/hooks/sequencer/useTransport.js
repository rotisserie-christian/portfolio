import { useCallback } from 'react';
import * as Tone from 'tone';

/**
 * Manages Tone.js Transport play/stop functionality
 * 
 * @param {boolean} isPlaying - Current playback state
 * @param {Function} setIsPlaying - Function to update playback state
 * @param {Function} setCurrentStep - Function to reset step to 0
 * @param {Object} sequenceRef - React ref to Tone.Sequence instance
 * @param {Object} tempoBpmRef - React ref to current tempo value
 * @returns {Function} handlePlay - Function to start/stop playback
 */
export const useTransport = (
  isPlaying,
  setIsPlaying,
  setCurrentStep,
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
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
      // Reset state on error
      setIsPlaying(false);
      setCurrentStep(0);
    }
  }, [isPlaying, setIsPlaying, setCurrentStep, sequenceRef, tempoBpmRef]);

  return handlePlay;
};

