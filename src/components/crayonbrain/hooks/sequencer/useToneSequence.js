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
 * @param {Object} currentStepRef - React ref to store current step (avoids re-renders)
 * @returns {void}
 */
export const useToneSequence = (
  stableDrumSounds,
  playersRef,
  drumSequenceRef,
  sequenceRef,
  currentStepRef
) => {
  useEffect(() => {
    sequenceRef.current = new Tone.Sequence((time, step) => {
      // Update ref 
      currentStepRef.current = step;
      
      const drumPad = document.querySelector('.demo-sequencer');
      if (drumPad) {
        // Remove previous step highlighting
        const prevCells = drumPad.querySelectorAll('.drum-cell.playing');
        prevCells.forEach(cell => cell.classList.remove('playing'));
        
        // Add highlighting to current step cells
        const currentCells = drumPad.querySelectorAll(`.drum-cell[data-step="${step}"]`);
        currentCells.forEach(cell => cell.classList.add('playing'));
      }
      
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
  }, [stableDrumSounds, drumSequenceRef, sequenceRef, currentStepRef]);
};

