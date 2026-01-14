const initialNodes = [
  {
    id: '1',
    position: { x: 175, y: 0 },
    data: { label: 'UI layer' },
    draggable: false,
    type: 'ui',
  },
  {
    id: '3',
    position: { x: 50, y: 200 },
    data: { label: 'Audio data' },
    draggable: false,
    type: 'musicalData',
  },
  {
    id: '4',
    position: { x: 300, y: 200 },
    data: { label: 'Hot reloading' },
    draggable: false,
    type: 'custom',
  },
  {
    id: '7',
    position: { x: 50, y: 350 },
    data: { label: 'Audio output' },
    draggable: false,
    type: 'mainOutput',
  },
  {
    id: '8',
    position: { x: 300, y: 350 },
    data: { label: 'Renders visuals' },
    draggable: false,
    type: 'visual',
  },
  {
    id: '9',
    position: { x: 175, y: 550 },
    data: { label: 'Encodes video' },
    draggable: false,
    type: 'videoEncoder',
  },
];

export default initialNodes;
