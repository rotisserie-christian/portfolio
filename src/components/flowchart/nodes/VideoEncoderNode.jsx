import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

// top targets only
const VideoEncoderNode = ({ data }) => {
  return (
    <div className="darkNodeStyle">
      <Handle type="target" position={Position.Top} id="top" />
      <div>{data.label}</div>
    </div>
  );
};

VideoEncoderNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default VideoEncoderNode;
