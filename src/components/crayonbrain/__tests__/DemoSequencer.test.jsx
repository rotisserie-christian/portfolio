import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import DemoSequencer from '../DemoSequencer';
import { SequencerProvider } from '../../../contexts/SequencerContext.jsx';
import { useSequencer } from '../hooks/sequencer/useSequencer';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

// Mock the hooks
vi.mock('../hooks/sequencer/useSequencer', () => ({
  useSequencer: vi.fn()
}));

vi.mock('../../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: vi.fn()
}));

// Mock UI components
vi.mock('../ui/TempoSlider', () => ({
  default: () => <div data-testid="tempo-slider">TempoSlider</div>
}));

vi.mock('../ui/SequencerControls', () => ({
  default: ({ isPlaying, isInitializing, onPlay }) => (
    <div data-testid="sequencer-controls">
      <button onClick={onPlay} disabled={isInitializing}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  )
}));

vi.mock('../ui/DrumPad', () => ({
  default: () => <div data-testid="drum-pad">DrumPad</div>
}));

describe('DemoSequencer Component (Light)', () => {
  const defaultHookReturn = {
    isPlaying: false,
    handlePlay: vi.fn(),
    sequencerGainRef: { current: null },
    isInitializing: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useIntersectionObserver).mockReturnValue({
      elementRef: { current: null },
      hasIntersected: true
    });
    vi.mocked(useSequencer).mockReturnValue(defaultHookReturn);
  });

  const renderWithProvider = () => {
    return render(
      <SequencerProvider>
        <DemoSequencer />
      </SequencerProvider>
    );
  };

  it('renders correctly in its base state', () => {
    renderWithProvider();

    expect(screen.getByTestId('sequencer-controls')).toBeInTheDocument();
    expect(screen.getByTestId('tempo-slider')).toBeInTheDocument();
    expect(screen.getByTestId('drum-pad')).toBeInTheDocument();
  });

  it('toggles the play button when state changes', () => {
    vi.mocked(useSequencer).mockReturnValue({
      ...defaultHookReturn,
      isPlaying: true
    });

    renderWithProvider();

    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('disables play button during initialization', () => {
    vi.mocked(useSequencer).mockReturnValue({
      ...defaultHookReturn,
      isInitializing: true
    });

    renderWithProvider();

    const playBtn = screen.getByRole('button', { name: /Play/i });
    expect(playBtn).toBeDisabled();
  });
});
