import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { MIN_BPM, MAX_BPM } from './tempoConstants';
import CustomSlider from './CustomSlider';

const TempoSlider = ({ bpm, onBpmChange, minBpm = MIN_BPM, maxBpm = MAX_BPM }) => {
    const handleDecrement = () => {
        onBpmChange(prevBpm => Math.max(minBpm, prevBpm - 1));
    };

    const handleIncrement = () => {
        onBpmChange(prevBpm => Math.min(maxBpm, prevBpm + 1));
    };

    const handleSliderChange = (event) => {
        onBpmChange(parseInt(event.target.value, 10));
    };

    return (
        <div className='flex flex-col items-center gap-2 w-full mt-3 mb-2'>
            <div className="flex items-center gap-3"> 
                <button 
                    onClick={handleDecrement} 
                    className="btn btn-ghost btn-sm p-1" 
                    aria-label="Decrement BPM"
                >
                    <FaAngleLeft className="w-7 h-7" /> 
                </button>
                <p className='text-3xl font-bold text-center min-w-[70px]'>
                    {bpm}
                    <span className='text-lg font-semibold ml-1'>bpm</span>
                </p>
                <button 
                    onClick={handleIncrement} 
                    className="btn btn-ghost btn-sm p-1" 
                    aria-label="Increment BPM"
                >
                    <FaAngleRight className="w-7 h-7" /> 
                </button>
            </div>
            <div className="w-full px-4">
                <CustomSlider 
                    min={minBpm} 
                    max={maxBpm} 
                    value={bpm} 
                    onChange={handleSliderChange} 
                />
            </div>
        </div>
    );
};

TempoSlider.propTypes = {
    bpm: PropTypes.number.isRequired,
    onBpmChange: PropTypes.func.isRequired,
    minBpm: PropTypes.number,
    maxBpm: PropTypes.number,
};

TempoSlider.defaultProps = {
    minBpm: MIN_BPM,
    maxBpm: MAX_BPM,
};

export default TempoSlider;