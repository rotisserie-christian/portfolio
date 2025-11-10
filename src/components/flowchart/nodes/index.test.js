import { describe, it, expect } from 'vitest';
import {
  CustomNode,
  MusicalDataNode,
  ProcessNode,
  MainOutputNode,
  VisualNode,
  UINode,
  VideoEncoderNode,
} from './index';

describe('nodes/index.js', () => {
  it('should export CustomNode', () => {
    expect(CustomNode).toBeDefined();
    expect(typeof CustomNode).toBe('function');
  });

  it('should export MusicalDataNode', () => {
    expect(MusicalDataNode).toBeDefined();
    expect(typeof MusicalDataNode).toBe('function');
  });

  it('should export ProcessNode', () => {
    expect(ProcessNode).toBeDefined();
    expect(typeof ProcessNode).toBe('function');
  });

  it('should export MainOutputNode', () => {
    expect(MainOutputNode).toBeDefined();
    expect(typeof MainOutputNode).toBe('function');
  });

  it('should export VisualNode', () => {
    expect(VisualNode).toBeDefined();
    expect(typeof VisualNode).toBe('function');
  });

  it('should export UINode', () => {
    expect(UINode).toBeDefined();
    expect(typeof UINode).toBe('function');
  });

  it('should export VideoEncoderNode', () => {
    expect(VideoEncoderNode).toBeDefined();
    expect(typeof VideoEncoderNode).toBe('function');
  });

  it('should export all 7 node components', () => {
    const exports = [
      CustomNode,
      MusicalDataNode,
      ProcessNode,
      MainOutputNode,
      VisualNode,
      UINode,
      VideoEncoderNode,
    ];

    expect(exports).toHaveLength(7);
    exports.forEach((exported) => {
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('function');
    });
  });
});

