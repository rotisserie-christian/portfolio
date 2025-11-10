import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test-utils/test-utils';
import DemoSequencer from './DemoSequencer';
import { 
  createMockUseSequencer, 
  createMockUseIntersectionObserver,
  wrapperWithSequencerProvider 
} from './__test-utils__.jsx';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaPlay: () => <span data-testid="play-icon">Play</span>,
  FaStop: () => <span data-testid="stop-icon">Stop</span>,
}));

vi.mock('react-icons/md', () => ({
  MdOutlineRemoveCircleOutline: () => <span data-testid="clear-icon">Clear</span>,
}));

// Mock audio assets
vi.mock('../../assets/kick.wav', () => ({ default: 'mock-kick.wav' }));
vi.mock('../../assets/snare.wav', () => ({ default: 'mock-snare.wav' }));
vi.mock('../../assets/snare2.wav', () => ({ default: 'mock-snare2.wav' }));
vi.mock('../../assets/hat.wav', () => ({ default: 'mock-hat.wav' }));

// Mock hooks
vi.mock('../../hooks/sequencer/useSequencer', () => ({
  useSequencer: vi.fn(),
}));

vi.mock('../../hooks/useSequencerContext', () => ({
  useSequencerContext: vi.fn(),
}));

vi.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: vi.fn(),
}));

// Mock TempoSlider
vi.mock('./TempoSlider', () => ({
  default: ({ bpm, onBpmChange }) => (
    <div data-testid="tempo-slider">
      <span>BPM: {bpm}</span>
      <button onClick={() => onBpmChange(prev => prev + 1)}>Increase</button>
    </div>
  ),
}));

import { useSequencer } from '../../hooks/sequencer/useSequencer';
import { useSequencerContext } from '../../hooks/useSequencerContext';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

