import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import CustomSlider from './CustomSlider';

describe('CustomSlider', () => {
  const defaultProps = {
    min: 0,
    max: 100,
    value: 50,
    onChange: vi.fn(),
  };

  it('should render the slider component', () => {
    render(<CustomSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('should have correct min, max, and value attributes', () => {
    render(<CustomSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('value', '50');
  });

  it('should call onChange when slider value changes', () => {
    const onChange = vi.fn();
    
    render(<CustomSlider {...defaultProps} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '75' } });
    
    expect(onChange).toHaveBeenCalledTimes(1);
    // Verify the event object was passed (React synthetic event)
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs).toHaveProperty('target');
    expect(callArgs.target).toHaveProperty('value');
  });

  it('should calculate thumb position correctly for middle value', () => {
    const { container } = render(<CustomSlider {...defaultProps} value={50} />);
    const thumb = container.querySelector('[style*="left"]');
    
    expect(thumb).toBeInTheDocument();
    // At 50% of range (50 out of 0-100), thumb should be at 50% position
    expect(thumb?.getAttribute('style')).toContain('50%');
  });

  it('should calculate thumb position correctly for minimum value', () => {
    const { container } = render(<CustomSlider {...defaultProps} value={0} />);
    const thumb = container.querySelector('[style*="left"]');
    
    expect(thumb).toBeInTheDocument();
    // At minimum, thumb should be at 0% position (minus 12px offset)
    expect(thumb?.getAttribute('style')).toContain('calc(0% - 12px)');
  });

  it('should calculate thumb position correctly for maximum value', () => {
    const { container } = render(<CustomSlider {...defaultProps} value={100} />);
    const thumb = container.querySelector('[style*="left"]');
    
    expect(thumb).toBeInTheDocument();
    // At maximum, thumb should be at 100% position (minus 12px offset)
    expect(thumb?.getAttribute('style')).toContain('calc(100% - 12px)');
  });

  it('should handle custom min and max values', () => {
    render(<CustomSlider min={10} max={200} value={50} onChange={vi.fn()} />);
    const slider = screen.getByRole('slider');
    
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '200');
    expect(slider).toHaveAttribute('value', '50');
  });

  it('should calculate thumb position correctly with custom range', () => {
    const { container } = render(
      <CustomSlider min={20} max={80} value={50} onChange={vi.fn()} />
    );
    const thumb = container.querySelector('[style*="left"]');
    
    expect(thumb).toBeInTheDocument();
    // At 50 in range 20-80, that's (50-20)/(80-20) = 30/60 = 50%
    expect(thumb?.getAttribute('style')).toContain('50%');
  });

  it('should render track and thumb elements', () => {
    const { container } = render(<CustomSlider {...defaultProps} />);
    
    const track = container.querySelector('.bg-gray-600');
    const thumb = container.querySelector('[style*="left"]');
    
    expect(track).toBeInTheDocument();
    expect(thumb).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<CustomSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveClass('opacity-0', 'cursor-pointer');
  });
});

