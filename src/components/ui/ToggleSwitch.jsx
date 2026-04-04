import PropTypes from 'prop-types';

const ToggleSwitch = ({
    leftLabel,
    rightLabel,
    isChecked,
    onChange,
    className = '',
    leftIcon,
    rightIcon
}) => {
    return (
        <div className={`flex items-center justify-center w-full ${className}`}>
            <div className='flex flex-row items-center justify-between px-8 py-2 bg-base-200 rounded-full w-72'>
                <div className='flex flex-row items-center justify-center gap-2 w-14'>
                    {leftIcon && <span className="text-sm">{leftIcon}</span>}
                    <p className={`text-md ubuntu-medium ${!isChecked ? 'text-cyan-200' : 'text-base-content/60'}`}>
                        {leftLabel}
                    </p>
                </div>

                <input
                    type="checkbox"
                    className='toggle bg-cyan-100/20 checked:bg-cyan-100/20 checked:border-cyan-100/20 hover:bg-cyan-100/20'
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                />

                <div className='flex flex-row items-center justify-center gap-2 w-14'>
                    {rightIcon && <span className="text-sm">{rightIcon}</span>}
                    <p className={`text-md ubuntu-medium ${isChecked ? 'text-cyan-200' : 'text-base-content/60'}`}>
                        {rightLabel}
                    </p>
                </div>
            </div>
        </div>
    );
};

ToggleSwitch.propTypes = {
    leftLabel: PropTypes.string.isRequired,
    rightLabel: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
};

export default ToggleSwitch;