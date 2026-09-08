import { useEffect, RefObject } from 'react';
import * as Tone from 'tone';
import { TIME_STEPS } from '@/components/crayonbrain/utils/sequencerConstants';
import { setPlayingStepHighlight, clearPlayingStepHighlight } from '@/components/crayonbrain/utils/sequencerUtils';
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
  currentStepRef: RefObject<number>,
  highlightRootRef: RefObject<HTMLElement | null>
): void => {
  useEffect(() => {
    (sequenceRef as any).current = new Tone.Sequence((time, step) => {
      // Only update highlighting if transport is still running
      if (Tone.getTransport().state !== 'started') {
        return;
      }
      
      // Update ref 
      (currentStepRef as any).current = step;
      setPlayingStepHighlight(highlightRootRef.current, step);
      
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
      
      clearPlayingStepHighlight(highlightRootRef.current);
    };
  }, [stableDrumSounds, drumSequenceRef, sequenceRef, currentStepRef, highlightRootRef]);
};
