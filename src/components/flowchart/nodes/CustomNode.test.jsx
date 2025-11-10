import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomNode from './CustomNode';
import { Handle, Position } from 'reactflow';

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

describe('CustomNode', () => {
  const mockData = {
    label: 'Test Custom Node',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<CustomNode data={mockData} />);

    expect(screen.getByText('Test Custom Node')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<CustomNode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render top target handle', () => {
    render(<CustomNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-top-top');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'top');
    expect(handle).toHaveAttribute('data-handle-id', 'top');
  });

  it('should render left source handle', () => {
    render(<CustomNode data={mockData} />);

    const handle = screen.getByTestId('handle-source-left-left');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'left');
    expect(handle).toHaveAttribute('data-handle-id', 'left');
  });

  it('should render both handles', () => {
    render(<CustomNode data={mockData} />);

    expect(screen.getByTestId('handle-target-top-top')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source-left-left')).toBeInTheDocument();
  });

  it('should render different label text', () => {
    const customData = {
      label: 'Callbacks for playback timing and tempo',
    };

    render(<CustomNode data={customData} />);

    expect(screen.getByText('Callbacks for playback timing and tempo')).toBeInTheDocument();
  });
});

