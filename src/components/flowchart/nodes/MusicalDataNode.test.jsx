import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MusicalDataNode from './MusicalDataNode';

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

describe('MusicalDataNode', () => {
  const mockData = {
    label: 'Music data',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<MusicalDataNode data={mockData} />);

    expect(screen.getByText('Music data')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<MusicalDataNode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render top target handle', () => {
    render(<MusicalDataNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-top-top');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'top');
  });

  it('should render right target handle', () => {
    render(<MusicalDataNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-right-right');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'right');
  });

  it('should render bottom source handle', () => {
    render(<MusicalDataNode data={mockData} />);

    const handle = screen.getByTestId('handle-source-bottom-bottom');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'bottom');
  });

  it('should render all three handles', () => {
    render(<MusicalDataNode data={mockData} />);

    expect(screen.getByTestId('handle-target-top-top')).toBeInTheDocument();
    expect(screen.getByTestId('handle-target-right-right')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source-bottom-bottom')).toBeInTheDocument();
  });
});

