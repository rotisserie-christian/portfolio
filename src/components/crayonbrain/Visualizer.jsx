import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useVisualizer } from '../../hooks/visualizer/useVisualizer';

const Visualizer = ({ className = '', canvasId, fillParent = false, isPlaying = true, sequencerGainRef = null }) => {
  const canvasRef = useRef(null);
  
  useVisualizer(canvasRef, isPlaying, sequencerGainRef);


  const canvasClasses = fillParent
    ? 'w-full h-full lg:rounded-2xl shadow-lg'
    : 'w-full max-w-7xl h-[220px] md:h-[280px] lg:h-[360px] lg:rounded-2xl shadow-lg';

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <canvas id={canvasId} ref={canvasRef} className={canvasClasses} />
    </div>
  );
};

Visualizer.propTypes = {
  className: PropTypes.string,
  canvasId: PropTypes.string,
  fillParent: PropTypes.bool,
  isPlaying: PropTypes.bool,
  sequencerGainRef: PropTypes.object,
};

export default Visualizer;