/**
 * Custom error classes for crayonbrain components
 */

export class SequencerContextError extends Error {
  constructor() {
    super('useSequencerContext must be used within SequencerProvider');
    this.name = 'SequencerContextError';
  }
}

export class AudioInitializationError extends Error {
  cause?: any;
  constructor(message = 'Failed to initialize audio', cause: any = null) {
    super(message);
    this.name = 'AudioInitializationError';
    this.cause = cause;
  }
}

export class TransportError extends Error {
  cause?: any;
  constructor(message = 'Transport operation failed', cause: any = null) {
    super(message);
    this.name = 'TransportError';
    this.cause = cause;
  }
}

export class VisualizerSetupError extends Error {
  cause?: any;
  constructor(message = 'Failed to setup visualizer', cause: any = null) {
    super(message);
    this.name = 'VisualizerSetupError';
    this.cause = cause;
  }
}

export class PresetLoadError extends Error {
  presetIndex?: number | null;
  cause?: any;
  constructor(message = 'Failed to load preset', presetIndex: number | null = null, cause: any = null) {
    super(message);
    this.name = 'PresetLoadError';
    this.presetIndex = presetIndex;
    this.cause = cause;
  }
}