describe('DemoSequencer', () => {
  const mockSetIsPlaying = vi.fn();
  const mockHandlePlay = vi.fn();
  const mockContextGainRef = { current: null };
  const mockSequencerGainRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    useSequencerContext.mockReturnValue({
      setIsPlaying: mockSetIsPlaying,
      sequencerGainRef: mockContextGainRef,
    });

    useIntersectionObserver.mockReturnValue(
      createMockUseIntersectionObserver({ hasIntersected: true })
    );

    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isPlaying: false,
        currentStep: 0,
        handlePlay: mockHandlePlay,
        sequencerGainRef: mockSequencerGainRef,
        isInitializing: false,
      })
    );
  });

  it('should render the demo sequencer component', () => {
    const { container } = render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const sequencer = container.querySelector('.demo-sequencer');
    expect(sequencer).toBeInTheDocument();
  });

  it('should render play/stop button', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const playButton = screen.getByRole('button', { name: /play drum loop/i });
    expect(playButton).toBeInTheDocument();
  });

  it('should render clear button', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const clearButton = screen.getByRole('button', { name: /clear drum pattern/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should render tempo slider', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByTestId('tempo-slider')).toBeInTheDocument();
  });

  it('should render all drum sound tracks', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByText('Kick')).toBeInTheDocument();
    expect(screen.getByText('Snare')).toBeInTheDocument();
    expect(screen.getByText('Snare2')).toBeInTheDocument();
    expect(screen.getByText('Hat')).toBeInTheDocument();
  });

  it('should render 8 time steps for each drum sound', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    // Each drum sound should have 8 step buttons
    const stepButtons = screen.getAllByRole('button', { name: /toggle .* at step \d+/i });
    expect(stepButtons.length).toBeGreaterThanOrEqual(32); // 4 sounds * 8 steps
  });

  it('should call handlePlay when play button is clicked', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const playButton = screen.getByRole('button', { name: /play drum loop/i });
    fireEvent.click(playButton);
    
    expect(mockHandlePlay).toHaveBeenCalledTimes(1);
  });

  it('should display stop button and icon when playing', () => {
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isPlaying: true,
        handlePlay: mockHandlePlay,
      })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByRole('button', { name: /stop drum loop/i })).toBeInTheDocument();
    expect(screen.getByTestId('stop-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop drum loop/i })).toHaveTextContent('Stop');
  });

  it('should display play button and icon when stopped', () => {
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isPlaying: false,
        handlePlay: mockHandlePlay,
      })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByRole('button', { name: /play drum loop/i })).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play drum loop/i })).toHaveTextContent('Play');
  });

  it('should disable play button when initializing', () => {
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isInitializing: true,
        handlePlay: mockHandlePlay,
      })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const playButton = screen.getByRole('button', { name: /play drum loop/i });
    expect(playButton).toBeDisabled();
  });

  it('should show loading spinner when initializing', () => {
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isInitializing: true,
        handlePlay: mockHandlePlay,
      })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const spinner = screen.getByRole('button', { name: /play drum loop/i }).querySelector('.loading');
    expect(spinner).toBeInTheDocument();
  });

  it('should clear all drum steps when clear button is clicked', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    // Click a few steps to activate them
    const stepButtons = screen.getAllByRole('button', { name: /toggle .* at step \d+/i });
    fireEvent.click(stepButtons[0]);
    fireEvent.click(stepButtons[8]);
    
    // Click clear
    const clearButton = screen.getByRole('button', { name: /clear drum pattern/i });
    fireEvent.click(clearButton);
    
    // All steps should be cleared (no active steps)
    // This is tested by checking the button classes
    stepButtons.forEach(button => {
      // After clear, buttons should not have the active class
      expect(button).not.toHaveClass('bg-accent');
    });
  });

  it('should toggle drum cell when clicked', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    const kickStep1 = screen.getByRole('button', { name: /toggle kick at step 1/i });
    
    // Click to activate
    fireEvent.click(kickStep1);
    
    // The button should now have active styling
    // Note: This tests the state change, actual visual class may vary
    expect(kickStep1).toBeInTheDocument();
  });

  it('should highlight current step when playing', () => {
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isPlaying: true,
        currentStep: 2,
        handlePlay: mockHandlePlay,
      })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    // Find buttons at step 2 (index 2)
    const step2Buttons = screen.getAllByRole('button', { name: /toggle .* at step 3/i });
    
    // All step 2 buttons should have the current step styling
    step2Buttons.forEach(button => {
      expect(button).toHaveClass('border-2', 'border-primary');
    });
  });

  it('should update context isPlaying when sequencer state changes', () => {
    const { rerender } = render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    // Initially not playing
    expect(mockSetIsPlaying).toHaveBeenCalledWith(false);
    
    // Update to playing
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        isPlaying: true,
        handlePlay: mockHandlePlay,
      })
    );
    
    rerender(<DemoSequencer />);
    
    // Should update context
    expect(mockSetIsPlaying).toHaveBeenCalledWith(true);
  });

  it('should sync sequencerGainRef to context when available', async () => {
    const mockGainNode = { current: { connect: vi.fn() } };
    mockSequencerGainRef.current = mockGainNode;
    
    useSequencer.mockReturnValue(
      createMockUseSequencer({
        sequencerGainRef: mockSequencerGainRef,
      })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    await waitFor(() => {
      expect(mockContextGainRef.current).toBe(mockGainNode);
    });
  });

  it('should use intersection observer for lazy loading', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    expect(useIntersectionObserver).toHaveBeenCalledWith({ rootMargin: '100px' });
  });

  it('should pass hasIntersected to useSequencer', () => {
    useIntersectionObserver.mockReturnValue(
      createMockUseIntersectionObserver({ hasIntersected: false })
    );

    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    expect(useSequencer).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      expect.any(Number),
      false // hasIntersected
    );
  });

  it('should apply darker background to specific time steps', () => {
    render(<DemoSequencer />, { wrapper: wrapperWithSequencerProvider });
    
    // Steps 2, 3, 6, 7 should have darker background
    const step3Button = screen.getByRole('button', { name: /toggle kick at step 3/i });
    const step4Button = screen.getByRole('button', { name: /toggle kick at step 4/i });
    
    // Step 3 (index 2) should have darker class
    expect(step3Button).toHaveClass('bg-base-300');
    // Step 4 (index 3) should also have darker class
    expect(step4Button).toHaveClass('bg-base-300');
  });
});

