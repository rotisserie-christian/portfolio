import { useCallback, useEffect, RefObject } from 'react';
import * as Tone from 'tone';
import { TransportError } from '@/components/crayonbrain/utils/errors';
import { clearPlayingStepHighlight } from '@/components/crayonbrain/utils/sequencerUtils';
import { registerSequencerStop, stopOtherSequencers } from '@/components/crayonbrain/utils/sequencerPlayback';

/**
 * Manages Tone.js Transport play/stop functionality
 * 
 * @param isPlaying - Current playback state
 * @param setIsPlaying - Function to update playback state
 * @param currentStepRef - React ref to store current step (avoids re-renders)
 * @param sequenceRef - React ref to Tone.Sequence instance
 * @param tempoBpmRef - React ref to current tempo value
 * @returns handlePlay - Function to start/stop playback
 */
export const useTransport = (
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void,
  currentStepRef: RefObject<number>,
  sequenceRef: RefObject<Tone.Part | Tone.Sequence | null>,
  tempoBpmRef: RefObject<number>,
  highlightRootRef: RefObject<HTMLElement | null>,
  instanceId: number
): () => Promise<void> => {
  const stopLocalPlayback = useCallback(() => {
    try {
      sequenceRef.current?.stop();
    } catch {
      // sequence may already be stopped
    }
    setIsPlaying(false);
    if (currentStepRef.current !== null) {
      currentStepRef.current = 0;
    }
    clearPlayingStepHighlight(highlightRootRef.current);
  }, [sequenceRef, setIsPlaying, currentStepRef, highlightRootRef]);

  useEffect(() => registerSequencerStop(instanceId, stopLocalPlayback), [instanceId, stopLocalPlayback]);

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

        stopOtherSequencers(instanceId);

        if (tempoBpmRef.current !== null) {
          Tone.getTransport().bpm.value = tempoBpmRef.current;
        }

        sequenceRef.current.start();
        Tone.getTransport().start();

        // Update state after confirming transport started
        if (Tone.getTransport().state === 'started') {
          setIsPlaying(true);
        }
      } else {
        Tone.getTransport().stop();
        stopLocalPlayback();
      }
    } catch (error) {
      const transportError = new TransportError('Error controlling playback', error as Error);
      if (import.meta.env?.MODE === 'development') {
        console.error(transportError.message, transportError.cause);
      }
      Tone.getTransport().stop();
      stopLocalPlayback();
    }
  }, [isPlaying, setIsPlaying, currentStepRef, sequenceRef, tempoBpmRef, highlightRootRef, instanceId, stopLocalPlayback]);

  return handlePlay;
};
