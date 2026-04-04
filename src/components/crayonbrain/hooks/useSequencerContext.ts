import { useContext } from 'react';
import { SequencerContext } from '../../../contexts/SequencerContext';
import { SequencerContextError } from '../utils/errors';
import { SequencerContextValue } from '../types/sequencer';

/**
 * Hook to access sequencer context
 * @throws {SequencerContextError} If used outside SequencerProvider
 * @returns {SequencerContextValue} Sequencer context value with isPlaying, setIsPlaying, and sequencerGainRef
 */
export const useSequencerContext = (): SequencerContextValue => {
  const context = useContext(SequencerContext);
  if (!context) {
    throw new SequencerContextError();
  }
  return context;
};
