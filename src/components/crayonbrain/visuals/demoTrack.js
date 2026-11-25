export const DEMO_TRACK_FILE_NAME = 'Demo track';
/** 16th-note grid. 64 steps is four bars, which is 8 seconds at this tempo. */
export const DEMO_TRACK_BPM = 120;
export const DEMO_TRACK_STEPS = 64;
export const DEMO_TRACK_STEPS_PER_BAR = 16;

const row = (hits) => {
  const steps = Array(DEMO_TRACK_STEPS).fill(false);
  hits.forEach((hit) => {
    steps[hit] = true;
  });
  return steps;
};

const span = (start, end, stride = 1) => {
  const hits = [];
  for (let step = start; step < end; step += stride) hits.push(step);
  return hits;
};

/**
 * Four bars of the drum samples in src/assets:
 * hats open the build, a snare roll runs into the drop, then the beat
 * sits under the jingle.
 */
export const DEMO_DRUM_SEQUENCE = [
  {
    id: 'kick',
    steps: row([32, 36, 40, 44, 48, 56]),
  },
  {
    id: 'snare',
    steps: row([36, 44, 52, 60]),
  },
  {
    id: 'snare2',
    steps: row([16, 20, 24, 26, 28, 29, 30, 31]),
  },
  {
    id: 'hat',
    steps: row([
      0, 4, 8, 10, 12, 14, 15,
      ...span(16, 32),
      ...span(32, 48, 2),
      ...span(48, 64, 2),
    ]),
  },
  {
    id: 'hat2',
    steps: row([30, 38, 46, 54, 62]),
  },
];

const note = (step, pitch, duration = 2) => ({ step, pitch, duration });

/** Lead id is a synth preset so the sequencer triggers it with the drums. */
export const DEMO_LEAD_ID = 'lead-demo';

/**
 * A major-key sting. The chord hits with the drop, then the last bar
 * is the jingle.
 */
export const DEMO_MELODY = {
  [DEMO_LEAD_ID]: [
    note(32, 'C4', 3),
    note(32, 'E4', 3),
    note(32, 'G4', 3),
    note(32, 'C5', 3),
    note(48, 'C5'),
    note(48, 'G4'),
    note(50, 'E5'),
    note(52, 'G5'),
    note(52, 'D5'),
    note(54, 'C6'),
    note(56, 'A5', 1),
    note(57, 'G5', 1),
    note(58, 'E5'),
    note(58, 'C5'),
    note(60, 'G5', 1),
    note(61, 'E5', 1),
    note(62, 'C5'),
    note(62, 'G4'),
  ],
};

