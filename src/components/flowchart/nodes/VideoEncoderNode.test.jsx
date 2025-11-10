import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VideoEncoderNode from './VideoEncoderNode';

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

describe('VideoEncoderNode', () => {
  const mockData = {
    label: 'Encodes video',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<VideoEncoderNode data={mockData} />);

    expect(screen.getByText('Encodes video')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<VideoEncoderNode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render top target handle', () => {
    render(<VideoEncoderNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-top-top');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'top');
    expect(handle).toHaveAttribute('data-handle-id', 'top');
  });

  it('should not render any source handles', () => {
    render(<VideoEncoderNode data={mockData} />);

    const sourceHandles = screen.queryAllByTestId(/handle-source/);
    expect(sourceHandles).toHaveLength(0);
  });

  it('should render only one handle (top target)', () => {
    render(<VideoEncoderNode data={mockData} />);

    const allHandles = screen.getAllByTestId(/handle-/);
    expect(allHandles).toHaveLength(1);
    expect(allHandles[0]).toHaveAttribute('data-handle-type', 'target');
  });
});

