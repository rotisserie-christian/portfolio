import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainOutputNode from './MainOutputNode';

// Mock reactflow
vi.mock('reactflow', () => ({
  Handle: ({ type, position, id }) => (
    <div
      data-testid={`handle-${type}-${position}-${id}`}
      data-handle-type={type}
      data-handle-position={position}
      data-handle-id={id}
    />
  ),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
}));

describe('MainOutputNode', () => {
  const mockData = {
    label: 'Main audio output',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<MainOutputNode data={mockData} />);

    expect(screen.getByText('Main audio output')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<MainOutputNode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render top target handle', () => {
    render(<MainOutputNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-top-top');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'top');
  });

  it('should render right source handle', () => {
    render(<MainOutputNode data={mockData} />);

    const handle = screen.getByTestId('handle-source-right-right');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'right');
  });

  it('should render bottom source handle', () => {
    render(<MainOutputNode data={mockData} />);

    const handle = screen.getByTestId('handle-source-bottom-bottom');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'bottom');
  });

  it('should render all three handles', () => {
    render(<MainOutputNode data={mockData} />);

    expect(screen.getByTestId('handle-target-top-top')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source-right-right')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source-bottom-bottom')).toBeInTheDocument();
  });
});

