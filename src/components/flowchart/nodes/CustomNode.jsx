import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

// top target, left source
const CustomNode = ({ data }) => {
  return (
    <div className="darkNodeStyle">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Left} id="left" />
      <div>{data.label}</div>
    </div>
  );
};

CustomNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default CustomNode;
