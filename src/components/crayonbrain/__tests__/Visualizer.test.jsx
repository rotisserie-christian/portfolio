import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Visualizer from '../Visualizer';
import { SequencerProvider } from '../../../contexts/SequencerContext.jsx';
import { useVisualizer } from '../hooks/visualizer/useVisualizer';
import { usePresetSwitching } from '../hooks/visualizer/usePresetSwitching';
import { useSequencerContext } from '../hooks/useSequencerContext';

// Mock hooks
vi.mock('../hooks/visualizer/useVisualizer', () => ({
  useVisualizer: vi.fn()
}));

vi.mock('../hooks/visualizer/usePresetSwitching', () => ({
  usePresetSwitching: vi.fn()
}));

vi.mock('../hooks/useSequencerContext', () => ({
  useSequencerContext: vi.fn()
}));

// Mock PresetControls
vi.mock('../ui/PresetControls', () => ({
  default: ({ presetName, onPrevious, onNext, currentPresetSelection }) => (
    <div data-testid="preset-controls">
      <span>{presetName}</span>
      <button onClick={onPrevious}>Prev</button>
      <button onClick={onNext}>Next</button>
      <div data-testid="selection-dots">{currentPresetSelection}</div>
    </div>
  )
}));

describe('Visualizer Component', () => {
  const defaultVisualizerReturn = {
    visualizerRef: { current: null },
    presetsRef: { current: [] }
  };

  const defaultPresetSwitchingReturn = {
    currentPresetSelection: 0,
    presetName: 'Test Preset',
    switchPreset: vi.fn()
  };

  const defaultSequencerContextReturn = {
    isPlaying: false,
    sequencerGainRef: { current: null }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVisualizer).mockReturnValue(defaultVisualizerReturn);
    vi.mocked(usePresetSwitching).mockReturnValue(defaultPresetSwitchingReturn);
    vi.mocked(useSequencerContext).mockReturnValue(defaultSequencerContextReturn);
  });

  const renderVisualizer = (props = {}) => {
    return render(
      <SequencerProvider>
        <Visualizer canvasId="test-vid" {...props} />
      </SequencerProvider>
    );
  };

  it('renders the visualizer canvas and mocked controls', () => {
    renderVisualizer();

    // Check if canvas exists by its ID
    const canvas = document.getElementById('test-vid');
    expect(canvas).toBeInTheDocument();

    // Check if mocked PresetControls exist
    expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
    expect(screen.getByText('Test Preset')).toBeInTheDocument();
  });

  it('responds to preset switching controls by displaying the name', () => {
    vi.mocked(usePresetSwitching).mockReturnValue({
      ...defaultPresetSwitchingReturn,
      presetName: 'New Preset'
    });

    renderVisualizer();

    expect(screen.getByText('New Preset')).toBeInTheDocument();
  });

  it('can pass specific classNames to the root element', () => {
    const { container } = renderVisualizer({ className: 'custom-class' });

    // Check for the custom class (first div after root)
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
