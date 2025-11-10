import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import Visualizer from './Visualizer';
import { 
  createMockUseVisualizer,
  createMockUsePresetSwitching,
  createMockCanvas,
  wrapperWithSequencerProvider 
} from './__test-utils__.jsx';

// Mock PresetControls
vi.mock('./PresetControls', () => ({
  default: ({ currentPresetSelection, presetName, onPrevious, onNext, totalPresets }) => (
    <div data-testid="preset-controls">
      <button onClick={onPrevious} data-testid="prev-button">Previous</button>
      <span data-testid="preset-name">{presetName}</span>
      <span data-testid="current-selection">{currentPresetSelection}</span>
      <button onClick={onNext} data-testid="next-button">Next</button>
      <span data-testid="total-presets">{totalPresets}</span>
    </div>
  ),
}));

// Mock hooks
vi.mock('../../hooks/visualizer/useVisualizer', () => ({
  useVisualizer: vi.fn(),
}));

vi.mock('../../hooks/visualizer/usePresetSwitching', () => ({
  usePresetSwitching: vi.fn(),
}));

vi.mock('../../hooks/useSequencerContext', () => ({
  useSequencerContext: vi.fn(),
}));

import { useVisualizer } from '../../hooks/visualizer/useVisualizer';
import { usePresetSwitching } from '../../hooks/visualizer/usePresetSwitching';
import { useSequencerContext } from '../../hooks/useSequencerContext';

describe('Visualizer', () => {
  const mockCanvasRef = { current: null };
  const mockVisualizerRef = { current: null };
  const mockPresetsRef = { current: null };
  const mockSwitchPreset = vi.fn();
  const mockSequencerGainRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup canvas
    const { canvas } = createMockCanvas();
    mockCanvasRef.current = canvas;

    // Setup context mock
    useSequencerContext.mockReturnValue({
      isPlaying: false,
      sequencerGainRef: mockSequencerGainRef,
    });

    // Setup visualizer hook mock
    useVisualizer.mockReturnValue(
      createMockUseVisualizer({
        visualizerRef: mockVisualizerRef,
        presetsRef: mockPresetsRef,
      })
    );

    // Setup preset switching hook mock
    usePresetSwitching.mockReturnValue(
      createMockUsePresetSwitching({
        currentPresetSelection: 0,
        presetName: 'Test Preset',
        switchPreset: mockSwitchPreset,
      })
    );
  });

  it('should render the visualizer component', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
    expect(document.getElementById('test-canvas')).toBeInTheDocument();
  });

  it('should render canvas with correct id', () => {
    render(<Visualizer canvasId="demo-visualizer" />, { wrapper: wrapperWithSequencerProvider });
    
    const canvas = document.getElementById('demo-visualizer');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it('should render PresetControls component', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
  });

  it('should pass correct props to PresetControls', () => {
    usePresetSwitching.mockReturnValue(
      createMockUsePresetSwitching({
        currentPresetSelection: 1,
        presetName: 'Custom Preset',
        switchPreset: mockSwitchPreset,
      })
    );

    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByTestId('preset-name')).toHaveTextContent('Custom Preset');
    expect(screen.getByTestId('current-selection')).toHaveTextContent('1');
  });

  it('should call switchPreset with "prev" when previous button is clicked', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    const prevButton = screen.getByTestId('prev-button');
    fireEvent.click(prevButton);
    
    expect(mockSwitchPreset).toHaveBeenCalledWith('prev');
  });

  it('should call switchPreset with "next" when next button is clicked', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    expect(mockSwitchPreset).toHaveBeenCalledWith('next');
  });

  it('should pass totalPresets to PresetControls', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    // PRESET_INDICES.length should be passed (default is 3)
    const totalPresets = screen.getByTestId('total-presets');
    expect(totalPresets).toBeInTheDocument();
  });

  it('should call useVisualizer with correct parameters', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    expect(useVisualizer).toHaveBeenCalledWith(
      expect.any(Object), // canvasRef
      false, // isPlaying
      mockSequencerGainRef
    );
  });

  it('should call usePresetSwitching with visualizer and presets refs', () => {
    render(<Visualizer canvasId="test-canvas" />, { wrapper: wrapperWithSequencerProvider });
    
    expect(usePresetSwitching).toHaveBeenCalledWith(
      mockVisualizerRef,
      mockPresetsRef
    );
  });

  it('should update useVisualizer when isPlaying changes', () => {
    const { rerender } = render(
      <Visualizer canvasId="test-canvas" />, 
      { wrapper: wrapperWithSequencerProvider }
    );

    // Update context to playing
    useSequencerContext.mockReturnValue({
      isPlaying: true,
      sequencerGainRef: mockSequencerGainRef,
    });

    rerender(<Visualizer canvasId="test-canvas" />);

    expect(useVisualizer).toHaveBeenCalledWith(
      expect.any(Object),
      true, // isPlaying should be true now
      mockSequencerGainRef
    );
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <Visualizer canvasId="test-canvas" className="custom-class" />,
      { wrapper: wrapperWithSequencerProvider }
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should have correct default structure and classes', () => {
    const { container } = render(
      <Visualizer canvasId="test-canvas" />,
      { wrapper: wrapperWithSequencerProvider }
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('w-full', 'flex', 'flex-col');
    
    const innerDiv = wrapper.querySelector('.bg-base-300');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass('rounded-xl', 'shadow-sm');
  });

  it('should render canvas in correct container', () => {
    const { container } = render(
      <Visualizer canvasId="test-canvas" />,
      { wrapper: wrapperWithSequencerProvider }
    );
    
    const canvasContainer = container.querySelector('.flex-1');
    expect(canvasContainer).toBeInTheDocument();
    
    const canvas = canvasContainer?.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should handle fillParent prop', () => {
    render(
      <Visualizer canvasId="test-canvas" fillParent={true} />,
      { wrapper: wrapperWithSequencerProvider }
    );
    
    const canvas = document.getElementById('test-canvas');
    expect(canvas).toHaveClass('w-full', 'h-full', 'rounded-lg');
  });

  it('should work without fillParent prop', () => {
    render(
      <Visualizer canvasId="test-canvas" />,
      { wrapper: wrapperWithSequencerProvider }
    );
    
    const canvas = document.getElementById('test-canvas');
    expect(canvas).toHaveClass('w-full', 'h-full', 'rounded-lg');
  });

  it('should handle missing canvasId gracefully', () => {
    render(<Visualizer />, { wrapper: wrapperWithSequencerProvider });
    
    // Canvas should still render, just without an id
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});

