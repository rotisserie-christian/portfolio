import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useStocksVisualizer } from './hooks/visualizer/useStocksVisualizer';
import { useSequencerContext } from './hooks/useSequencerContext';
import {
  DEFAULT_STOCKS_PRESET,
  STOCKS_PRESET_IDS,
  STOCKS_PRESETS,
} from './utils/stocksConstants';
import PresetControls from './ui/PresetControls';

const StocksVisualizer = ({ className = '', canvasId, fillParent = false }) => {
  const canvasRef = useRef(null);
  const { isPlaying, sequencerGainRef, bpm } = useSequencerContext();
  const [presetIndex, setPresetIndex] = useState(
    STOCKS_PRESET_IDS.indexOf(DEFAULT_STOCKS_PRESET)
  );
  const mode = STOCKS_PRESET_IDS[presetIndex] ?? DEFAULT_STOCKS_PRESET;

  useStocksVisualizer(canvasRef, isPlaying, sequencerGainRef, bpm, mode);

  const switchPreset = (direction) => {
    setPresetIndex((current) => {
      const delta = direction === 'next' ? 1 : -1;
      return (current + delta + STOCKS_PRESET_IDS.length) % STOCKS_PRESET_IDS.length;
    });
  };

  const canvasClasses = fillParent
    ? 'w-full h-full rounded-br-lg rounded-bl-lg'
    : 'w-full h-full rounded-bl-lg rounded-br-lg';

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className={`w-full ${fillParent ? 'h-full' : 'h-[500px]'} pt-4 bg-base-300 rounded-xl shadow-sm flex flex-col`}>
        <PresetControls
          currentPresetSelection={presetIndex}
          presetName={STOCKS_PRESETS[mode].label}
          onPrevious={() => switchPreset('prev')}
          onNext={() => switchPreset('next')}
          totalPresets={STOCKS_PRESET_IDS.length}
        />

        <div className="w-full flex-1 flex items-center justify-center min-h-0">
          <canvas id={canvasId} ref={canvasRef} className={canvasClasses} />
        </div>
      </div>
    </div>
  );
};

StocksVisualizer.propTypes = {
  className: PropTypes.string,
  canvasId: PropTypes.string,
  fillParent: PropTypes.bool,
};

export default StocksVisualizer;
