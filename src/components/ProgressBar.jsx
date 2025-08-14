import PropTypes from 'prop-types';

/**
 * @param {number} props.value - Current value
 * @param {number} props.maxValue - Maximum value for percentage calculation
 * @param {string} props.color - Background color of the bar
 * @param {boolean} props.isLeft - Whether this is a left-aligned bar (for mirror effect)
 * @returns {JSX.Element} Progress bar element
 */
const ProgressBar = ({ value, maxValue, color, isLeft }) => {
  const widthPercentage = (value / maxValue) * 100;
  
  return (
    <div className={`h-4 w-full ${isLeft ? 'flex justify-end' : ''}`}>
      <div
        className={`h-full ${isLeft ? 'rounded-l-[4px]' : 'rounded-r-[4px]'}`}
        style={{ width: `${widthPercentage}%`, backgroundColor: color }}
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  isLeft: PropTypes.bool.isRequired
};

export default ProgressBar;