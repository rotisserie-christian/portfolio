import { useCallback } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './CustomNode.css';
import {
  CustomNode,
  MusicalDataNode,
  ProcessNode,
  MainOutputNode,
  VisualNode,
  UINode,
  VideoEncoderNode,
} from './nodes';
import initialNodes from './initialNodes';
import initialEdges from './initialEdges';

const nodeTypes = {
  custom: CustomNode,
  musicalData: MusicalDataNode,
  process: ProcessNode,
  mainOutput: MainOutputNode,
  visual: VisualNode,
  ui: UINode,
  videoEncoder: VideoEncoderNode,
};


const AudioVisualizerFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className='pointer-events-none mx-auto w-[350px] lg:w-[421px] lg:w-[400px] h-[750px]'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
      >
        <Background variant="dots" gap={12} size={0.6} />
      </ReactFlow>
    </div>
  );
};

export default AudioVisualizerFlow;
