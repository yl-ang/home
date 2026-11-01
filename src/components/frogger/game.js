// Pure Frogger rules. Positions are in grid cells; x is the left edge of a
// sprite and may be fractional (lanes move continuously). Rows count from the top.
export const COLS = 13;
export const ROWS = 12;
export const GOAL_ROW = 0;
export const RIVER_ROWS = [1, 5]; // inclusive
export const MEDIAN_ROW = 6;
export const ROAD_ROWS = [7, 10]; // inclusive
export const START_ROW = 11;
export const HOME_COLS = [1, 4, 6, 8, 11];
export const LIVES = 3;
export const TIME_LIMIT = 30; // seconds per attempt
export const DEATH_TIME = 0.8;
export const CLEAR_TIME = 1.6;

// Objects wrap around a track a little wider than the board so the widest one fits off-screen.
const SPAN = COLS + 4;

export const rowKind = (row) => {
  if (row === GOAL_ROW) return "goal";
  if (row >= RIVER_ROWS[0] && row <= RIVER_ROWS[1]) return "river";
  if (row === MEDIAN_ROW) return "median";
  if (row >= ROAD_ROWS[0] && row <= ROAD_ROWS[1]) return "road";
  return "start";
};

// dir: 1 moves right, -1 left. speed is cells/second at level 1.
// dive: turtles sink for `down` seconds out of every `period`.
const LANE_DEFS = [
  { row: 1, kind: "log", w: 3, n: 3, dir: 1, speed: 0.9, off: 1 },
  { row: 2, kind: "turtle", w: 3, n: 3, dir: -1, speed: 1.4, off: 4, dive: { period: 7, down: 1.8 } },
  { row: 3, kind: "log", w: 4, n: 3, dir: 1, speed: 1.9, off: 0 },
  { row: 4, kind: "log", w: 3, n: 3, dir: 1, speed: 1.3, off: 2 },
  { row: 5, kind: "turtle", w: 2, n: 4, dir: -1, speed: 1.1, off: 3, dive: { period: 9, down: 1.6 } },
  { row: 7, kind: "car", w: 1, n: 3, dir: -1, speed: 1.6, off: 2, style: 0 },
  { row: 8, kind: "truck", w: 2, n: 2, dir: 1, speed: 1.2, off: 5, style: 1 },
  { row: 9, kind: "car", w: 1, n: 4, dir: -1, speed: 2.4, off: 1, style: 2 },
  { row: 10, kind: "car", w: 1, n: 3, dir: 1, speed: 1.5, off: 0, style: 3 },
];

const wrapX = (x) => ((((x + 4) % SPAN) + SPAN) % SPAN) - 4;

const buildLanes = () =>
  LANE_DEFS.map((d) => ({
    ...d,
    xs: Array.from({ length: d.n }, (_, i) => wrapX(d.off + (i * SPAN) / d.n)),
  }));

export const speedMult = (level) => Math.min(2.5, 1 + 0.15 * (level - 1));

const startFrog = () => ({ x: Math.floor(COLS / 2), row: START_ROW, face: "up" });

export const newGame = () => ({
  status: "playing", // playing | over
  level: 1,
  score: 0,
  lives: LIVES,
  homes: [], // filled HOME_COLS
  lanes: buildLanes(),
  frog: startFrog(),
  bestRow: START_ROW,
  timeLeft: TIME_LIMIT,
  time: 0, // world clock, drives turtle diving
  dying: 0, // seconds left on the death pause
  clear: 0, // seconds left on the level-clear pause
  cause: null, // why the last life was lost
});

// 'up' | 'warn' | 'down' for a turtle; always 'up' for anything that can't dive.
export const diveState = (lane, i, time) => {
  if (!lane.dive) return "up";
  const { period, down } = lane.dive;
  const t = (time + i * (period / lane.n) * 0.7) % period;
  if (t >= period - down) return "down";
  if (t >= period - down - 0.8) return "warn";
  return "up";
};

const laneAt = (state, row) => state.lanes.find((l) => l.row === row);

// Index of the log/turtle under the frog's centre, or -1.
export const supportIndex = (state) => {
  const lane = laneAt(state, state.frog.row);
  if (!lane || rowKind(lane.row) !== "river") return -1;
  const c = state.frog.x + 0.5;
  return lane.xs.findIndex(
    (x, i) => c >= x + 0.05 && c <= x + lane.w - 0.05 && diveState(lane, i, state.time) !== "down"
  );
};

