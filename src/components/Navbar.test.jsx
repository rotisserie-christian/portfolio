import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils/test-utils';
import Navbar from './Navbar';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaGithub: () => <span data-testid="github-icon">GitHub Icon</span>,
  FaLinkedin: () => <span data-testid="linkedin-icon">LinkedIn Icon</span>,
  FaTiktok: () => <span data-testid="tiktok-icon">TikTok Icon</span>,
}));

describe('Navbar', () => {
  it('should render the navigation element', () => {
    render(<Navbar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should render GitHub link with correct href and attributes', () => {
    render(<Navbar />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rotisserie-christian');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render LinkedIn contact link with correct href and attributes', () => {
    render(<Navbar />);
    const linkedinLink = screen.getByRole('link', { name: /contact/i });
    
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/cwaters123');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render GitHub button with icon', () => {
    render(<Navbar />);
    const githubButton = screen.getByRole('button', { name: /github/i });
    expect(githubButton).toBeInTheDocument();
    
    // Check that icon is rendered
    const githubIcon = screen.getByTestId('github-icon');
    expect(githubIcon).toBeInTheDocument();
  });

  it('should render LinkedIn contact button with icon', () => {
    render(<Navbar />);
    const linkedinButton = screen.getByRole('button', { name: /contact/i });
    expect(linkedinButton).toBeInTheDocument();
    
    // Check that icon is rendered
    const linkedinIcon = screen.getByTestId('linkedin-icon');
    expect(linkedinIcon).toBeInTheDocument();
  });

  it('should have correct CSS classes on navigation element', () => {
    render(<Navbar />);
    const nav = screen.getByRole('navigation');
    
    expect(nav).toHaveClass('sticky', 'top-0', 'z-50', 'backdrop-blur-sm', 'w-full', 'bg-base-100/80', 'shadow-md');
  });
});

