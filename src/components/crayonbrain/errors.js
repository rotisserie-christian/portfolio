export class SequencerContextError extends Error {
  constructor() {
    super('useSequencerContext must be used within SequencerProvider');
    this.name = 'SequencerContextError';
  }
}

export class AudioInitializationError extends Error {
  constructor(message = 'Failed to initialize audio', cause = null) {
    super(message);
    this.name = 'AudioInitializationError';
    this.cause = cause;
  }
}

export class TransportError extends Error {
  constructor(message = 'Transport operation failed', cause = null) {
    super(message);
    this.name = 'TransportError';
    this.cause = cause;
  }
}

export class VisualizerSetupError extends Error {
  constructor(message = 'Failed to setup visualizer', cause = null) {
    super(message);
    this.name = 'VisualizerSetupError';
    this.cause = cause;
  }
}

export class PresetLoadError extends Error {
  constructor(message = 'Failed to load preset', presetIndex = null, cause = null) {
    super(message);
    this.name = 'PresetLoadError';
    this.presetIndex = presetIndex;
    this.cause = cause;
  }
}

