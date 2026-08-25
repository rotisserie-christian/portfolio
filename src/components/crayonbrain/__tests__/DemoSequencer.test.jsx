import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DemoSequencer from '../DemoSequencer';
import { SequencerProvider } from '@/contexts/SequencerContext.jsx';
import { useSequencer } from '../hooks/sequencer/useSequencer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Mock the hooks
vi.mock('../hooks/sequencer/useSequencer', () => ({
  useSequencer: vi.fn()
}));

vi.mock('@/hooks/useIntersectionObserver', () => ({
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

  it('renders correctly in its base state', async () => {
    renderWithProvider();

    expect(await screen.findByTestId('sequencer-controls')).toBeInTheDocument();
    expect(await screen.findByTestId('tempo-slider')).toBeInTheDocument();
    expect(await screen.findByTestId('drum-pad')).toBeInTheDocument();
  });

  it('toggles the play button when state changes', async () => {
    vi.mocked(useSequencer).mockReturnValue({
      ...defaultHookReturn,
      isPlaying: true
    });

    renderWithProvider();

    expect(await screen.findByText('Stop')).toBeInTheDocument();
  });

  it('disables play button during initialization', async () => {
    vi.mocked(useSequencer).mockReturnValue({
      ...defaultHookReturn,
      isInitializing: true
    });

    renderWithProvider();

    const playBtn = await screen.findByRole('button', { name: /Play/i });
    expect(playBtn).toBeDisabled();
  });
});
