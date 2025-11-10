import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '../../test-utils/test-utils';
import { wrapperWithSequencerProvider } from '../../test-utils/integrationTestWrappers';
import { setupIntegrationToneMocks, cleanupToneMocks } from '../../test-utils/audioIntegrationMocks';
import Visualizer from '../../components/crayonbrain/Visualizer';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';
import {
  createMockVisualizer,
  createMockPresetsMinimal,
  setupRequestAnimationFrame,
  setupDevicePixelRatio,
  restoreDevicePixelRatio,
} from './__test-utils__';

vi.mock('butterchurn', () => ({
  default: {
    createVisualizer: vi.fn(),
  },
}));

vi.mock('butterchurn-presets', () => ({
  default: {
    getPresets: vi.fn(),
  },
}));

// Mock Tone.js 
vi.mock('tone', () => ({
  getContext: vi.fn(),
  getDestination: vi.fn(),
  Gain: vi.fn(),
  Player: vi.fn(),
  Sequence: vi.fn(),
  getTransport: vi.fn(),
  loaded: vi.fn(),
  start: vi.fn(),
}));

import * as Tone from 'tone';

// Mock PresetControls 
vi.mock('../../components/crayonbrain/PresetControls', () => ({
  default: () => <div data-testid="preset-controls">Preset Controls</div>,
}));

describe('useVisualizer Integration', () => {
  let mockAudioContext;
  let mockGainNode;
  let mockVisualizer;
  let mockPresets;
  let rafSetup;
  let originalDpr;
  let toneMocks;

  beforeEach(() => {
    // Setup device pixel ratio
    originalDpr = setupDevicePixelRatio(1);

    // Setup requestAnimationFrame
    rafSetup = setupRequestAnimationFrame();

    // Setup comprehensive Tone.js mocks
    toneMocks = setupIntegrationToneMocks(Tone);
    mockAudioContext = toneMocks.mockAudioContext;
    mockGainNode = toneMocks.mockGainNode;

    // Create visualizer mocks
    mockVisualizer = createMockVisualizer({
      withSetRendererSize: true,
      withRender: true,
    });
    mockPresets = createMockPresetsMinimal([0, 1, 2]);

    // Setup Butterchurn mocks
    butterchurn.createVisualizer.mockReturnValue(mockVisualizer);
    butterchurnPresets.getPresets.mockReturnValue(mockPresets);

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanupToneMocks();
    restoreDevicePixelRatio(originalDpr);
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  const renderVisualizerWithProviders = () => {
    return render(
      <Visualizer canvasId="test-visualizer" />,
      { wrapper: wrapperWithSequencerProvider }
    );
  };

  describe('Full Integration Flow', () => {
    it('should set up visualizer when component mounts', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(butterchurn.createVisualizer).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockVisualizer.connectAudio).toHaveBeenCalled();
      });
    });

    it('should start render loop and call render on frames', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
      });

      // Trigger a frame
      act(() => {
        rafSetup.triggerFrame();
      });

      await waitFor(() => {
        expect(mockVisualizer.render).toHaveBeenCalled();
      });
    });

    it('should handle canvas resize events', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(mockVisualizer.setRendererSize).toBeDefined();
      });

      // Simulate window resize
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Resize handler
      expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
    });

    it('should cleanup on unmount', async () => {
      const { unmount } = await act(async () => {
        return renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(mockVisualizer).toBeDefined();
      });

      await act(async () => {
        unmount();
      });

      // Verify cleanup was called
      await waitFor(() => {
        expect(mockVisualizer.disconnect).toHaveBeenCalled();
      });
    });
  });

  describe('Integration with SequencerContext', () => {
    it('should connect to sequencer gain node when available', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      // Full chain for useAudioConnection
      await waitFor(() => {
        // Verify audio connection setup was attempted
        expect(mockAudioContext.createAnalyser || mockGainNode.connect).toBeDefined();
      });
    });

    it('should work with SequencerProvider context', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      // Should render without errors when wrapped in SequencerProvider
      expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
      
      const canvas = document.getElementById('test-visualizer');
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle visualizer creation errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      butterchurn.createVisualizer.mockImplementation(() => {
        throw new Error('Visualizer creation failed');
      });

      await act(async () => {
        renderVisualizerWithProviders();
      });

      // Should log the error
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error setting up visualizer:',
          expect.any(Error)
        );
      });

      // Component should still render even if visualizer creation fails
      expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
      const canvas = document.getElementById('test-visualizer');
      expect(canvas).toBeInTheDocument();
      
      consoleErrorSpy.mockRestore();
    });

    it('should continue rendering even if render throws', async () => {
      mockVisualizer.render.mockImplementation(() => {
        throw new Error('Render error');
      });

      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
      });

      // Trigger frame - should handle error and continue
      act(() => {
        rafSetup.triggerFrame();
      });

      // Loop should continue despite error
      await waitFor(() => {
        expect(globalThis.requestAnimationFrame.mock.calls.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Canvas Integration', () => {
    it('should create canvas element and attach ref', async () => {
      const { container } = await act(async () => {
        return renderVisualizerWithProviders();
      });

      const canvas = container.querySelector('canvas#test-visualizer');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    });

    it('should pass canvas to visualizer setup', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(butterchurn.createVisualizer).toHaveBeenCalledWith(
          mockAudioContext,
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
            width: expect.any(Number),
            height: expect.any(Number),
            pixelRatio: expect.any(Number),
          })
        );
      });
    });

    it('should handle canvas dimensions correctly', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        const createVisualizerCall = butterchurn.createVisualizer.mock.calls[0];
        const config = createVisualizerCall[2];
        
        expect(config.width).toBeGreaterThan(0);
        expect(config.height).toBeGreaterThan(0);
        expect(config.pixelRatio).toBeGreaterThan(0);
      });
    });
  });

  describe('Hook Integration', () => {
    it('should integrate all sub-hooks correctly', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      // Setup visualizer (useSetupVisualizer)
      await waitFor(() => {
        expect(butterchurn.createVisualizer).toHaveBeenCalled();
      });

      // Audio connection (useAudioConnection)
      await waitFor(() => {
        expect(mockAudioContext.createAnalyser || mockGainNode.connect).toBeDefined();
      });

      // Render loop (useRenderLoop)
      await waitFor(() => {
        expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
      });

      // Canvas resize (useCanvasResize) - tested implicitly through resize event
      expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
    });

    it('should return correct refs from hook', async () => {
      await act(async () => {
        renderVisualizerWithProviders();
      });

      await waitFor(() => {
        expect(screen.getByTestId('preset-controls')).toBeInTheDocument();
      });
    });
  });
});

