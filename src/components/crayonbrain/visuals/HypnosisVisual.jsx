import { useRef } from 'react';
import PropTypes from 'prop-types';
import cb from './cb.png';
import ShaderVisualizer from './shader/ShaderVisualizer';
import { useLogoPulseVisualizer } from './logopulse/hooks/useLogoPulseVisualizer';
import { LOGOPULSE_COLOR_HEX } from './logopulse/logoPulseConstants';

const OVERLAY_SETTINGS = {
  style: 'bars',
  size: 100,
  backgroundOpacity: 0,
  colors: LOGOPULSE_COLOR_HEX,
};

const LogoPulseOverlay = ({ isPlaying, analyser }) => {
  const canvasRef = useRef(null);

  useLogoPulseVisualizer({
    canvasRef,
    visible: true,
    isPlaying,
    analyser,
    logoSrc: cb,
    settings: OVERLAY_SETTINGS,
    overlay: true,
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 block h-full w-full bg-transparent"
      aria-hidden="true"
    />
  );
};

LogoPulseOverlay.propTypes = {
  isPlaying: PropTypes.bool,
  analyser: PropTypes.object,
};

const HypnosisVisual = ({
  isPlaying = false,
  shaderAnalyser = null,
  waveAnalyser = null,
  logoAnalyser = null,
}) => (
  <div className="relative h-full w-full">
    <ShaderVisualizer
      canvasId="hypnosis-ripples"
      fillParent
      visible
      isPlaying={isPlaying}
      analyser={shaderAnalyser}
      waveAnalyser={waveAnalyser}
      preset="ripples"
    />
    <LogoPulseOverlay isPlaying={isPlaying} analyser={logoAnalyser} />
  </div>
);

HypnosisVisual.propTypes = {
  isPlaying: PropTypes.bool,
  shaderAnalyser: PropTypes.object,
  waveAnalyser: PropTypes.object,
  logoAnalyser: PropTypes.object,
};

export default HypnosisVisual;