const hitsVehicle = (state) => {
  const lane = laneAt(state, state.frog.row);
  if (!lane || rowKind(lane.row) !== "road") return false;
  const l = state.frog.x + 0.15;
  const r = state.frog.x + 0.85;
  return lane.xs.some((x) => r > x + 0.05 && l < x + lane.w - 0.05);
};

const respawn = (state) => ({
  ...state,
  frog: startFrog(),
  bestRow: START_ROW,
  timeLeft: TIME_LIMIT,
  dying: 0,
  cause: null,
});

const die = (state, cause) => ({ ...state, lives: state.lives - 1, dying: DEATH_TIME, cause });

// Applies the consequences of wherever the frog now stands.
export const resolve = (state) => {
  if (state.status !== "playing" || state.dying > 0 || state.clear > 0) return state;
  const { frog } = state;
  switch (rowKind(frog.row)) {
    case "goal": {
      const col = Math.round(frog.x);
      if (!HOME_COLS.includes(col)) return die({ ...state, frog: { ...frog, x: col } }, "hedge");
      if (state.homes.includes(col)) return die({ ...state, frog: { ...frog, x: col } }, "occupied");
      const homes = [...state.homes, col];
      const score = state.score + 50 + 10 * Math.ceil(state.timeLeft);
      if (homes.length === HOME_COLS.length) {
        return { ...state, homes, score: score + 100 * state.level, clear: CLEAR_TIME, cause: null };
      }
      return respawn({ ...state, homes, score });
    }
    case "river": {
      const c = frog.x + 0.5;
      if (c < 0 || c > COLS) return die(state, "swept");
      return supportIndex(state) < 0 ? die(state, "water") : state;
    }
    case "road":
      return hitsVehicle(state) ? die(state, "car") : state;
    default:
      return state;
  }
};

const STEPS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export const hop = (state, dir) => {
  if (state.status !== "playing" || state.dying > 0 || state.clear > 0) return state;
  const [dx, dy] = STEPS[dir];
  const { frog } = state;
  const row = Math.min(START_ROW, Math.max(GOAL_ROW, frog.row + dy));
  let x = Math.min(COLS - 1, Math.max(0, frog.x + dx));
  if (row === frog.row && x === frog.x) return { ...state, frog: { ...frog, face: dir } };
  // Only the river lets x stay fractional (riding a log); land on a cell everywhere else.
  if (rowKind(row) !== "river") x = Math.round(x);
  let score = state.score;
  let bestRow = state.bestRow;
  if (row < bestRow) {
    score += 10;
    bestRow = row;
  }
  return resolve({ ...state, score, bestRow, frog: { x, row, face: dir } });
};

const nextLevel = (state) => {
  const level = state.level + 1;
  return { ...respawn(state), level, homes: [], clear: 0, lanes: buildLanes(), time: 0, cause: null };
};

// Advances the world by dt seconds.
export const step = (state, dt) => {
  if (state.status !== "playing") return state;
  const mult = speedMult(state.level);
  const lanes = state.lanes.map((lane) => {
    const dx = lane.dir * lane.speed * mult * dt;
    return {
      ...lane,
      xs: lane.xs.map((x) => {
        const nx = x + dx;
        if (lane.dir > 0 && nx >= COLS) return nx - SPAN;
        if (lane.dir < 0 && nx + lane.w <= 0) return nx + SPAN;
        return nx;
      }),
    };
  });
  let next = { ...state, lanes, time: state.time + dt };

  if (state.clear > 0) {
    const clear = state.clear - dt;
    return clear > 0 ? { ...next, clear } : nextLevel(next);
  }
  if (state.dying > 0) {
    const dying = state.dying - dt;
    if (dying > 0) return { ...next, dying };
    return next.lives <= 0 ? { ...next, dying: 0, status: "over" } : respawn(next);
  }

  // Alive: a log or turtle carries the frog with it.
  const lane = laneAt(state, state.frog.row);
  if (lane && rowKind(lane.row) === "river" && supportIndex(state) >= 0) {
    next = { ...next, frog: { ...state.frog, x: state.frog.x + lane.dir * lane.speed * mult * dt } };
  }
  const timeLeft = state.timeLeft - dt;
  next = { ...next, timeLeft: Math.max(0, timeLeft) };
  return timeLeft <= 0 ? die(next, "time") : resolve(next);
};
