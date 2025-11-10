import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UINode from './UINode';

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

describe('UINode', () => {
  const mockData = {
    label: 'UI layer for music input',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<UINode data={mockData} />);

    expect(screen.getByText('UI layer for music input')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<UINode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render bottom source handle only', () => {
    render(<UINode data={mockData} />);

    const handle = screen.getByTestId('handle-source-bottom-bottom');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'bottom');
    expect(handle).toHaveAttribute('data-handle-id', 'bottom');
  });

  it('should not render any target handles', () => {
    render(<UINode data={mockData} />);

    const targetHandles = screen.queryAllByTestId(/handle-target/);
    expect(targetHandles).toHaveLength(0);
  });

  it('should render only one handle (bottom source)', () => {
    render(<UINode data={mockData} />);

    const allHandles = screen.getAllByTestId(/handle-/);
    expect(allHandles).toHaveLength(1);
    expect(allHandles[0]).toHaveAttribute('data-handle-type', 'source');
  });
});

