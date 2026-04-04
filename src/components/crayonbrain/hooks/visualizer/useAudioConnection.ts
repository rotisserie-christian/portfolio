import { useEffect, useRef, useCallback, RefObject } from 'react';
import * as Tone from 'tone';

/**
 * Manages audio analyser connection to the source with polling fallback
 * 
 * @param audioSourceRef - Reference to the audio source gain node
 * @param analyserRef - Reference to the Web Audio analyser node
 * @param audioCtxRef - Reference to the Web Audio context
 * @param connectedGainRef - Reference to track the currently connected gain node
 * @returns connectAnalyser - Function to manually trigger connection
 */
export const useAudioConnection = (
  audioSourceRef: RefObject<Tone.Gain | null>, 
  analyserRef: RefObject<AnalyserNode | null>, 
  audioCtxRef: RefObject<AudioContext | null>, 
  connectedGainRef: RefObject<any>
): () => void => {
  const pollingIntervalRef = useRef<number | null>(null);

  const connectAnalyser = useCallback(() => {
    if (!analyserRef.current || !audioCtxRef.current) return;
    
    const analyser = analyserRef.current;
    const audioCtx = audioCtxRef.current;
    const audioSource = audioSourceRef?.current;
    
    // Disconnect from previous source if any
    try {
      if (connectedGainRef.current) {
        if (connectedGainRef.current.disconnect) {
          connectedGainRef.current.disconnect(analyser);
        }
        (connectedGainRef as any).current = null;
      }
    } catch (err) {
      if (import.meta.env?.MODE === 'development') {
        console.debug('audio connection disconnect error', err);
      }
    }
    
    try {
      if (audioSource) {
        audioSource.connect(analyser);
        (connectedGainRef as any).current = audioSource;
      } else {
        // Fallback: gain node connected to master output
        const fallbackGain = audioCtx.createGain();
        fallbackGain.connect(analyser);
        (connectedGainRef as any).current = fallbackGain;
        
        const masterGain = (Tone.getDestination().input) as unknown as AudioNode;
        if (masterGain && masterGain.connect) {
          masterGain.connect(fallbackGain);
        } else {
          // Fallback: create a silent node
          const source = audioCtx.createMediaStreamDestination();
          source.connect(fallbackGain);
          console.warn('Using alternative audio routing fallback');
        }
      }
    } catch (err) {
      console.warn('failed to connect analyser to audio source', err);
    }
  }, [audioSourceRef, analyserRef, audioCtxRef, connectedGainRef]);

  // Reconnect when audioSourceRef becomes available
  // Polling approach since refs don't trigger re-renders
  useEffect(() => {
    let isCleanedUp = false;
    
    const checkConnection = () => {
      if (isCleanedUp) return;
      
      const audioSource = audioSourceRef?.current;
      const currentConnection = connectedGainRef.current;
      
      // If we have an audio source and it's different from what we're connected to, reconnect
      if (audioSource && analyserRef.current) {
        if (currentConnection !== audioSource) {
          connectAnalyser();
          // Stop polling once connected to audio source
          if (pollingIntervalRef.current && connectedGainRef.current === audioSource) {
            clearInterval(pollingIntervalRef.current);
            (pollingIntervalRef as any).current = null;
          }
        }
      }
    };
    
    checkConnection();
    
    // Poll periodically to catch when audioSourceRef becomes available
    // Stop polling once we're connected to the audio source
    (pollingIntervalRef as any).current = setInterval(() => {
      if (!connectedGainRef.current || connectedGainRef.current !== audioSourceRef?.current) {
        checkConnection();
      } else if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        (pollingIntervalRef as any).current = null;
      }
    }, 100);
    
    return () => {
      isCleanedUp = true;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        (pollingIntervalRef as any).current = null;
      }
    };
  }, [audioSourceRef, analyserRef, connectAnalyser, connectedGainRef]);

  return connectAnalyser;
};
