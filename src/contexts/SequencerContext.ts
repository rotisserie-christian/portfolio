import { createContext } from 'react';
import { SequencerContextValue } from '../components/crayonbrain/types/sequencer';

export const SequencerContext = createContext<SequencerContextValue | null>(null);
