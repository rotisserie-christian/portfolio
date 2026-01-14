import PropTypes from 'prop-types';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const PresetControls = ({ 
  currentPresetSelection, 
  presetName, 
  onPrevious, 
  onNext,
  totalPresets = 3 
}) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Top Row: Navigation arrows and indicator dots */}
      <div className="flex items-center justify-between w-full max-w-[200px] mx-auto">
        <button
          onClick={onPrevious}
          className="btn btn-ghost btn-sm p-1"
          aria-label="Previous preset"
        >
          <FaAngleLeft className="w-7 h-7 text-neutral-content/85" />
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPresets }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentPresetSelection
                  ? 'bg-primary'
                  : 'bg-gray-500'
              }`}
              aria-label={`Preset ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="btn btn-ghost btn-sm p-1"
          aria-label="Next preset"
        >
          <FaAngleRight className="w-7 h-7 text-neutral-content/85" />
        </button>
      </div>

      {/* Bottom Row: Preset name */}
      <div className="text-center">
        <p className="text-sm font-semibold text-base-content/70">
          {presetName}
        </p>
      </div>
    </div>
  );
};

PresetControls.propTypes = {
  currentPresetSelection: PropTypes.number.isRequired,
  presetName: PropTypes.string.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  totalPresets: PropTypes.number,
};

export default PresetControls;

