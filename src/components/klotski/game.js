export const ROWS = 5;
export const COLS = 4;
// The 2x2 block wins by sitting at this top-left cell (bottom-centre exit).
export const EXIT = { r: 3, c: 1 };

export const DIRS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

// "Heng Dao Li Ma": r / c is the piece's top-left cell, w x h its size in cells.
export const initialPieces = () => [
  { id: "cao", name: "Cao Cao", glyph: "曹", r: 0, c: 1, w: 2, h: 2 },
  { id: "zhangfei", name: "Zhang Fei", glyph: "张", r: 0, c: 0, w: 1, h: 2 },
  { id: "zhaoyun", name: "Zhao Yun", glyph: "赵", r: 0, c: 3, w: 1, h: 2 },
  { id: "machao", name: "Ma Chao", glyph: "马", r: 2, c: 0, w: 1, h: 2 },
  { id: "huangzhong", name: "Huang Zhong", glyph: "黄", r: 2, c: 3, w: 1, h: 2 },
  { id: "guanyu", name: "Guan Yu", glyph: "关", r: 2, c: 1, w: 2, h: 1 },
  { id: "soldier1", name: "soldier", glyph: "兵", r: 3, c: 1, w: 1, h: 1 },
  { id: "soldier2", name: "soldier", glyph: "兵", r: 3, c: 2, w: 1, h: 1 },
  { id: "soldier3", name: "soldier", glyph: "兵", r: 4, c: 0, w: 1, h: 1 },
  { id: "soldier4", name: "soldier", glyph: "兵", r: 4, c: 3, w: 1, h: 1 },
];

// Returns the piece moved one cell in `dir`, or null if a wall or piece is in the way.
export const movePiece = (pieces, id, dir) => {
  const delta = DIRS[dir];
  const piece = pieces.find((p) => p.id === id);
  if (!delta || !piece) return null;
  const moved = { ...piece, r: piece.r + delta[0], c: piece.c + delta[1] };
  if (moved.r < 0 || moved.c < 0 || moved.r + moved.h > ROWS || moved.c + moved.w > COLS) return null;
  const hits = pieces.some(
    (p) =>
      p.id !== id &&
      p.r < moved.r + moved.h &&
      moved.r < p.r + p.h &&
      p.c < moved.c + moved.w &&
      moved.c < p.c + p.w
  );
  return hits ? null : pieces.map((p) => (p.id === id ? moved : p));
};

export const canMove = (pieces, id, dir) => movePiece(pieces, id, dir) !== null;

export const isWon = (pieces) => {
  const cao = pieces.find((p) => p.id === "cao");
  return cao.r === EXIT.r && cao.c === EXIT.c;
};

// Pieces of the same shape are interchangeable, so they share one state key.
const stateKey = (pieces) =>
  pieces
    .map((p) => `${p.id === "cao" ? "X" : `${p.w}${p.h}`}${p.r}${p.c}`)
    .sort()
    .join("|");

// Breadth-first search from `start`: the shortest list of { id, dir } steps to a win,
// [] if already won, or null if unsolvable.
export const solve = (start) => {
  if (isWon(start)) return [];
  const seen = new Set([stateKey(start)]);
  const queue = [{ pieces: start, parent: null, move: null }];
  for (let i = 0; i < queue.length; i += 1) {
    const node = queue[i];
    for (const p of node.pieces) {
      for (const dir of Object.keys(DIRS)) {
        const pieces = movePiece(node.pieces, p.id, dir);
        if (!pieces) continue;
        const key = stateKey(pieces);
        if (seen.has(key)) continue;
        seen.add(key);
        const next = { pieces, parent: node, move: { id: p.id, dir } };
        if (isWon(pieces)) {
          const path = [];
          for (let n = next; n.parent; n = n.parent) path.unshift(n.move);
          return path;
        }
        queue.push(next);
      }
    }
  }
  return null;
};
