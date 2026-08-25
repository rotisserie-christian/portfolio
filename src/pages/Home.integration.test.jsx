import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Page Integration', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const renderHome = (entry = '/') => render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[entry]}>
        <Home />
      </MemoryRouter>
    </HelmetProvider>
  );

  it('renders the document sections in order with the footer', () => {
    renderHome();

    expect(screen.getByRole('heading', { level: 1, name: 'Christian Waters' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Projects',
      'Articles',
      'Contact',
    ]);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('scrolls to a section requested through navigation state', () => {
    vi.useFakeTimers();
    const scrollIntoView = vi.fn();
    vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView').mockImplementation(scrollIntoView);

    renderHome({ pathname: '/', state: { scrollTo: 'articles' } });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(scrollIntoView).toHaveBeenCalledOnce();
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('sets the home page metadata', () => {
    renderHome();

    expect(document.title).toBe('Christian Waters | Developer Portfolio');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Full stack creative tools developer in Saskatoon, Saskatchewan',
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://christianwaters.dev/',
    );
  });
});
