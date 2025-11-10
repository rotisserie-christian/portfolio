import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProcessNode from './ProcessNode';

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

describe('ProcessNode', () => {
  const mockData = {
    label: 'Builds and renders the musical sequence',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the node with correct label', () => {
    render(<ProcessNode data={mockData} />);

    expect(screen.getByText('Builds and renders the musical sequence')).toBeInTheDocument();
  });

  it('should render with darkNodeStyle class', () => {
    const { container } = render(<ProcessNode data={mockData} />);

    const nodeElement = container.querySelector('.darkNodeStyle');
    expect(nodeElement).toBeInTheDocument();
  });

  it('should render top target handle', () => {
    render(<ProcessNode data={mockData} />);

    const handle = screen.getByTestId('handle-target-top-top');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'target');
    expect(handle).toHaveAttribute('data-handle-position', 'top');
  });

  it('should render bottom source handle', () => {
    render(<ProcessNode data={mockData} />);

    const handle = screen.getByTestId('handle-source-bottom-bottom');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('data-handle-type', 'source');
    expect(handle).toHaveAttribute('data-handle-position', 'bottom');
  });

  it('should render both handles', () => {
    render(<ProcessNode data={mockData} />);

    expect(screen.getByTestId('handle-target-top-top')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source-bottom-bottom')).toBeInTheDocument();
  });
});

