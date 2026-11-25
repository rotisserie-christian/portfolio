/**
 * Camera path for the lattice. It flies straight through the grid, and at
 * some junctions turns 90 degrees — left, right, up, or down — then
 * continues. The turn is chosen from a fixed hash so a replay of the same
 * clock follows the same halls.
 */

const hash01 = (n) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

const blendPerp = (a, b, t) => {
  const angle = t * Math.PI * 0.5;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    a[0] * c + b[0] * s,
    a[1] * c + b[1] * s,
    a[2] * c + b[2] * s,
  ];
};

const copy3 = (out, v) => {
  out[0] = v[0];
  out[1] = v[1];
  out[2] = v[2];
};

const wrapToCell = (pos, spacing) => {
  for (let i = 0; i < 3; i++) {
    pos[i] -= Math.round(pos[i] / spacing) * spacing;
  }
};

export const createLatticePath = () => {
  const pos = [0, 0, 0];
  const forward = [0, 0, 1];
  const up = [0, 1, 0];
  const turnFromF = [0, 0, 1];
  const turnToF = [1, 0, 0];
  const turnFromU = [0, 1, 0];
  const turnToU = [0, 1, 0];
  let spacing = 1.7;
  let runLeft = 0;
  let turnLeft = 0;
  let turnSpan = 1;
  let turnIndex = 1;
  let phase = 'straight';
  let ready = false;

  const beginStraight = (cells) => {
    runLeft = cells * spacing;
    phase = 'straight';
  };

  const beginTurn = () => {
    const right = cross(up, forward);
    const options = [
      { f: right, u: [up[0], up[1], up[2]] },
      { f: [-right[0], -right[1], -right[2]], u: [up[0], up[1], up[2]] },
      { f: [up[0], up[1], up[2]], u: [-forward[0], -forward[1], -forward[2]] },
      { f: [-up[0], -up[1], -up[2]], u: [forward[0], forward[1], forward[2]] },
    ];
    const pick = options[Math.floor(hash01(turnIndex + 8.2) * 4) % 4];
    copy3(turnFromF, forward);
    copy3(turnToF, pick.f);
    copy3(turnFromU, up);
    copy3(turnToU, pick.u);
    turnSpan = Math.max(spacing * 0.45, 0.4);
    turnLeft = turnSpan;
    phase = 'turn';
  };

  const arriveAtJunction = () => {
    const cells = 3 + Math.floor(hash01(turnIndex + 3.7) * 4);
    const takeTurn = hash01(turnIndex + 19.1) > 0.42;
    turnIndex += 1;
    if (takeTurn) beginTurn();
    else beginStraight(cells);
  };

  return {
    pos,
    forward,
    up,
    get phase() {
      return phase;
    },
    reset() {
      pos[0] = 0;
      pos[1] = 0;
      pos[2] = 0;
      forward[0] = 0;
      forward[1] = 0;
      forward[2] = 1;
      up[0] = 0;
      up[1] = 1;
      up[2] = 0;
      runLeft = 0;
      turnLeft = 0;
      turnIndex = 1;
      phase = 'straight';
      ready = false;
    },
    advance(distance, nextSpacing) {
      spacing = Math.max(nextSpacing || spacing, 0.9);
      if (!ready) {
        pos[2] = spacing * 0.5;
        beginStraight(4);
        ready = true;
      }
      let left = Math.max(distance, 0);
      let guard = 0;
      while (left > 1e-6 && guard < 256) {
        guard += 1;
        if (phase === 'straight') {
          const step = Math.min(left, runLeft);
          pos[0] += forward[0] * step;
          pos[1] += forward[1] * step;
          pos[2] += forward[2] * step;
          runLeft -= step;
          left -= step;
          if (runLeft <= 1e-5) arriveAtJunction();
        } else {
          const step = Math.min(left, turnLeft);
          turnLeft -= step;
          left -= step;
          const t = 1 - turnLeft / turnSpan;
          copy3(forward, blendPerp(turnFromF, turnToF, t));
          const upDot = turnFromU[0] * turnToU[0] + turnFromU[1] * turnToU[1] + turnFromU[2] * turnToU[2];
          if (upDot > 0.99) copy3(up, turnFromU);
          else copy3(up, blendPerp(turnFromU, turnToU, t));
          if (turnLeft <= 1e-5) {
            copy3(forward, turnToF);
            copy3(up, turnToU);
            beginStraight(3 + Math.floor(hash01(turnIndex + 3.7) * 4));
            turnIndex += 1;
          }
        }
      }
      wrapToCell(pos, spacing);
    },
  };
};
