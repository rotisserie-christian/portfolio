import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useShaderVisualizer } from './hooks/useShaderVisualizer';
import { DEFAULT_SHADER_PRESET } from './presets';

/**
 * Crayonbrain "Shader" sub-visualizer: a raw WebGL fullscreen fragment
 * shader. `preset` selects which procedural pattern renders (see
 * presets/) — the component and its hook are entirely preset-agnostic.
 */
const ShaderVisualizer = ({
  className = '',
  canvasId,
  fillParent = false,
  visible = true,
  isPlaying = false,
  analyser = null,
  waveAnalyser = null,
  preset = DEFAULT_SHADER_PRESET,
}) => {
  const canvasRef = useRef(null);

  useShaderVisualizer({
    canvasRef,
    visible,
    isPlaying,
    analyser,
    waveAnalyser,
    preset,
  });

  const canvasClasses = fillParent
    ? `absolute inset-0 block h-full w-full ${className}`
    : `block h-full w-full ${className}`;

  return <canvas id={canvasId} ref={canvasRef} className={canvasClasses} />;
};

ShaderVisualizer.propTypes = {
  className: PropTypes.string,
  canvasId: PropTypes.string,
  fillParent: PropTypes.bool,
  visible: PropTypes.bool,
  isPlaying: PropTypes.bool,
  analyser: PropTypes.object,
  waveAnalyser: PropTypes.object,
  preset: PropTypes.string,
};

export default ShaderVisualizer;
