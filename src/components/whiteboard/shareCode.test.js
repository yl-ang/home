/** @jest-environment node */
import { CompressionStream, DecompressionStream } from "stream/web";
import {
  ShareCodeError,
  containsShareCode,
  crc32,
  exportShareText,
  importShareText,
  parseShareText,
  splitPayload,
  toMermaid,
} from "./shareCode";

// Jest's sandbox hides Node's stream globals; browsers provide these natively.
global.CompressionStream = CompressionStream;
global.DecompressionStream = DecompressionStream;

const el = (i, extra = {}) => ({
  id: `el-${i}`, type: "rectangle", x: i * 10.5, y: i * 3, width: 120, height: 60, strokeColor: "#1e1e1e",
  backgroundColor: "#a5d8ff", seed: 1000 + i, version: 3, versionNonce: 99 + i, isDeleted: false, ...extra,
});

// Pseudo-random text so deflate cannot shrink it away.
const noise = (n, seed = 1) => {
  let x = 12345 + seed * 7919;
  let out = "";
  for (let i = 0; i < n; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    out += String.fromCharCode(33 + (x % 90));
  }
  return out;
};

const smallScene = () => ({
  elements: [el(1), el(2, { type: "arrow", startBinding: { elementId: "el-1", focus: 0, gap: 4 }, endBinding: { elementId: "el-2", focus: 0, gap: 4 } }), el(3, { isDeleted: true })],
  appState: { viewBackgroundColor: "#fafafa", gridSize: 20, zoom: { value: 2 }, collaborators: new Map(), selectedElementIds: { a: true } },
  files: {},
});
const bigScene = () => ({ elements: Array.from({ length: 60 }, (_, i) => el(i, { customData: noise(200, i) })), appState: {}, files: {} });

const shuffle = (a) => [...a].sort((x, y) => crc32(x).localeCompare(crc32(y)));

describe("share code", () => {
  test("round trips a small scene in one part, dropping deleted elements and view state", async () => {
    const { text, count } = await exportShareText(smallScene());
    expect(count).toBe(1);
    expect(text.startsWith("EXWB1:")).toBe(true);
    expect(text).not.toMatch(/\s/);
    const back = await importShareText(text);
    expect(back.elements).toEqual(smallScene().elements.filter((e) => !e.isDeleted));
    expect(back.appState).toEqual({ viewBackgroundColor: "#fafafa", gridSize: 20 });
  });

  test("round trips a large scene across several parts, each within the line limit", async () => {
    const scene = bigScene();
    const { parts, text } = await exportShareText(scene);
    expect(parts.length).toBeGreaterThan(2);
    parts.forEach((p, i) => {
      expect(p.length).toBeLessThanOrEqual(1900);
      expect(p.startsWith(`EXWB1:${i + 1}/${parts.length}:`)).toBe(true);
    });
    expect((await importShareText(text)).elements).toEqual(scene.elements);
  });

  test("chunk boundary: exact fit stays one part, one extra char makes two", () => {
    const crc = crc32("x");
    const headerLen = `EXWB1:${crc}:`.length;
    const fits = "a".repeat(1900 - headerLen);
    expect(splitPayload(fits)).toHaveLength(1);
    expect(splitPayload(fits)[0]).toHaveLength(1900);
    const two = splitPayload(fits + "a");
    expect(two).toHaveLength(2);
    two.forEach((p) => expect(p.length).toBeLessThanOrEqual(1900));
    expect(splitPayload("a".repeat(5000), 100).every((p) => p.length <= 100)).toBe(true);
  });

  test("accepts parts in any order", async () => {
    const { parts } = await exportShareText(bigScene());
    const back = await importShareText(shuffle(parts).reverse().join("\n"));
    expect(back.elements).toHaveLength(60);
  });

  test("accepts messy Discord/Markdown pasting", async () => {
    const { parts } = await exportShareText(bigScene());
    const messy = [
      "here is my diagram!!",
      `> "${parts[1]}"`,
      "",
      "```",
      parts[0],
      "```",
      `   **sent** \`${parts.slice(2).join("`\n\n  `")}\`  thanks :)`,
    ].join("\n");
    expect((await importShareText(messy)).elements).toHaveLength(60);
  });

  test("accepts parts glued together without separators", async () => {
    const { parts } = await exportShareText(bigScene());
    expect((await importShareText(parts.join(""))).elements).toHaveLength(60);
  });

  test("reports missing parts", async () => {
    const { parts } = await exportShareText(bigScene());
    const r = parseShareText([parts[0], parts[2]].join("\n"));
    expect(r.ok).toBe(false);
    expect(r.error).toContain(`Have 2 of ${parts.length} parts`);
    expect(r.missing).toEqual(Array.from({ length: parts.length }, (_, i) => i + 1).filter((i) => i !== 1 && i !== 3));
    await expect(importShareText(parts[0])).rejects.toThrow(ShareCodeError);
  });

  test("detects a corrupted checksum / damaged data", async () => {
    const { text } = await exportShareText(smallScene());
    const flip = text.slice(0, -5) + (text.endsWith("A") ? "B" : "A") + text.slice(-4);
    const r = parseShareText(flip);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/checksum/i);
  });

  test("valid checksum but garbage data is reported as corrupt", async () => {
    const data = "AAAA";
    await expect(importShareText(`EXWB1:${crc32(data)}:${data}`)).rejects.toThrow(/corrupt/i);
  });

  test("rejects mixed exports, bad versions and non-codes", async () => {
    const a = (await exportShareText(bigScene())).parts;
    const b = (await exportShareText(smallScene())).parts;
    expect(parseShareText(`${a[0]}\n${b[0]}`).ok).toBe(false);
    expect(parseShareText("EXWB2:12345678:abc").error).toMatch(/version/i);
    expect(parseShareText("hello world").error).toMatch(/no share code/i);
    expect(containsShareCode("x EXWB1:abc")).toBe(true);
    expect(containsShareCode("plain text")).toBe(false);
  });

  test("keeps embedded files only for live image elements", async () => {
    const files = { f1: { id: "f1", dataURL: "data:image/png;base64,AAAA" }, f2: { id: "f2", dataURL: "x" } };
    const scene = { elements: [el(1, { type: "image", fileId: "f1" })], appState: {}, files };
    expect((await importShareText((await exportShareText(scene)).text)).files).toEqual({ f1: files.f1 });
  });
});

describe("toMermaid", () => {
  test("builds nodes and labelled edges, ignoring freehand and unbound arrows", () => {
    const text = (id, containerId, t) => el(id, { id, type: "text", containerId, text: t });
    const out = toMermaid([
      el(1, { id: "a" }), text("ta", "a", "Client"),
      el(2, { id: "b", type: "diamond" }), text("tb", "b", 'Say "hi"'),
      el(3, { id: "c", type: "ellipse" }),
      el(4, { id: "arr", type: "arrow", endArrowhead: "arrow", startBinding: { elementId: "a" }, endBinding: { elementId: "b" } }),
      text("tarr", "arr", "HTTP"),
      el(5, { type: "arrow", endArrowhead: "arrow", startBinding: null, endBinding: null }),
      el(6, { type: "freedraw" }),
    ]);
    expect(out.nodes).toBe(2);
    expect(out.edges).toBe(1);
    expect(out.text).toBe(['graph LR', '  n1["Client"]', '  n2{"Say #quot;hi#quot;"}', '  n1 -->|"HTTP"| n2'].join("\n"));
  });
});
