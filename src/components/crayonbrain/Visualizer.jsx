import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useVisualizer } from './hooks/visualizer/useVisualizer';
import { useSequencerContext } from './hooks/useSequencerContext';
import { usePresetSwitching } from './hooks/visualizer/usePresetSwitching';
import { PRESET_INDICES } from './utils/visualizerConstants';
import PresetControls from './ui/PresetControls';

const Visualizer = ({ className = '', canvasId, fillParent = false }) => {
  const canvasRef = useRef(null);
  const { isPlaying, sequencerGainRef } = useSequencerContext();
  const { visualizerRef, presetsRef } = useVisualizer(canvasRef, isPlaying, sequencerGainRef);
  
  const { currentPresetSelection, presetName, switchPreset } = usePresetSwitching(
    visualizerRef,
    presetsRef
  );

  const canvasClasses = fillParent
    ? 'w-full h-full rounded-lg'
    : 'w-full h-full rounded-lg';

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="w-full h-[500px] p-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
        <PresetControls
          currentPresetSelection={currentPresetSelection}
          presetName={presetName}
          onPrevious={() => switchPreset('prev')}
          onNext={() => switchPreset('next')}
          totalPresets={PRESET_INDICES.length}
        />

        <div className="w-full flex-1 flex items-center justify-center min-h-0">
          <canvas id={canvasId} ref={canvasRef} className={canvasClasses} />
        </div>
      </div>
    </div>
  );
};

Visualizer.propTypes = {
  className: PropTypes.string,
  canvasId: PropTypes.string,
  fillParent: PropTypes.bool,
};

export default Visualizer;