/* global CompressionStream, DecompressionStream */
// Share codes: a whiteboard scene as plain text that survives chat apps and notes.
//
//   EXWB1:<crc32>:<data>               one part
//   EXWB1:<i>/<n>:<crc32>:<data>       part i of n (every part repeats the checksum)
//
// <data> is base64url(deflate-raw(JSON)); <crc32> covers the full base64url payload,
// so it also catches parts that belong to different exports. No React/Excalidraw imports.

export const PREFIX = "EXWB";
export const VERSION = 1;
export const MAX_LINE = 1900; // Discord caps messages at 2000 characters.
const MAX_PARTS = 500;
const APP_STATE_KEYS = ["viewBackgroundColor", "gridSize", "gridStep", "gridModeEnabled"];

export class ShareCodeError extends Error {}

// ---- checksum + base64url -------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export const crc32 = (str) => {
  let c = 0xffffffff;
  for (let i = 0; i < str.length; i++) c = CRC_TABLE[(c ^ str.charCodeAt(i)) & 0xff] ^ (c >>> 8);
  return ((c ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
};

export const toBase64Url = (bytes) => {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const fromBase64Url = (str) => {
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

// ---- compression ----------------------------------------------------------

const pump = async (bytes, stream) => {
  const writer = stream.writable.getWriter();
  // Failures surface on the readable side below; these only avoid unhandled rejections.
  writer.write(bytes).catch(() => {});
  writer.close().catch(() => {});
  const reader = stream.readable.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
  }
  const out = new Uint8Array(size);
  let at = 0;
  chunks.forEach((c) => {
    out.set(c, at);
    at += c.length;
  });
  return out;
};

const deflate = (bytes) => {
  if (typeof CompressionStream === "undefined") throw new ShareCodeError("This browser cannot compress share codes.");
  return pump(bytes, new CompressionStream("deflate-raw"));
};

const inflate = (bytes) => {
  if (typeof DecompressionStream === "undefined") throw new ShareCodeError("This browser cannot read share codes.");
  return pump(bytes, new DecompressionStream("deflate-raw"));
};

// ---- scene <-> payload ----------------------------------------------------

export const packScene = ({ elements = [], appState = {}, files = {} }) => {
  const live = elements.filter((e) => !e.isDeleted);
  const used = new Set(live.map((e) => e.fileId).filter(Boolean));
  const packedFiles = {};
  Object.keys(files || {}).forEach((id) => {
    if (used.has(id)) packedFiles[id] = files[id];
  });
  const packedState = {};
  APP_STATE_KEYS.forEach((k) => {
    if (appState && appState[k] !== undefined) packedState[k] = appState[k];
  });
  return { v: VERSION, elements: live, appState: packedState, files: packedFiles };
};

export const encodePayload = async (scene) =>
  toBase64Url(await deflate(new TextEncoder().encode(JSON.stringify(packScene(scene)))));

const corrupt = (why) => new ShareCodeError(`The share code is corrupted (${why}).`);

export const decodePayload = async (payload) => {
  let json;
  try {
    json = new TextDecoder("utf-8", { fatal: true }).decode(await inflate(fromBase64Url(payload)));
  } catch (e) {
    if (e instanceof ShareCodeError) throw e;
    throw corrupt("could not decompress");
  }
  let scene;
  try {
    scene = JSON.parse(json);
  } catch (e) {
    throw corrupt("invalid JSON");
  }
  if (!scene || scene.v !== VERSION) throw new ShareCodeError("Unsupported scene version in share code.");
  if (!Array.isArray(scene.elements) || !scene.elements.every((e) => e && typeof e.id === "string" && typeof e.type === "string")) {
    throw corrupt("bad elements");
  }
  return { elements: scene.elements, appState: scene.appState || {}, files: scene.files || {} };
};

// ---- chunking -------------------------------------------------------------

const header = (i, n, crc) => `${PREFIX}${VERSION}:${n > 1 ? `${i}/${n}:` : ""}${crc}:`;

export const splitPayload = (payload, maxLine = MAX_LINE) => {
  const crc = crc32(payload);
  let n = 1;
  for (;;) {
    // Header width depends on the digit count of n, so iterate until n stops growing.
    const room = maxLine - header(n, n, crc).length;
    const needed = Math.max(1, Math.ceil(payload.length / room));
    if (needed <= n) break;
    n = needed;
  }
  const room = maxLine - header(n, n, crc).length;
  const parts = [];
  for (let i = 0; i < n; i++) parts.push(header(i + 1, n, crc) + payload.slice(i * room, (i + 1) * room));
  return parts;
};

export const exportShareText = async (scene, maxLine = MAX_LINE) => {
  const parts = splitPayload(await encodePayload(scene), maxLine);
  const text = parts.join("\n\n");
  return { text, parts, count: parts.length, chars: text.length };
};

// ---- parsing --------------------------------------------------------------

export const containsShareCode = (text) => new RegExp(`${PREFIX}\\d+:`).test(text || "");

// Lenient: ignores anything around a part (quotes, code fences, chat text) and any order.
const PART_RE = new RegExp(
  `${PREFIX}(\\d+):(?:(\\d+)/(\\d+):)?([0-9a-f]{8}):([A-Za-z0-9_-]+?)(?=${PREFIX}\\d+:|[^A-Za-z0-9_-]|$)`,
  "g"
);

export const parseShareText = (text) => {
  const found = [...String(text || "").matchAll(PART_RE)];
  if (found.length === 0) {
    return {
      ok: false,
      error: containsShareCode(text) ? "The share code header is damaged or cut off." : "No share code found (expected text starting with EXWB1:).",
    };
  }
  const parts = new Map();
  let total = null;
  let crc = null;
  for (const m of found) {
    const [, version, idx, tot, partCrc, data] = m;
    if (Number(version) !== VERSION) {
      return { ok: false, error: `Unsupported share code version ${PREFIX}${version}. This site reads ${PREFIX}${VERSION}.` };
    }
    const index = idx ? Number(idx) : 1;
    const count = tot ? Number(tot) : 1;
    if (count < 1 || count > MAX_PARTS || index < 1 || index > count) {
      return { ok: false, error: `Invalid part number ${index}/${count}.` };
    }
    if (total === null) {
      total = count;
      crc = partCrc;
    } else if (count !== total || partCrc !== crc) {
      return { ok: false, error: "These parts come from different exports. Paste the parts of one export only." };
    }
    if (parts.has(index) && parts.get(index) !== data) {
      return { ok: false, error: `Part ${index} appears twice with different content.` };
    }
    parts.set(index, data);
  }
  const missing = [];
  for (let i = 1; i <= total; i++) if (!parts.has(i)) missing.push(i);
  const base = { total, have: parts.size, missing, crc };
  if (missing.length > 0) {
    const list = missing.length > 8 ? `${missing.slice(0, 8).join(", ")}...` : missing.join(", ");
    return { ok: false, ...base, error: `Have ${parts.size} of ${total} parts. Missing part${missing.length > 1 ? "s" : ""} ${list}.` };
  }
  const payload = Array.from({ length: total }, (_, i) => parts.get(i + 1)).join("");
  if (crc32(payload) !== crc) {
    return { ok: false, ...base, error: "Checksum mismatch: the code was altered or damaged (a part may be truncated or edited)." };
  }
  return { ok: true, ...base, payload };
};

export const importShareText = async (text) => {
  const parsed = parseShareText(text);
  if (!parsed.ok) throw new ShareCodeError(parsed.error);
  return { ...(await decodePayload(parsed.payload)), parts: parsed.total };
};

// ---- Mermaid (one-way, lossy) ---------------------------------------------

const SHAPES = new Set(["rectangle", "ellipse", "diamond"]);
const quote = (s) => `"${s.replace(/"/g, "#quot;").replace(/\r?\n/g, "<br/>")}"`;

export const toMermaid = (elements) => {
  const live = elements.filter((e) => !e.isDeleted);
  const labels = new Map();
  live.forEach((e) => {
    if (e.type === "text" && e.containerId) labels.set(e.containerId, (e.text || "").trim());
  });
  const shapes = live.filter((e) => SHAPES.has(e.type));
  const arrows = live.filter((e) => e.type === "arrow" && e.startBinding && e.endBinding);
  const shapeIds = new Set(shapes.map((s) => s.id));
  const edges = arrows.filter((a) => shapeIds.has(a.startBinding.elementId) && shapeIds.has(a.endBinding.elementId));
  const connected = new Set(edges.flatMap((a) => [a.startBinding.elementId, a.endBinding.elementId]));
  const nodes = shapes.filter((s) => labels.get(s.id) || connected.has(s.id));
  const names = new Map(nodes.map((s, i) => [s.id, `n${i + 1}`]));

  const lines = ["graph LR"];
  nodes.forEach((s) => {
    const label = quote(labels.get(s.id) || " ");
    const n = names.get(s.id);
    lines.push(`  ${n}${s.type === "diamond" ? `{${label}}` : s.type === "ellipse" ? `([${label}])` : `[${label}]`}`);
  });
  edges.forEach((a) => {
    const from = names.get(a.startBinding.elementId);
    const to = names.get(a.endBinding.elementId);
    const both = a.startArrowhead && a.endArrowhead;
    const link = both ? "<-->" : a.startArrowhead || a.endArrowhead ? "-->" : "---";
    const [src, dst] = a.startArrowhead && !a.endArrowhead ? [to, from] : [from, to];
    const label = labels.get(a.id);
    lines.push(`  ${src} ${link}${label ? `|${quote(label)}|` : ""} ${dst}`);
  });
  return { text: lines.join("\n"), nodes: nodes.length, edges: edges.length };
};
