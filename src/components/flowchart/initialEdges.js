const initialEdges = [
  // UI layer source bottom to callbacks and musical data target top for both
  {
    id: 'e-ui-hot-reloading',
    source: '1',
    target: '4',
    animated: true,
  },
  {
    id: 'e-ui-musical',
    source: '1',
    sourceHandle: 'bottom',
    target: '3',
    targetHandle: 'top',
    animated: true,
    type: 'smoothstep',
  },

  // hot reloading source left to musical data target right
  {
    id: 'e-hot-reloading-musical',
    source: '4',
    sourceHandle: 'left',
    target: '3',
    targetHandle: 'right',
    animated: true,
    type: 'smoothstep',
  },

  {
    id: 'e-hot-reloading-visual',
    source: '4',
    sourceHandle: 'bottom',
    target: '8',
    targetHandle: 'top',
    animated: true,
    type: 'smoothstep',
  },


  // musical data source bottom to builds and renders target top
  {
    id: 'e-musical-process',
    source: '3',
    sourceHandle: 'bottom',
    target: '5',
    targetHandle: 'top',
    animated: true,
    type: 'smoothstep',
  },

  // builds and renders source bottom to main output target top
  {
    id: 'e-process-main',
    source: '5',
    sourceHandle: 'bottom',
    target: '7',
    targetHandle: 'top',
    animated: true,
    type: 'smoothstep',
  },

  // main output source right to renders visual target left
  {
    id: 'e-main-visual',
    source: '7',
    sourceHandle: 'right',
    target: '8',
    targetHandle: 'left',
    animated: true,
    type: 'smoothstep',
  },

  // main output and visual both to video encoder
  {
    id: 'e-main-encoder',
    source: '7',
    sourceHandle: 'bottom',
    target: '9',
    targetHandle: 'top',
    animated: true,
  },
  {
    id: 'e-visual-encoder',
    source: '8',
    target: '9',
    animated: true,
  },
];

export default initialEdges;
