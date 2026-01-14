import PropTypes from 'prop-types';
import { FaPlay, FaStop } from 'react-icons/fa';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';

const SequencerControls = ({ isPlaying, isInitializing, onPlay, onClear }) => {
    return (
        <div className="flex flex-row items-center justify-between w-full mb-4 md:mb-6 lg:mb-8 px-2">
            <button
                onClick={onPlay}
                className={`btn btn-neutral rounded-xl ${isPlaying ? 'text-red-300' : 'text-cyan-200'} w-24 md:w-28 lg:w-32`}
                disabled={isInitializing}
                aria-label={isPlaying ? "Stop drum loop" : "Play drum loop"}
            >
                {isInitializing ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <>
                        {isPlaying ? <FaStop className="mr-1" /> : <FaPlay className="mr-1" />}
                        {isPlaying ? 'Stop' : 'Play'}
                    </>
                )}
            </button>

            <button
                onClick={onClear}
                className="btn btn-neutral rounded-xl w-24 md:w-28 lg:w-32"
                aria-label="Clear drum pattern"
            >
                <MdOutlineRemoveCircleOutline className="mr-1" />
                Clear
            </button>
        </div>
    );
};

SequencerControls.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    isInitializing: PropTypes.bool.isRequired,
    onPlay: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

export default SequencerControls;
