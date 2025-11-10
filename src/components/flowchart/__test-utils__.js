import { vi } from 'vitest';

/**
 * Creates mock node data for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock node data object
 */
export const createMockNodeData = (overrides = {}) => ({
  label: 'Test Node',
  ...overrides,
});

/**
 * Creates mock node props for ReactFlow
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock node props object
 */
export const createMockNodeProps = (overrides = {}) => ({
  id: 'test-node-1',
  data: createMockNodeData(),
  position: { x: 0, y: 0 },
  type: 'custom',
  draggable: false,
  ...overrides,
});

/**
 * Creates mock edge props for ReactFlow
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock edge props object
 */
export const createMockEdgeProps = (overrides = {}) => ({
  id: 'e-1-2',
  source: '1',
  target: '2',
  animated: false,
  ...overrides,
});

/**
 * Creates mock nodes array for testing
 * @param {number} count - Number of nodes to create
 * @param {Object} baseOverrides - Base properties to apply to all nodes
 * @returns {Array} Array of mock node objects
 */
export const createMockNodes = (count = 1, baseOverrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createMockNodeProps({
      id: `node-${i + 1}`,
      ...baseOverrides,
    })
  );
};

/**
 * Creates mock edges array for testing
 * @param {Array} nodeIds - Array of node ID pairs [source, target]
 * @returns {Array} Array of mock edge objects
 */
export const createMockEdges = (nodeIds = [['1', '2']]) => {
  return nodeIds.map(([source, target], index) =>
    createMockEdgeProps({
      id: `e-${source}-${target}`,
      source,
      target,
    })
  );
};

/**
 * Sets up ReactFlow mocks
 * @param {Object} options - Configuration options
 * @param {Array} options.initialNodes - Initial nodes for useNodesState
 * @param {Array} options.initialEdges - Initial edges for useEdgesState
 * @returns {Object} Mock functions and return values
 */
export const setupReactFlowMocks = ({ initialNodes = [], initialEdges = [] } = {}) => {
  const mockSetNodes = vi.fn();
  const mockOnNodesChange = vi.fn();
  const mockSetEdges = vi.fn();
  const mockOnEdgesChange = vi.fn();
  const mockAddEdge = vi.fn((params, edges) => [...edges, params]);

  return {
    mockSetNodes,
    mockOnNodesChange,
    mockSetEdges,
    mockOnEdgesChange,
    mockAddEdge,
    useNodesStateReturn: [initialNodes, mockSetNodes, mockOnNodesChange],
    useEdgesStateReturn: [initialEdges, mockSetEdges, mockOnEdgesChange],
  };
};

/**
 * Creates a mock ReactFlow component
 * @returns {Function} Mock ReactFlow component
 */
export const createMockReactFlow = () => {
  return vi.fn(({ children, ...props }) => {
    // Return a simple div that captures props for testing
    return {
      type: 'div',
      props: {
        'data-testid': 'react-flow',
        'data-nodes': JSON.stringify(props.nodes || []),
        'data-edges': JSON.stringify(props.edges || []),
        'data-node-types': Object.keys(props.nodeTypes || {}).join(','),
        ...props,
        children,
      },
    };
  });
};

/**
 * Creates a mock Handle component
 * @returns {Function} Mock Handle component
 */
export const createMockHandle = () => {
  return vi.fn(({ type, position, id, ...props }) => ({
    type: 'div',
    props: {
      'data-testid': `handle-${type}-${position}-${id || 'default'}`,
      'data-handle-type': type,
      'data-handle-position': position,
      'data-handle-id': id,
      ...props,
    },
  }));
};

/**
 * Creates a mock Background component
 * @returns {Function} Mock Background component
 */
export const createMockBackground = () => {
  return vi.fn((props) => ({
    type: 'div',
    props: {
      'data-testid': 'background',
      ...props,
    },
  }));
};

/**
 * Position constants for testing
 */
export const MockPosition = {
  Top: 'top',
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
};

