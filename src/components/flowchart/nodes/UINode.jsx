import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

// bottom source only 
const UINode = ({ data }) => {
  return (
    <div className="darkNodeStyle">
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <div>{data.label}</div>
    </div>
  );
};

UINode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default UINode;
