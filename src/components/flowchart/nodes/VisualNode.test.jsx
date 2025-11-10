import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VisualNode from './VisualNode';

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

describe('VisualNode', () => {
  const mockData = {
    label: 'Renders reactive visuals',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<VisualNode data={mockData} />);

    expect(screen.getByText('Renders reactive visuals')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<VisualNode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render left target handle', () => {
    render(<VisualNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-left-left');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'left');
    expect(handle).toHaveAttribute('data-handle-id', 'left');
  });

  it('should render bottom source handle', () => {
    render(<VisualNode data={mockData} />);

    const handle = screen.getByTestId('handle-source-bottom-bottom');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'bottom');
    expect(handle).toHaveAttribute('data-handle-id', 'bottom');
  });

  it('should render both handles', () => {
    render(<VisualNode data={mockData} />);

    expect(screen.getByTestId('handle-target-left-left')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source-bottom-bottom')).toBeInTheDocument();
  });
});

