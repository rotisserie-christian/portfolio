import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

/**
 * Tests main layout structure and navigation logic
 */

vi.mock('../components/projects/Projects', () => ({
  default: () => <div data-testid="section-projects">Projects</div>
}));

vi.mock('../components/contact/Contact', () => ({
  default: () => <div data-testid="section-contact">Contact</div>
}));

vi.mock('../components/ui/Footer', () => ({
  default: () => <div data-testid="footer" />
}));

describe('Home Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    it('mounts the projects section', () => {
      renderHome();
      expect(screen.getByTestId('section-projects')).toBeInTheDocument();
    });

    it('wraps sections in correct data-section attributes for anchoring', () => {
      const { container } = renderHome();
      expect(container.querySelector('[data-section="crayonbrain"]')).toBeInTheDocument();
      expect(container.querySelector('[data-section="contact"]')).toBeInTheDocument();
    });

    it('mounts contact and footer', () => {
      renderHome();
      expect(screen.getByTestId('section-contact')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });
});
