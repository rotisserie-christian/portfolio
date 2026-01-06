import { useContext } from 'react';
import { SequencerContext } from '../../../contexts/SequencerContext.js';
import { SequencerContextError } from '../utils/errors';

/**
 * Hook to access sequencer context
 * @throws {SequencerContextError} If used outside SequencerProvider
 * @returns {Object} Sequencer context value with isPlaying, setIsPlaying, and sequencerGainRef
 */
export const useSequencerContext = () => {
  const context = useContext(SequencerContext);
  if (!context) {
    throw new SequencerContextError();
  }
  return context;
};

