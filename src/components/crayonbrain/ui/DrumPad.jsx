import PropTypes from 'prop-types';
import { TIME_STEPS } from '../utils/sequencerConstants';
import { shouldBeDarkerStep } from '../utils/sequencerUtils';

const DrumPad = ({ drumSounds, drumSequence, onCellClick }) => {
    return (
        <div className="flex flex-col gap-1 p-1 md:p-2 lg:p-3 bg-base-300 rounded">
            {drumSounds.map((sound, soundIndex) => (
                <div key={sound.id} className="flex items-center gap-1">
                    <div className="w-20 md:w-24 lg:w-28 h-10 flex items-center justify-center text-xs md:text-sm lg:text-base font-semibold bg-base-100 text-base-content rounded p-1 truncate">
                        {sound.name}
                    </div>

                    <div className="flex-grow grid gap-1" style={{ gridTemplateColumns: `repeat(${TIME_STEPS}, minmax(0, 1fr))` }}>
                        {/* 
                            fill button if the step is active for that sample
                            darken the notes for the 2nd and 4th quarters of the bar 
                        */}
                        {drumSequence[soundIndex]?.steps.map((isActive, stepIndex) => (
                            <button
                                key={`${sound.id}-${stepIndex}`}
                                data-step={stepIndex}
                                onClick={() => onCellClick(soundIndex, stepIndex)}
                                className={`
                                    drum-cell
                                    h-10 w-full min-w-[32px] md:min-w-[34px] lg:min-w-[35px] rounded border border-base-content/30
                                    transition-[background-color,transform] duration-100 ease-in-out cursor-pointer
                                    ${isActive ? 'bg-accent scale-95' : 
                                        (
                                            shouldBeDarkerStep(stepIndex) ? 
                                                'bg-base-300 hover:bg-neutral-500' : 
                                                'bg-base-100 hover:bg-neutral-focus/30'
                                        )
                                    }
                                `}

                                aria-label={`Toggle ${sound.name} at step ${stepIndex + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

DrumPad.propTypes = {
    drumSounds: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
        })
    ).isRequired,
    drumSequence: PropTypes.arrayOf(
        PropTypes.shape({
            steps: PropTypes.arrayOf(PropTypes.bool).isRequired,
        })
    ).isRequired,
    onCellClick: PropTypes.func.isRequired,
};

export default DrumPad;
