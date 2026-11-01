import {
  COLS, START_ROW, HOME_COLS, newGame, hop, step, resolve, supportIndex, LIVES, DEATH_TIME,
} from "./game";

const lane = (s, row) => s.lanes.find((l) => l.row === row);
const withLane = (s, row, xs) => ({ ...s, lanes: s.lanes.map((l) => (l.row === row ? { ...l, xs } : l)) });
const at = (s, x, row) => ({ ...s, frog: { x, row, face: "up" } });

test("hopping moves one cell and clamps to the board", () => {
  let s = newGame();
  s = hop(s, "left");
  expect(s.frog.x).toBe(5);
  for (let i = 0; i < 20; i += 1) s = hop(s, "left");
  expect(s.frog.x).toBe(0);
  expect(hop(newGame(), "down").frog.row).toBe(START_ROW);
});

test("a vehicle hit costs a life, a clear lane does not", () => {
  const s = at(withLane(newGame(), 10, [6]), 6, 11);
  expect(hop(s, "up").lives).toBe(LIVES - 1);
  const safe = at(withLane(newGame(), 10, [0]), 6, 11);
  expect(hop(safe, "up").lives).toBe(LIVES);
});

test("water kills, a log carries the frog", () => {
  const water = at(withLane(newGame(), 5, [-4, -4, -4, -4]), 6, 6);
  expect(hop(water, "up").cause).toBe("water");
  const L = lane(newGame(), 4);
  let s = at(withLane(newGame(), 4, [5, 20, 20]), 6, 5);
  s = withLane(s, 5, [5, 20, 20, 20]);
  s = hop(at(s, 6, 5), "up");
  expect(s.lives).toBe(LIVES);
  expect(supportIndex(s)).toBe(0);
  const x0 = s.frog.x;
  s = step(s, 0.5);
  expect(s.frog.x).toBeCloseTo(x0 + L.dir * L.speed * 0.5, 5);
});

test("being carried off-screen loses a life", () => {
  let s = at(withLane(newGame(), 4, [10]), 12, 4);
  s = step(s, 2);
  expect(s.lives).toBe(LIVES - 1);
  expect(s.cause).toBe("swept");
});

test("home slots score once; occupied and hedge cost a life", () => {
  const base = withLane(newGame(), 1, [HOME_COLS[0] - 1, 30, 30]);
  let s = hop(at(base, HOME_COLS[0], 1), "up");
  expect(s.homes).toEqual([HOME_COLS[0]]);
  expect(s.score).toBeGreaterThan(0);
  expect(s.frog.row).toBe(START_ROW);
  s = hop(at(withLane(s, 1, [HOME_COLS[0] - 1, 30, 30]), HOME_COLS[0], 1), "up");
  expect(s.cause).toBe("occupied");
  s = hop(at(withLane(newGame(), 1, [2, 30, 30]), 2, 1), "up");
  expect(s.cause).toBe("hedge");
});

test("filling every slot clears the level and the next is faster", () => {
  let s = { ...newGame(), homes: HOME_COLS.slice(1) };
  s = hop(at(withLane(s, 1, [HOME_COLS[0] - 1, 30, 30]), HOME_COLS[0], 1), "up");
  expect(s.clear).toBeGreaterThan(0);
  s = step(s, 5);
  expect(s.level).toBe(2);
  expect(s.homes).toEqual([]);
});

test("timeout and game over", () => {
  let s = { ...newGame(), lives: 1, timeLeft: 0.01 };
  s = step(s, 0.05);
  expect(s.cause).toBe("time");
  s = step(s, DEATH_TIME + 0.1);
  expect(s.status).toBe("over");
  expect(COLS).toBe(13);
  expect(resolve(s)).toBe(s);
});
