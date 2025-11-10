import { describe, it, expect } from 'vitest';
import initialNodes from './initialNodes';

describe('initialNodes', () => {
  it('should be an array', () => {
    expect(Array.isArray(initialNodes)).toBe(true);
  });

  it('should have 7 nodes', () => {
    expect(initialNodes).toHaveLength(7);
  });

  it('should have all required node properties', () => {
    initialNodes.forEach((node) => {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('position');
      expect(node).toHaveProperty('data');
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('draggable');
    });
  });

  it('should have unique node IDs', () => {
    const ids = initialNodes.map((node) => node.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(initialNodes.length);
  });

  it('should have position objects with x and y', () => {
    initialNodes.forEach((node) => {
      expect(node.position).toHaveProperty('x');
      expect(node.position).toHaveProperty('y');
      expect(typeof node.position.x).toBe('number');
      expect(typeof node.position.y).toBe('number');
    });
  });

  it('should have data objects with label property', () => {
    initialNodes.forEach((node) => {
      expect(node.data).toHaveProperty('label');
      expect(typeof node.data.label).toBe('string');
      expect(node.data.label.length).toBeGreaterThan(0);
    });
  });

  it('should have valid node types', () => {
    const validTypes = ['ui', 'musicalData', 'custom', 'process', 'mainOutput', 'visual', 'videoEncoder'];
    
    initialNodes.forEach((node) => {
      expect(validTypes).toContain(node.type);
    });
  });

  it('should have draggable set to false for all nodes', () => {
    initialNodes.forEach((node) => {
      expect(node.draggable).toBe(false);
    });
  });

  describe('specific nodes', () => {
    it('should have UI node with correct properties', () => {
      const uiNode = initialNodes.find((node) => node.id === '1');
      expect(uiNode).toBeDefined();
      expect(uiNode.type).toBe('ui');
      expect(uiNode.data.label).toBe('UI layer for music input');
      expect(uiNode.position).toEqual({ x: 50, y: 0 });
    });

    it('should have MusicalData node with correct properties', () => {
      const musicalNode = initialNodes.find((node) => node.id === '3');
      expect(musicalNode).toBeDefined();
      expect(musicalNode.type).toBe('musicalData');
      expect(musicalNode.data.label).toBe('Music data');
      expect(musicalNode.position).toEqual({ x: 50, y: 200 });
    });

    it('should have Custom node with correct properties', () => {
      const customNode = initialNodes.find((node) => node.id === '4');
      expect(customNode).toBeDefined();
      expect(customNode.type).toBe('custom');
      expect(customNode.data.label).toBe('Callbacks for playback timing and tempo');
      expect(customNode.position).toEqual({ x: 300, y: 176 });
    });

    it('should have Process node with correct properties', () => {
      const processNode = initialNodes.find((node) => node.id === '5');
      expect(processNode).toBeDefined();
      expect(processNode.type).toBe('process');
      expect(processNode.data.label).toBe('Builds and renders the musical sequence');
      expect(processNode.position).toEqual({ x: 50, y: 315 });
    });

    it('should have MainOutput node with correct properties', () => {
      const mainOutputNode = initialNodes.find((node) => node.id === '7');
      expect(mainOutputNode).toBeDefined();
      expect(mainOutputNode.type).toBe('mainOutput');
      expect(mainOutputNode.data.label).toBe('Main audio output');
      expect(mainOutputNode.position).toEqual({ x: 50, y: 475 });
    });

    it('should have Visual node with correct properties', () => {
      const visualNode = initialNodes.find((node) => node.id === '8');
      expect(visualNode).toBeDefined();
      expect(visualNode.type).toBe('visual');
      expect(visualNode.data.label).toBe('Renders reactive visuals');
      expect(visualNode.position).toEqual({ x: 300, y: 475 });
    });

    it('should have VideoEncoder node with correct properties', () => {
      const videoEncoderNode = initialNodes.find((node) => node.id === '9');
      expect(videoEncoderNode).toBeDefined();
      expect(videoEncoderNode.type).toBe('videoEncoder');
      expect(videoEncoderNode.data.label).toBe('Encodes video');
      expect(videoEncoderNode.position).toEqual({ x: 175, y: 650 });
    });
  });

  it('should have nodes in expected order', () => {
    const expectedOrder = ['1', '3', '4', '5', '7', '8', '9'];
    const actualOrder = initialNodes.map((node) => node.id);
    expect(actualOrder).toEqual(expectedOrder);
  });
});

