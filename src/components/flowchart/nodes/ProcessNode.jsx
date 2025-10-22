import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

// top target, bottom source 
const ProcessNode = ({ data }) => {
  return (
    <div className="darkNodeStyle">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <div>{data.label}</div>
    </div>
  );
};

ProcessNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProcessNode;
