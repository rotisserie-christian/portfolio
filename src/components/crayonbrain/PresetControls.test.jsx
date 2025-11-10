import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import PresetControls from './PresetControls';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaAngleLeft: () => <span data-testid="angle-left-icon">Left</span>,
  FaAngleRight: () => <span data-testid="angle-right-icon">Right</span>,
}));

describe('PresetControls', () => {
  const defaultProps = {
    currentPresetSelection: 0,
    presetName: 'Test Preset',
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    totalPresets: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the preset controls component', () => {
    render(<PresetControls {...defaultProps} />);
    
    expect(screen.getByText('Test Preset')).toBeInTheDocument();
    expect(screen.getByTestId('angle-left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('angle-right-icon')).toBeInTheDocument();
  });

  it('should display the preset name', () => {
    render(<PresetControls {...defaultProps} presetName="Custom Preset" />);
    
    expect(screen.getByText('Custom Preset')).toBeInTheDocument();
  });

  it('should render navigation buttons with correct aria labels', () => {
    render(<PresetControls {...defaultProps} />);
    
    const prevButton = screen.getByRole('button', { name: /previous preset/i });
    const nextButton = screen.getByRole('button', { name: /next preset/i });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should call onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn();
    render(<PresetControls {...defaultProps} onPrevious={onPrevious} />);
    
    const prevButton = screen.getByRole('button', { name: /previous preset/i });
    fireEvent.click(prevButton);
    
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when next button is clicked', () => {
    const onNext = vi.fn();
    render(<PresetControls {...defaultProps} onNext={onNext} />);
    
    const nextButton = screen.getByRole('button', { name: /next preset/i });
    fireEvent.click(nextButton);
    
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('should render correct number of indicator dots', () => {
    render(<PresetControls {...defaultProps} totalPresets={5} />);
    
    const dots = screen.getAllByLabelText(/preset \d+/i);
    expect(dots).toHaveLength(5);
  });

  it('should highlight the active preset dot', () => {
    render(
      <PresetControls {...defaultProps} currentPresetSelection={1} totalPresets={3} />
    );
    
    const dots = screen.getAllByLabelText(/preset \d+/i);
    
    // First dot (index 0) should not be active
    expect(dots[0]).not.toHaveClass('bg-primary');
    expect(dots[0]).toHaveClass('bg-gray-500');
    
    // Second dot (index 1) should be active
    expect(dots[1]).toHaveClass('bg-primary');
    expect(dots[1]).not.toHaveClass('bg-gray-500');
    
    // Third dot (index 2) should not be active
    expect(dots[2]).not.toHaveClass('bg-primary');
    expect(dots[2]).toHaveClass('bg-gray-500');
  });

  it('should use default totalPresets when not provided', () => {
    const propsWithoutTotal = {
      currentPresetSelection: 0,
      presetName: 'Test Preset',
      onPrevious: vi.fn(),
      onNext: vi.fn(),
    };
    
    render(<PresetControls {...propsWithoutTotal} />);
    
    // Should default to 3 presets
    const dots = screen.getAllByLabelText(/preset \d+/i);
    expect(dots).toHaveLength(3);
  });

  it('should render all indicator dots with correct aria labels', () => {
    render(<PresetControls {...defaultProps} totalPresets={3} />);
    
    expect(screen.getByLabelText('Preset 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Preset 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Preset 3')).toBeInTheDocument();
  });

  it('should handle multiple rapid clicks on navigation buttons', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    
    render(<PresetControls {...defaultProps} onPrevious={onPrevious} onNext={onNext} />);
    
    const prevButton = screen.getByRole('button', { name: /previous preset/i });
    const nextButton = screen.getByRole('button', { name: /next preset/i });
    
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    expect(onPrevious).toHaveBeenCalledTimes(2);
    expect(onNext).toHaveBeenCalledTimes(2);
  });

  it('should render with correct structure and classes', () => {
    const { container } = render(<PresetControls {...defaultProps} />);
    
    // Check main container structure
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'gap-2', 'mb-4');
    
    // Check navigation row
    const navRow = mainDiv.firstChild;
    expect(navRow).toHaveClass('flex', 'items-center', 'justify-between');
  });
});
