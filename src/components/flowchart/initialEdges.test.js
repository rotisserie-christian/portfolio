import { describe, it, expect } from 'vitest';
import initialEdges from './initialEdges';
import initialNodes from './initialNodes';

describe('initialEdges', () => {
  const nodeIds = initialNodes.map((node) => node.id);

  it('should be an array', () => {
    expect(Array.isArray(initialEdges)).toBe(true);
  });

  it('should have edges', () => {
    expect(initialEdges.length).toBeGreaterThan(0);
  });

  it('should have all required edge properties', () => {
    initialEdges.forEach((edge) => {
      expect(edge).toHaveProperty('id');
      expect(edge).toHaveProperty('source');
      expect(edge).toHaveProperty('target');
    });
  });

  it('should have unique edge IDs', () => {
    const ids = initialEdges.map((edge) => edge.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(initialEdges.length);
  });

  it('should have source nodes that exist in initialNodes', () => {
    initialEdges.forEach((edge) => {
      expect(nodeIds).toContain(edge.source);
    });
  });

  it('should have target nodes that exist in initialNodes', () => {
    initialEdges.forEach((edge) => {
      expect(nodeIds).toContain(edge.target);
    });
  });

  it('should have animated property set to true for all edges', () => {
    initialEdges.forEach((edge) => {
      expect(edge.animated).toBe(true);
    });
  });

  it('should have valid edge IDs format', () => {
    initialEdges.forEach((edge) => {
      expect(edge.id).toMatch(/^e-/);
      expect(typeof edge.id).toBe('string');
    });
  });

  describe('specific edges', () => {
    it('should have edge from UI to callbacks', () => {
      const edge = initialEdges.find((e) => e.id === 'e-ui-callbacks');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('1');
      expect(edge.target).toBe('4');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from UI to musical data', () => {
      const edge = initialEdges.find((e) => e.id === 'e-ui-musical');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('1');
      expect(edge.target).toBe('3');
      expect(edge.sourceHandle).toBe('bottom');
      expect(edge.targetHandle).toBe('top');
      expect(edge.type).toBe('smoothstep');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from callbacks to musical data', () => {
      const edge = initialEdges.find((e) => e.id === 'e-callbacks-musical');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('4');
      expect(edge.target).toBe('3');
      expect(edge.sourceHandle).toBe('left');
      expect(edge.targetHandle).toBe('right');
      expect(edge.type).toBe('smoothstep');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from musical data to process', () => {
      const edge = initialEdges.find((e) => e.id === 'e-musical-process');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('3');
      expect(edge.target).toBe('5');
      expect(edge.sourceHandle).toBe('bottom');
      expect(edge.targetHandle).toBe('top');
      expect(edge.type).toBe('smoothstep');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from process to main output', () => {
      const edge = initialEdges.find((e) => e.id === 'e-process-main');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('5');
      expect(edge.target).toBe('7');
      expect(edge.sourceHandle).toBe('bottom');
      expect(edge.targetHandle).toBe('top');
      expect(edge.type).toBe('smoothstep');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from main output to visual', () => {
      const edge = initialEdges.find((e) => e.id === 'e-main-visual');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('7');
      expect(edge.target).toBe('8');
      expect(edge.sourceHandle).toBe('right');
      expect(edge.targetHandle).toBe('left');
      expect(edge.type).toBe('smoothstep');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from main output to video encoder', () => {
      const edge = initialEdges.find((e) => e.id === 'e-main-encoder');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('7');
      expect(edge.target).toBe('9');
      expect(edge.sourceHandle).toBe('bottom');
      expect(edge.targetHandle).toBe('top');
      expect(edge.animated).toBe(true);
    });

    it('should have edge from visual to video encoder', () => {
      const edge = initialEdges.find((e) => e.id === 'e-visual-encoder');
      expect(edge).toBeDefined();
      expect(edge.source).toBe('8');
      expect(edge.target).toBe('9');
      expect(edge.animated).toBe(true);
    });
  });

  it('should have correct number of edges', () => {
    expect(initialEdges).toHaveLength(8);
  });

  it('should have edges with valid handle positions when specified', () => {
    const validHandles = ['top', 'bottom', 'left', 'right'];
    
    initialEdges.forEach((edge) => {
      if (edge.sourceHandle) {
        expect(validHandles).toContain(edge.sourceHandle);
      }
      if (edge.targetHandle) {
        expect(validHandles).toContain(edge.targetHandle);
      }
    });
  });

  it('should have smoothstep type for edges that specify it', () => {
    const smoothstepEdges = initialEdges.filter((edge) => edge.type === 'smoothstep');
    expect(smoothstepEdges.length).toBeGreaterThan(0);
    smoothstepEdges.forEach((edge) => {
      expect(edge.type).toBe('smoothstep');
    });
  });
});

