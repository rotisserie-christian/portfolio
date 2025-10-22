const initialNodes = [
  {
    id: '1',
    position: { x: 50, y: 0 },
    data: { label: 'UI layer for musical sequence input' },
    draggable: false,
    type: 'ui',
  },
  {
    id: '3',
    position: { x: 50, y: 200 },
    data: { label: 'Musical sequence data' },
    draggable: false,
    type: 'musicalData',
  },
  {
    id: '4',
    position: { x: 300, y: 175 },
    data: { label: 'Callbacks for playback timing, tempo, and loop points' },
    draggable: false,
    type: 'custom',
  },
  {
    id: '5',
    position: { x: 50, y: 325 },
    data: { label: 'Builds and renders the musical sequence' },
    draggable: false,
    type: 'process',
  },
  {
    id: '7',
    position: { x: 50, y: 475 },
    data: { label: 'Main audio output' },
    draggable: false,
    type: 'mainOutput',
  },
  {
    id: '8',
    position: { x: 300, y: 475 },
    data: { label: 'Renders reactive visuals' },
    draggable: false,
    type: 'visual',
  },
  {
    id: '9',
    position: { x: 175, y: 650 },
    data: { label: 'Encodes video' },
    draggable: false,
    type: 'videoEncoder',
  },
];

export default initialNodes;
