import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils/test-utils';
import Crayonbrain from './Crayonbrain';
import { wrapperWithSequencerProvider } from './__test-utils__.jsx';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaAngleDoubleRight: () => <span data-testid="angle-double-right-icon">→</span>,
  FaReact: () => <span data-testid="react-icon">React</span>,
}));

vi.mock('react-icons/ri', () => ({
  RiTailwindCssFill: () => <span data-testid="tailwind-icon">Tailwind</span>,
}));

// Mock the image asset
vi.mock('../../assets/cb.png', () => ({
  default: 'mock-cb-image.png',
}));

// Mock DemoSequencer
vi.mock('./DemoSequencer', () => ({
  default: () => <div data-testid="demo-sequencer">Demo Sequencer</div>,
}));

// Mock Visualizer with lazy loading
const MockVisualizer = () => <div data-testid="visualizer">Visualizer</div>;
vi.mock('./Visualizer', () => ({
  default: MockVisualizer,
}));

describe('Crayonbrain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main section', () => {
    const { container } = render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('should render the Crayonbrain logo image', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    const image = screen.getByAltText('Crayonbrain');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mock-cb-image.png');
  });

  it('should render the main heading', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByRole('heading', { name: /crayonbrain/i })).toBeInTheDocument();
  });

  it('should render tech badges (React and Tailwind)', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByTestId('react-icon')).toBeInTheDocument();
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getByTestId('tailwind-icon')).toBeInTheDocument();
    expect(screen.getAllByText('Tailwind').length).toBeGreaterThan(0);
  });

  it('should render the description text', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByText(/download reactive visuals from audio/i)).toBeInTheDocument();
  });

  it('should render the visit button with external link', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    const link = screen.getByRole('link', { name: /visit/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://crayonbrain.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render the visit button with icon', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    const button = screen.getByRole('button', { name: /visit/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('angle-double-right-icon')).toBeInTheDocument();
  });

  it('should wrap DemoSequencer and Visualizer in SequencerProvider', () => {
    render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    expect(screen.getByTestId('demo-sequencer')).toBeInTheDocument();
    expect(screen.getByTestId('visualizer')).toBeInTheDocument();
  });

  it('should render DemoSequencer and Visualizer side by side on large screens', () => {
    const { container } = render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    const sequencerContainer = container.querySelector('.lg\\:flex-row');
    expect(sequencerContainer).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    // Check main section
    const section = container.querySelector('section');
    expect(section).toHaveClass('flex', 'items-center', 'justify-center', 'w-full');
    
    // Check main container
    const mainDiv = section?.querySelector('.flex.flex-col');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render with correct responsive classes', () => {
    const { container } = render(<Crayonbrain />, { wrapper: wrapperWithSequencerProvider });
    
    // Check for responsive text classes
    const heading = screen.getByRole('heading', { name: /crayonbrain/i });
    expect(heading).toHaveClass('text-3xl', 'lg:text-5xl');
    
    // Check for responsive margin classes
    const mainDiv = container.querySelector('.mb-20.md\\:mb-32.lg\\:mb-40');
    expect(mainDiv).toBeInTheDocument();
  });
});

