import { useEffect } from 'react';
import * as Tone from 'tone';
import { TIME_STEPS } from '../../utils/sequencerConstants';

/**
 * Sets up and manages Tone.Sequence 
 * 
 * @param {Array} stableDrumSounds - Memoized array of drum sound objects
 * @param {Object} playersRef - React ref containing Tone.Player instances
 * @param {Object} drumSequenceRef - React ref to current drum sequence pattern
 * @param {Object} sequenceRef - React ref to store Tone.Sequence instance
 * @param {Function} setCurrentStep - Function to update current step state
 * @returns {void}
 */
export const useToneSequence = (
  stableDrumSounds,
  playersRef,
  drumSequenceRef,
  sequenceRef,
  setCurrentStep
) => {
  useEffect(() => {
    sequenceRef.current = new Tone.Sequence((time, step) => {
      setCurrentStep(step);
      
      stableDrumSounds.forEach((sound, soundIndex) => {
        const track = drumSequenceRef.current[soundIndex];
        if (track?.steps[step]) {
          const player = playersRef.current[sound.id];
          if (player && player.loaded) {
            player.start(time);
          }
        }
      });
    }, [...Array(TIME_STEPS).keys()], `${TIME_STEPS}n`);

    return () => {
      if (sequenceRef.current) {
        try { 
          sequenceRef.current.stop(); 
        } catch (error) {
          console.warn('Error stopping sequence:', error);
        }
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      }
    };
  }, [stableDrumSounds, playersRef, drumSequenceRef, sequenceRef, setCurrentStep]);
};

