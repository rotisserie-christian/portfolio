import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '../test-utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { SequencerProvider } from '../contexts/SequencerContext.jsx';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaAngleDoubleRight: () => <span data-testid="angle-double-right-icon">→</span>,
  FaReact: () => <span data-testid="react-icon">React</span>,
}));

vi.mock('react-icons/ri', () => ({
  RiTailwindCssFill: () => <span data-testid="tailwind-icon">Tailwind</span>,
}));

// Mock image asset
vi.mock('../assets/cb.png', () => ({
  default: 'mock-cb-image.png',
}));

// Mock Intersection Observer to always intersect in tests
vi.mock('../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => ({
    elementRef: { current: null },
    isIntersecting: true,
    hasIntersected: true, // Always true so lazy components load
  }),
}));

// Mock Visualizer
vi.mock('../components/crayonbrain/Visualizer', () => ({
  default: () => <div data-testid="visualizer">Visualizer</div>,
}));

// Mock Crayonbrain
vi.mock('../components/crayonbrain/Crayonbrain', () => ({
  default: () => (
    <div data-testid="crayonbrain">
      <img src="mock-cb-image.png" alt="Crayonbrain" />
      <h1>Crayonbrain</h1>
      <p>Download reactive visuals from audio</p>
      <div data-testid="react-icon">React</div>
      <div data-testid="tailwind-icon">Tailwind</div>
      <a href="https://crayonbrain.com" target="_blank" rel="noreferrer">
        <button>Visit</button>
      </a>
      <div data-testid="demo-sequencer">Demo Sequencer</div>
      <div data-testid="visualizer">Visualizer</div>
    </div>
  ),
}));

// Mock DemoSequencer
vi.mock('../components/crayonbrain/DemoSequencer', () => ({
  default: () => <div data-testid="demo-sequencer">Demo Sequencer</div>,
}));

// Mock Flowchart
vi.mock('../components/flowchart/Flowchart', () => ({
  default: () => (
    <>
      <div data-testid="react-flow">Flowchart</div>
      <div data-testid="flowchart-background">Background</div>
    </>
  ),
}));

// Mock ReactFlow
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual,
    default: ({ children }) => (
      <div data-testid="react-flow">{children}</div>
    ),
    Background: () => <div data-testid="flowchart-background" />,
    useNodesState: vi.fn(() => [[], vi.fn(), vi.fn()]),
    useEdgesState: vi.fn(() => [[], vi.fn(), vi.fn()]),
    addEdge: vi.fn((params, edges) => [...edges, params]),
  };
});

// Mock ReactFlow CSS
vi.mock('../components/flowchart/CustomNode.css', () => ({}));

// Helper to render Home with all providers
const renderHomeWithProviders = async () => {
  let result;
  await act(async () => {
    result = render(
      <BrowserRouter>
        <SequencerProvider>
          <Home />
        </SequencerProvider>
      </BrowserRouter>
    );
  });
  return result;
};

describe('Home Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  describe('Page Structure', () => {
    it('should render all main sections together', async () => {
      await renderHomeWithProviders();

      // Hero section
      expect(screen.getByText(/Christian Waters/i)).toBeInTheDocument();
      expect(screen.getByText(/Web Developer/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /projects/i })).toBeInTheDocument();

      // Crayonbrain section (lazy-loaded, but mocked so loads immediately)
      await waitFor(() => {
        expect(screen.getByTestId('crayonbrain')).toBeInTheDocument();
      });

      // How it works section
      expect(screen.getByText(/How it works/i)).toBeInTheDocument();
      expect(screen.getByText(/converting music clips into abstract visuals/i)).toBeInTheDocument();
    });

    it('should render background components', async () => {
      const { container } = await renderHomeWithProviders();

      // StarsBackground renders a canvas
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();

      // ShootingStars renders an SVG
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render Crayonbrain project section with all components', async () => {
      await renderHomeWithProviders();

      // Wait for lazy-loaded Crayonbrain
      await waitFor(() => {
        expect(screen.getByTestId('crayonbrain')).toBeInTheDocument();
      });

      // Crayonbrain logo
      const logo = screen.getByAltText('Crayonbrain');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mock-cb-image.png');

      // Crayonbrain heading
      expect(screen.getByRole('heading', { name: /Crayonbrain/i })).toBeInTheDocument();
      
      // Tech badges
      expect(screen.getByTestId('react-icon')).toBeInTheDocument();
      expect(screen.getByTestId('tailwind-icon')).toBeInTheDocument();

      // Visit button
      const visitLink = screen.getByRole('link', { name: /visit/i });
      expect(visitLink).toBeInTheDocument();
      expect(visitLink).toHaveAttribute('href', 'https://crayonbrain.com');
      expect(visitLink).toHaveAttribute('target', '_blank');
    });

    it('should render Flowchart component (lazy-loaded)', async () => {
      await renderHomeWithProviders();

      // Wait for lazy-loaded Flowchart to resolve via Suspense
      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });
      expect(screen.getByTestId('flowchart-background')).toBeInTheDocument();
    });

    it('should render sequencer and visualizer within SequencerProvider', async () => {
      await renderHomeWithProviders();

      // Wait for lazy-loaded Crayonbrain first
      await waitFor(() => {
        expect(screen.getByTestId('crayonbrain')).toBeInTheDocument();
      });

      expect(screen.getByTestId('demo-sequencer')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByTestId('visualizer')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should scroll to Crayonbrain section when Projects button is clicked', async () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      await renderHomeWithProviders();

      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      await act(async () => {
        projectsButton.click();
      });

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should have correct data-section attribute for scrolling target', async () => {
      const { container } = await renderHomeWithProviders();

      const crayonbrainSection = container.querySelector('[data-section="crayonbrain"]');
      expect(crayonbrainSection).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct layout structure', async () => {
      const { container } = await renderHomeWithProviders();

      // Main container
      const mainContainer = container.querySelector('.flex.flex-col.items-center.justify-center');
      expect(mainContainer).toBeInTheDocument();

      // Hero section
      const heroSection = container.querySelector('section.min-h-screen');
      expect(heroSection).toBeInTheDocument();
    });

    it('should render responsive text classes', async () => {
      await renderHomeWithProviders();

      const mainHeading = screen.getByText(/Christian Waters/i);
      expect(mainHeading).toHaveClass('text-3xl', 'lg:text-5xl');

      // Wait for lazy-loaded Crayonbrain, then check heading
      await waitFor(() => {
        expect(screen.getByTestId('crayonbrain')).toBeInTheDocument();
      });
      
      const crayonbrainHeading = screen.getByRole('heading', { name: /Crayonbrain/i });
      expect(crayonbrainHeading).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate all components without errors', async () => {
      // All components can render together
      // If renderHomeWithProviders throws, the test will fail automatically
      await renderHomeWithProviders();
    });

    it('should maintain component hierarchy', async () => {
      const { container } = await renderHomeWithProviders();

      // Verify the structure: Home > sections > components
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);

      // Verify Crayonbrain section exists and wait for lazy-loaded content
      const crayonbrainSection = container.querySelector('[data-section="crayonbrain"]');
      expect(crayonbrainSection).toBeInTheDocument();
      
      await waitFor(() => {
        expect(crayonbrainSection?.querySelector('img[alt="Crayonbrain"]')).toBeInTheDocument();
      });
    });
  });
});

