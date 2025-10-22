import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

// top target, right target, and bottom source
const MusicalDataNode = ({ data }) => {
  return (
    <div className="darkNodeStyle">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <div>{data.label}</div>
    </div>
  );
};

MusicalDataNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default MusicalDataNode;
