import { useEffect, RefObject } from 'react';
import * as Tone from 'tone';
import { TIME_STEPS } from '@/components/crayonbrain/utils/sequencerConstants';
import { DrumSound, DrumSequenceTrack } from '@/components/crayonbrain/types/sequencer';

/**
 * Sets up and manages Tone.Sequence 
 * 
 * @param stableDrumSounds - Memoized array of drum sound objects
 * @param playersRef - React ref containing Tone.Player instances
 * @param drumSequenceRef - React ref to current drum sequence pattern
 * @param sequenceRef - React ref to store Tone.Sequence instance
 * @param currentStepRef - React ref to store current step
 */
export const useToneSequence = (
  stableDrumSounds: DrumSound[],
  playersRef: RefObject<Record<string, Tone.Player>>,
  drumSequenceRef: RefObject<DrumSequenceTrack[]>,
  sequenceRef: RefObject<Tone.Sequence | null>,
  currentStepRef: RefObject<number>
): void => {
  useEffect(() => {
    (sequenceRef as any).current = new Tone.Sequence((time, step) => {
      // Only update highlighting if transport is still running
      if (Tone.getTransport().state !== 'started') {
        return;
      }
      
      // Update ref 
      (currentStepRef as any).current = step;
      
      const drumPad = document.querySelector('.demo-sequencer');
      if (drumPad) {
        const prevCells = drumPad.querySelectorAll('.drum-cell.playing');
        prevCells.forEach(cell => cell.classList.remove('playing'));
        
        const currentCells = drumPad.querySelectorAll(`.drum-cell[data-step="${step}"]`);
        currentCells.forEach(cell => cell.classList.add('playing'));
      }
      
      stableDrumSounds.forEach((sound, soundIndex) => {
        const track = drumSequenceRef.current?.[soundIndex];
        if (track?.steps[step]) {
          const player = playersRef.current?.[sound.id];
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
        (sequenceRef as any).current = null;
      }
      
      // Clear highlighting on cleanup
      const drumPad = document.querySelector('.demo-sequencer');
      if (drumPad) {
        const highlightedCells = drumPad.querySelectorAll('.drum-cell.playing');
        highlightedCells.forEach(cell => cell.classList.remove('playing'));
      }
    };
  }, [stableDrumSounds, drumSequenceRef, sequenceRef, currentStepRef]);
};
