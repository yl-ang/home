// Pure Minesweeper rules. Cells are stored in flat arrays of length ROWS * COLS.
export const ROWS = 9;
export const COLS = 9;
export const MINES = 10;
const SIZE = ROWS * COLS;

// Cell states: "h" hidden, "r" revealed, "f" flagged.
export const newGame = () => ({
  status: "idle", // idle | playing | won | lost
  mines: null, // placed on the first reveal so it can never be a mine
  adj: null,
  st: Array(SIZE).fill("h"),
  lostAt: -1,
});

export const neighbours = (i) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const out = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      const nr = r + dr;
      const nc = c + dc;
      if ((dr || dc) && nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push(nr * COLS + nc);
    }
  }
  return out;
};

// Keeps the first click and its neighbours clear so the opening always cascades.
export const placeMines = (safe, rand = Math.random) => {
  const blocked = new Set([safe, ...neighbours(safe)]);
  const pool = [];
  for (let i = 0; i < SIZE; i += 1) if (!blocked.has(i)) pool.push(i);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const mines = Array(SIZE).fill(false);
  pool.slice(0, MINES).forEach((i) => {
    mines[i] = true;
  });
  const adj = mines.map((_, i) => neighbours(i).filter((n) => mines[n]).length);
  return { mines, adj };
};

export const reveal = (game, i, rand) => {
  if (game.status === "won" || game.status === "lost" || game.st[i] !== "h") return game;
  const next = { ...game, st: game.st.slice() };
  if (!next.mines) Object.assign(next, placeMines(i, rand));
  next.status = "playing";

  if (next.mines[i]) {
    next.st[i] = "r";
    next.status = "lost";
    next.lostAt = i;
    return next;
  }

  const queue = [i];
  next.st[i] = "r";
  while (queue.length) {
    const cur = queue.pop();
    if (next.adj[cur] === 0) {
      neighbours(cur).forEach((n) => {
        if (next.st[n] === "h") {
          next.st[n] = "r";
          queue.push(n);
        }
      });
    }
  }
  if (next.st.filter((s) => s === "r").length === SIZE - MINES) next.status = "won";
  return next;
};

export const toggleFlag = (game, i) => {
  if (game.status === "won" || game.status === "lost" || game.st[i] === "r") return game;
  const st = game.st.slice();
  st[i] = st[i] === "f" ? "h" : "f";
  return { ...game, st };
};

export const flagCount = (game) => game.st.filter((s) => s === "f").length;
