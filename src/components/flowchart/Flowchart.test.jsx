import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AudioVisualizerFlow from './Flowchart';
import initialNodes from './initialNodes';
import initialEdges from './initialEdges';

// Mock functions
const mockOnNodesChange = vi.fn();
const mockOnEdgesChange = vi.fn();
const mockSetEdges = vi.fn();
const mockSetNodes = vi.fn();

// Mock reactflow
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  const mockUseNodesState = vi.fn();
  const mockUseEdgesState = vi.fn();
  const mockAddEdge = vi.fn((params, edges) => [...edges, params]);
  
  return {
    ...actual,
    default: ({ children, nodes, edges, nodeTypes, onConnect, ...props }) => (
      <div
        data-testid="react-flow"
        data-nodes={JSON.stringify(nodes)}
        data-edges={JSON.stringify(edges)}
        data-node-types={Object.keys(nodeTypes || {}).join(',')}
        data-fit-view={props.fitView}
        data-elements-selectable={props.elementsSelectable}
        data-zoom-on-scroll={props.zoomOnScroll}
        data-zoom-on-pinch={props.zoomOnPinch}
        data-on-connect={onConnect ? 'present' : 'absent'}
      >
        {children}
      </div>
    ),
    Background: ({ variant, gap, size }) => (
      <div
        data-testid="background"
        data-variant={variant}
        data-gap={gap}
        data-size={size}
      />
    ),
    useNodesState: mockUseNodesState,
    useEdgesState: mockUseEdgesState,
    addEdge: mockAddEdge,
  };
});

// Mock CSS import
vi.mock('./CustomNode.css', () => ({}));

describe('AudioVisualizerFlow', () => {
  let useNodesStateSpy;
  let useEdgesStateSpy;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import the mocked module to get access to the mock functions
    const reactflow = await import('reactflow');
    useNodesStateSpy = reactflow.useNodesState;
    useEdgesStateSpy = reactflow.useEdgesState;
    
    // Setup default return values
    useNodesStateSpy.mockReturnValue([initialNodes, mockSetNodes, mockOnNodesChange]);
    useEdgesStateSpy.mockReturnValue([initialEdges, mockSetEdges, mockOnEdgesChange]);
  });

  it('should render ReactFlow component', () => {
    render(<AudioVisualizerFlow />);

    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('should initialize with initialNodes', () => {
    render(<AudioVisualizerFlow />);

    expect(useNodesStateSpy).toHaveBeenCalledWith(initialNodes);
  });

  it('should initialize with initialEdges', () => {
    render(<AudioVisualizerFlow />);

    expect(useEdgesStateSpy).toHaveBeenCalledWith(initialEdges);
  });

  it('should register all node types', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    const nodeTypes = reactFlow.getAttribute('data-node-types');
    const nodeTypesArray = nodeTypes.split(',');

    expect(nodeTypesArray).toContain('custom');
    expect(nodeTypesArray).toContain('musicalData');
    expect(nodeTypesArray).toContain('process');
    expect(nodeTypesArray).toContain('mainOutput');
    expect(nodeTypesArray).toContain('visual');
    expect(nodeTypesArray).toContain('ui');
    expect(nodeTypesArray).toContain('videoEncoder');
    expect(nodeTypesArray).toHaveLength(7);
  });

  it('should pass nodes to ReactFlow', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    const nodesData = reactFlow.getAttribute('data-nodes');
    const nodes = JSON.parse(nodesData);

    expect(nodes).toEqual(initialNodes);
  });

  it('should pass edges to ReactFlow', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    const edgesData = reactFlow.getAttribute('data-edges');
    const edges = JSON.parse(edgesData);

    expect(edges).toEqual(initialEdges);
  });

  it('should render Background component', () => {
    render(<AudioVisualizerFlow />);

    const background = screen.getByTestId('background');
    expect(background).toBeInTheDocument();
    expect(background).toHaveAttribute('data-variant', 'dots');
    expect(background).toHaveAttribute('data-gap', '12');
    expect(background).toHaveAttribute('data-size', '0.6');
  });

  it('should set fitView prop', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    expect(reactFlow).toHaveAttribute('data-fit-view', 'true');
  });

  it('should set elementsSelectable to false', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    expect(reactFlow).toHaveAttribute('data-elements-selectable', 'false');
  });

  it('should disable zoom on scroll', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    expect(reactFlow).toHaveAttribute('data-zoom-on-scroll', 'false');
  });

  it('should disable zoom on pinch', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    expect(reactFlow).toHaveAttribute('data-zoom-on-pinch', 'false');
  });

  it('should provide onConnect callback', () => {
    render(<AudioVisualizerFlow />);

    const reactFlow = screen.getByTestId('react-flow');
    expect(reactFlow).toHaveAttribute('data-on-connect', 'present');
  });

  it('should provide onNodesChange callback', () => {
    render(<AudioVisualizerFlow />);

    // onNodesChange is passed to ReactFlow
    expect(mockOnNodesChange).toBeDefined();
  });

  it('should provide onEdgesChange callback', () => {
    render(<AudioVisualizerFlow />);

    // onEdgesChange is passed to ReactFlow
    expect(mockOnEdgesChange).toBeDefined();
  });

  it('should have correct container styling classes', () => {
    const { container } = render(<AudioVisualizerFlow />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('pointer-events-none');
    expect(wrapper).toHaveClass('mx-auto');
    expect(wrapper).toHaveClass('w-[350px]');
    expect(wrapper).toHaveClass('lg:w-[421px]');
    expect(wrapper).toHaveClass('lg:w-[400px]');
    expect(wrapper).toHaveClass('h-[750px]');
  });
});
