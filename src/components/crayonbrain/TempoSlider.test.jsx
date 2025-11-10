import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import TempoSlider from './TempoSlider';
import { MIN_BPM, MAX_BPM } from './tempoConstants';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaAngleLeft: () => <span data-testid="angle-left-icon">Left</span>,
  FaAngleRight: () => <span data-testid="angle-right-icon">Right</span>,
}));

// Mock CustomSlider
vi.mock('./CustomSlider', () => ({
  default: ({ min, max, value, onChange }) => (
    <div data-testid="custom-slider">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        data-testid="slider-input"
      />
    </div>
  ),
}));

describe('TempoSlider', () => {
  const defaultProps = {
    bpm: 120,
    onBpmChange: vi.fn(),
  };

  it('should render the tempo slider component', () => {
    render(<TempoSlider {...defaultProps} />);
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByText(/bpm/)).toBeInTheDocument();
  });

  it('should display the current BPM value', () => {
    render(<TempoSlider bpm={140} onBpmChange={vi.fn()} />);
    expect(screen.getByText('140')).toBeInTheDocument();
  });

  it('should render increment and decrement buttons', () => {
    render(<TempoSlider {...defaultProps} />);
    
    const decrementButton = screen.getByRole('button', { name: /decrement bpm/i });
    const incrementButton = screen.getByRole('button', { name: /increment bpm/i });
    
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
  });

  it('should render icons in buttons', () => {
    render(<TempoSlider {...defaultProps} />);
    
    expect(screen.getByTestId('angle-left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('angle-right-icon')).toBeInTheDocument();
  });

  it('should call onBpmChange with decremented value when decrement button is clicked', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={120} onBpmChange={onBpmChange} />);
    
    const decrementButton = screen.getByRole('button', { name: /decrement bpm/i });
    fireEvent.click(decrementButton);
    
    expect(onBpmChange).toHaveBeenCalledTimes(1);
    // Verify it was called with a function that decrements
    const callArg = onBpmChange.mock.calls[0][0];
    expect(typeof callArg).toBe('function');
    expect(callArg(120)).toBe(119);
  });

  it('should call onBpmChange with incremented value when increment button is clicked', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={120} onBpmChange={onBpmChange} />);
    
    const incrementButton = screen.getByRole('button', { name: /increment bpm/i });
    fireEvent.click(incrementButton);
    
    expect(onBpmChange).toHaveBeenCalledTimes(1);
    // Verify it was called with a function that increments
    const callArg = onBpmChange.mock.calls[0][0];
    expect(typeof callArg).toBe('function');
    expect(callArg(120)).toBe(121);
  });

  it('should not decrement below minBpm', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={MIN_BPM} onBpmChange={onBpmChange} minBpm={MIN_BPM} />);
    
    const decrementButton = screen.getByRole('button', { name: /decrement bpm/i });
    fireEvent.click(decrementButton);
    
    const callArg = onBpmChange.mock.calls[0][0];
    expect(callArg(MIN_BPM)).toBe(MIN_BPM);
  });

  it('should not increment above maxBpm', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={MAX_BPM} onBpmChange={onBpmChange} maxBpm={MAX_BPM} />);
    
    const incrementButton = screen.getByRole('button', { name: /increment bpm/i });
    fireEvent.click(incrementButton);
    
    const callArg = onBpmChange.mock.calls[0][0];
    expect(callArg(MAX_BPM)).toBe(MAX_BPM);
  });

  it('should use custom minBpm and maxBpm when provided', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={50} onBpmChange={onBpmChange} minBpm={40} maxBpm={60} />);
    
    // Test decrement respects custom min
    const decrementButton = screen.getByRole('button', { name: /decrement bpm/i });
    fireEvent.click(decrementButton);
    let callArg = onBpmChange.mock.calls[0][0];
    expect(callArg(40)).toBe(40); // Should not go below 40
    
    // Test increment respects custom max
    const incrementButton = screen.getByRole('button', { name: /increment bpm/i });
    fireEvent.click(incrementButton);
    callArg = onBpmChange.mock.calls[1][0];
    expect(callArg(60)).toBe(60); // Should not go above 60
  });

  it('should render CustomSlider with correct props', () => {
    render(<TempoSlider bpm={120} onBpmChange={vi.fn()} />);
    
    const slider = screen.getByTestId('custom-slider');
    expect(slider).toBeInTheDocument();
    
    const sliderInput = screen.getByTestId('slider-input');
    expect(sliderInput).toHaveAttribute('min', String(MIN_BPM));
    expect(sliderInput).toHaveAttribute('max', String(MAX_BPM));
    expect(sliderInput).toHaveAttribute('value', '120');
  });

  it('should call onBpmChange when slider value changes', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={120} onBpmChange={onBpmChange} />);
    
    const sliderInput = screen.getByTestId('slider-input');
    fireEvent.change(sliderInput, { target: { value: '140' } });
    
    expect(onBpmChange).toHaveBeenCalledWith(140);
  });

  it('should parse slider value as integer', () => {
    const onBpmChange = vi.fn();
    render(<TempoSlider bpm={120} onBpmChange={onBpmChange} />);
    
    const sliderInput = screen.getByTestId('slider-input');
    fireEvent.change(sliderInput, { target: { value: '125.7' } });
    
    // Should parse to integer (125)
    expect(onBpmChange).toHaveBeenCalledWith(125);
  });

  it('should use default minBpm and maxBpm from constants when not provided', () => {
    render(<TempoSlider bpm={120} onBpmChange={vi.fn()} />);
    
    const sliderInput = screen.getByTestId('slider-input');
    expect(sliderInput).toHaveAttribute('min', String(MIN_BPM));
    expect(sliderInput).toHaveAttribute('max', String(MAX_BPM));
  });
});

