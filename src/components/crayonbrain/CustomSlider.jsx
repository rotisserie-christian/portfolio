import PropTypes from 'prop-types';

const CustomSlider = ({ min, max, value, onChange }) => {
    const handleChange = (e) => {
        onChange(e);
    };

    // Percentage for thumb position
    const thumbPositionPercentage = ((Number(value) - min) / (max - min)) * 100;

    return (
        <div className="relative w-full max-w-[350px] mx-auto my-2 h-8 flex items-center cursor-pointer">
            {/* Base Track (gray) */}
            <div className="w-full h-2 bg-gray-600 bg-opacity-30 rounded-full"></div>

            {/* Thumb */}
            <div
                className="absolute w-6 h-6 bg-slate-500 shadow-2xl rounded-lg shadow-md"
                style={{
                    left: `calc(${thumbPositionPercentage}% - 12px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    pointerEvents: 'none'
                }}
            ></div>

            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    );
};

CustomSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CustomSlider;