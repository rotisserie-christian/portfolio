import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

// left target, bottom source
const VisualNode = ({ data }) => {
  return (
    <div className="darkNodeStyle">
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Top} id="top" />
      <div>{data.label}</div>
    </div>
  );
};

VisualNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default VisualNode;
