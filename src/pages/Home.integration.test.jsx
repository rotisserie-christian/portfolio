import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

/**
 * Tests main layout structure and navigation logic
 */

// Mock sections and complex background components
vi.mock('../components/starfield/StarsBackground', () => ({
  StarsBackground: () => <div data-testid="stars-background" />
}));

vi.mock('../components/starfield/ShootingStars', () => ({
  ShootingStars: () => <div data-testid="shooting-stars" />
}));

vi.mock('../components/crayonbrain/Crayonbrain', () => ({
  default: () => <div data-testid="section-crayonbrain">Crayonbrain Visualizer</div>
}));

vi.mock('../components/semanticmaps/SemanticMaps', () => ({
  default: () => <div data-testid="section-semanticmaps">Semantic Maps Toolkit</div>
}));

// Mock icons
vi.mock('react-icons/fa', () => ({
  FaAngleDoubleRight: () => <span>→</span>,
}));

describe('Home Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock for scrollIntoView (attaching to HTMLElement prototype)
    if (typeof window !== 'undefined') {
      window.HTMLElement.prototype.scrollIntoView = vi.fn();
    }
  });

  const renderHome = () => render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  describe('Page Layout', () => {
    it('renders the hero section with core identity info', () => {
      renderHome();
      expect(screen.getByText(/Christian Waters/i)).toBeInTheDocument();
      expect(screen.getByText(/Web Developer/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /projects/i })).toBeInTheDocument();
    });

    it('renders the background animation layers', () => {
      renderHome();
      expect(screen.getByTestId('stars-background')).toBeInTheDocument();
      expect(screen.getByTestId('shooting-stars')).toBeInTheDocument();
    });

    it('mounts the major project feature sections', () => {
      renderHome();
      expect(screen.getByTestId('section-crayonbrain')).toBeInTheDocument();
      expect(screen.getByTestId('section-semanticmaps')).toBeInTheDocument();
    });

    it('wraps projects in correct data-section attributes for anchoring', () => {
      const { container } = renderHome();
      expect(container.querySelector('[data-section="crayonbrain"]')).toBeInTheDocument();
      expect(container.querySelector('[data-section="semanticmaps"]')).toBeInTheDocument();
    });
  });

  describe('Navigation Flow', () => {
    it('triggers a smooth scroll to the Crayonbrain section when clicking the CTA', async () => {
      const scrollSpy = vi.fn();
      window.HTMLElement.prototype.scrollIntoView = scrollSpy;

      renderHome();
      const projectsButton = screen.getByRole('button', { name: /projects/i });

      await act(async () => {
        projectsButton.click();
      });

      expect(scrollSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
});
