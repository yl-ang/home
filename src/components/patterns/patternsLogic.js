// Pure helpers for the Patterns page: no React, no DOM, easy to unit test.
export const ALL = "all";
export const STORAGE_KEY = "patterns.v1";

export const pad2 = (n) => String(n).padStart(2, "0");

export const filterByTopic = (patterns, topic) =>
  topic === ALL ? patterns : patterns.filter((p) => p.topic === topic);

export const countByTopic = (patterns, topics) => {
  const counts = { [ALL]: patterns.length };
  topics.forEach((t) => {
    counts[t] = patterns.filter((p) => p.topic === t).length;
  });
  return counts;
};

// Small seeded PRNG so a shuffle is stable across re-renders.
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const shuffle = (items, seed = 1) => {
  const rand = mulberry32(seed);
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const buildDeck = (patterns, { topic, shuffled, hideKnown, status, seed }) => {
  let deck = filterByTopic(patterns, topic);
  if (shuffled) deck = shuffle(deck, seed);
  if (hideKnown) deck = deck.filter((p) => status[p.id] !== "known");
  return deck;
};

export const progressFor = (patterns, topic, status) => {
  const pool = filterByTopic(patterns, topic);
  const known = pool.filter((p) => status[p.id] === "known").length;
  return { known, total: pool.length, pct: pool.length ? Math.round((known / pool.length) * 100) : 0 };
};

export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export const loadState = (storage) => {
  try {
    const raw = JSON.parse(storage.getItem(STORAGE_KEY));
    if (raw && typeof raw === "object") {
      return {
        topic: typeof raw.topic === "string" ? raw.topic : ALL,
        status: raw.status && typeof raw.status === "object" ? raw.status : {},
      };
    }
  } catch (e) {
    // storage unavailable or corrupt: fall through to defaults
  }
  return { topic: ALL, status: {} };
};

export const saveState = (storage, state) => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // private mode / quota: progress just lasts for the session
  }
};

const KEYWORDS = new Set([
  "def", "return", "for", "in", "while", "if", "elif", "else", "not", "and", "or", "is",
  "None", "True", "False", "class", "import", "from", "lambda", "continue", "break",
  "pass", "yield", "with", "as", "nonlocal", "global", "try", "except", "del",
]);

// Splits one line of Python into [{type, text}] with type: kw | num | com | txt.
export const tokenizeLine = (line) => {
  const tokens = [];
  const re = /(#.*$)|(\b\d+\b)|([A-Za-z_]\w*)/g;
  let last = 0;
  let m;
  const push = (type, text) => text && tokens.push({ type, text });
  while ((m = re.exec(line))) {
    push("txt", line.slice(last, m.index));
    if (m[1]) push("com", m[1]);
    else if (m[2]) push("num", m[2]);
    else push(KEYWORDS.has(m[3]) ? "kw" : "txt", m[3]);
    last = m.index + m[0].length;
  }
  push("txt", line.slice(last));
  return tokens;
};
