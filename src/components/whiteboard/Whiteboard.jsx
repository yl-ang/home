import "./excalidrawAssets";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CaptureUpdateAction,
  Excalidraw,
  convertToExcalidrawElements,
  exportToBlob,
  exportToSvg,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { BLANK, BLANK_ID, TEMPLATE_OPTIONS } from "./templates";
import { copyText } from "./clipboard";
import { CopyFallbackDialog, ImportDialog } from "./ShareDialogs";
import { containsShareCode, exportShareText, toMermaid } from "./shareCode";
import "./Whiteboard.css";

const STORAGE_KEY = "wb-blank-scene-v1";
const NOTES_KEY = "wb-notes-v1";
const DEFAULT_TEMPLATE = "url-shortener";
const SAVE_DELAY_MS = 500;
const UI_OPTIONS = {
  canvasActions: { loadScene: false, saveToActiveFile: false, export: false, saveAsImage: false },
};

const byId = (id) => TEMPLATE_OPTIONS.find((t) => t.id === id) || BLANK;
const signature = (elements) => elements.map((e) => `${e.id}:${e.version}`).join("|");
const viewState = (s) => ({
  viewBackgroundColor: s.viewBackgroundColor,
  scrollX: s.scrollX,
  scrollY: s.scrollY,
  zoom: s.zoom,
});

// Text is measured when skeletons are converted, so the hand-drawn font must be loaded first.
const buildElements = async (id) => {
  try {
    await document.fonts.load("18px Excalifont", "Aa");
  } catch (e) {
    // Fall back to whatever font is available.
  }
  return convertToExcalidrawElements(byId(id).scene);
};

const readBlank = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.elements)) return saved;
  } catch (e) {
    // Storage unavailable or corrupt: fall back to an empty canvas.
  }
  return null;
};

const writeBlank = (elements, appState) => {
  try {
    if (elements.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements, appState: viewState(appState) }));
  } catch (e) {
    // Quota or privacy mode: persistence is a convenience only.
  }
};

const readNotes = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTES_KEY));
    if (saved && typeof saved === "object") return saved;
  } catch (e) {
    // Storage unavailable or corrupt: start with no notes.
  }
  return {};
};

const writeNotes = (notes) => {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    // Quota or privacy mode: notes just won't persist.
  }
};

const download = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Whiteboard = () => {
  const [api, setApi] = useState(null);
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE);
  const [backup, setBackup] = useState(null);
  const [status, setStatus] = useState("");
  const [large, setLarge] = useState(false);
  const [notes, setNotes] = useState(readNotes);
  const [dialog, setDialog] = useState(null); // { type: "import" | "copy", text }

  const templateRef = useRef(DEFAULT_TEMPLATE);
  const loadedSig = useRef("");
  const pendingSave = useRef(null);
  const saveTimer = useRef(null);
  const notesTimer = useRef(null);
  const notesRef = useRef(notes);
  const canvasRef = useRef(null);

  const template = byId(templateId);

  const flushSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    if (pendingSave.current) {
      writeBlank(pendingSave.current.elements, pendingSave.current.appState);
      pendingSave.current = null;
    }
  }, []);

  const loadScene = useCallback(
    (elements, appState = {}, { fit = true } = {}) => {
      api.updateScene({
        elements,
        appState: { viewBackgroundColor: "#ffffff", ...appState },
        captureUpdate: CaptureUpdateAction.NEVER,
      });
      api.history.clear();
      loadedSig.current = signature(api.getSceneElements());
      if (fit && elements.length > 0) {
        // Let the new elements mount before measuring the viewport.
        requestAnimationFrame(() =>
          api.scrollToContent(api.getSceneElements(), { fitToViewport: true, viewportZoomFactor: 0.74 })
        );
      }
    },
    [api]
  );

  const loadTemplate = useCallback(
    async (id) => {
      templateRef.current = id;
      if (id === BLANK_ID) {
        const saved = readBlank();
        loadScene(saved ? saved.elements : [], saved ? saved.appState : {}, { fit: !saved });
        return;
      }
      const elements = await buildElements(id);
      // Ignore the result if the user picked something else while fonts loaded.
      if (templateRef.current === id) loadScene(elements);
    },
    [loadScene]
  );

  useEffect(() => {
    // Excalidraw registers its fonts on mount, so the first scene is built once the API exists.
    if (api) loadTemplate(DEFAULT_TEMPLATE);
  }, [api, loadTemplate]);

  useEffect(
    () => () => {
      clearTimeout(saveTimer.current);
      clearTimeout(notesTimer.current);
      writeNotes(notesRef.current);
    },
    []
  );

  // Large mode: lock page scroll, close on Escape, and refit once the canvas has resized.
  useEffect(() => {
    if (!large) return undefined;
    const onKey = (e) => e.key === "Escape" && !e.defaultPrevented && setLarge(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [large]);

  useEffect(() => {
    if (!api) return undefined;
    const t = setTimeout(() => {
      if (api.getSceneElements().length > 0) {
        api.scrollToContent(api.getSceneElements(), { fitToViewport: true, viewportZoomFactor: 0.74 });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [api, large]);

  // A share code pasted while the canvas is focused opens the import dialog instead of becoming a text box.
  useEffect(() => {
    if (!api) return undefined;
    const onPaste = (e) => {
      const target = e.target;
      const editable = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      const inCanvas = canvasRef.current && canvasRef.current.contains(document.activeElement || target);
      if (editable || !inCanvas) return;
      const text = e.clipboardData && e.clipboardData.getData("text/plain");
      if (!containsShareCode(text)) return;
      e.preventDefault();
      e.stopPropagation(); // capture phase: Excalidraw never sees it
      setDialog({ type: "import", text });
    };
    window.addEventListener("paste", onPaste, true);
    return () => window.removeEventListener("paste", onPaste, true);
  }, [api]);

  const handleNotes = (e) => {
    const next = { ...notesRef.current, [templateId]: e.target.value };
    notesRef.current = next;
    setNotes(next);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => writeNotes(next), SAVE_DELAY_MS);
  };

  const handleChange = useCallback(
    (elements, appState) => {
      if (templateRef.current !== BLANK_ID) return;
      pendingSave.current = { elements: elements.filter((e) => !e.isDeleted), appState };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flushSave, SAVE_DELAY_MS);
    },
    [flushSave]
  );

  // Keep the current drawing for "restore it" when it holds work that would otherwise be lost.
  const stashCurrent = () => {
    flushSave();
    const elements = api.getSceneElements();
    const edited = elements.length > 0 && (templateId === BLANK_ID || signature(elements) !== loadedSig.current);
    setBackup(edited ? { templateId, title: template.title, elements, appState: viewState(api.getAppState()) } : null);
  };

  const handleSelect = (e) => {
    const next = e.target.value;
    if (!api || next === templateId) return;
    stashCurrent();
    setStatus("");
    setTemplateId(next);
    loadTemplate(next);
  };

  const restoreBackup = () => {
    templateRef.current = backup.templateId;
    setTemplateId(backup.templateId);
    loadScene(backup.elements, backup.appState, { fit: false });
    // Restored work must still count as edited, so switching again keeps a backup.
    loadedSig.current = "";
    if (backup.templateId === BLANK_ID) writeBlank(backup.elements, { ...api.getAppState(), ...backup.appState });
    setBackup(null);
  };

  const copyShareCode = async () => {
    const elements = api.getSceneElements();
    if (elements.length === 0) {
      setStatus("Nothing to copy yet. Draw something first.");
      return;
    }
    try {
      const { text, count, chars } = await exportShareText({ elements, appState: api.getAppState(), files: api.getFiles() });
      if (!(await copyText(text))) {
        setDialog({ type: "copy", text });
        setStatus("Clipboard blocked, copy the code manually.");
      } else {
        setStatus(count === 1 ? `Copied 1 part, ${chars.toLocaleString()} chars` : `Copied ${count} parts, paste each as its own message`);
      }
    } catch (err) {
      setStatus(`Copy failed: ${err.message || err}`);
    }
  };

  const copyMermaid = async () => {
    const { text, nodes, edges } = toMermaid(api.getSceneElements());
    if (nodes === 0) {
      setStatus("No labelled shapes to convert yet.");
      return;
    }
    if (await copyText(text)) setStatus(`Copied Mermaid: ${nodes} nodes, ${edges} edges (lossy, one-way)`);
    else setDialog({ type: "copy", text });
  };

  const loadImported = (scene) => {
    stashCurrent();
    const files = Object.values(scene.files || {});
    if (files.length > 0) api.addFiles(files);
    loadScene(scene.elements, scene.appState);
    // Imported work counts as edited, so switching templates keeps a backup.
    loadedSig.current = "";
    setDialog(null);
    setStatus(`Loaded ${scene.elements.length} elements from text`);
  };

  const exportScene = async (kind) => {
    if (!api) return;
    const elements = api.getSceneElements();
    if (elements.length === 0) {
      setStatus("Nothing to export yet. Draw something first.");
      return;
    }
    const options = {
      elements,
      files: api.getFiles(),
      exportPadding: 24,
      appState: {
        ...api.getAppState(),
        exportBackground: true,
        viewBackgroundColor: "#ffffff",
        exportWithDarkMode: false,
        exportEmbedScene: true,
        exportScale: 2,
      },
    };
    const name = `system-design-${template.id}`;
    try {
      if (kind === "png") {
        download(await exportToBlob({ ...options, mimeType: "image/png" }), `${name}.png`);
      } else {
        const svg = await exportToSvg(options);
        download(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }), `${name}.svg`);
      }
      setStatus(`Downloaded ${name}.${kind}`);
    } catch (err) {
      setStatus(`Export failed: ${err.message || err}`);
    }
  };

  return (
    <main className="wb" aria-labelledby="wb-heading">
      <div className="wb__inner">
        <p className="wb__label">{"// whiteboard/"}</p>
        <h1 id="wb-heading" className="wb__heading">System Design Whiteboard</h1>
        <p className="wb__sub">
          Start from a template, then add rectangles, shapes and connecting edges, and export the result as a PNG.
        </p>

        <div className="wb-controls">
          <label htmlFor="wb-template" className="wb-controls__label">Template</label>
          <select id="wb-template" className="wb-select" value={templateId} onChange={handleSelect}>
            {TEMPLATE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.id === BLANK_ID ? "Blank" : t.title}</option>
            ))}
          </select>
        </div>

        {backup && (
          <div className="wb-notice" role="status">
            <span>Your edited &ldquo;{backup.title}&rdquo; drawing was replaced.</span>
            <button type="button" className="wb-link" onClick={restoreBackup}>restore it</button>
            <button type="button" className="wb-link" onClick={() => setBackup(null)}>dismiss</button>
          </div>
        )}

        <div className={`wb-card${large ? " is-large" : ""}`}>
          <div className="wb-card__head">
            <span className="wb-dot wb-dot--r" /><span className="wb-dot wb-dot--y" /><span className="wb-dot wb-dot--g" />
            <span className="wb-card__path">{`~/whiteboard/${template.id}`}</span>
            <button
              type="button"
              className="wb-card__size"
              onClick={() => setLarge((v) => !v)}
              aria-pressed={large}
              aria-label={large ? "Close large mode" : "Open in large mode"}
              title={large ? "Close large mode (Esc)" : "Open in large mode"}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {large ? (
                  <path d="M14 10l7-7M15 3v7h7M10 14l-7 7M9 21v-7H2" />
                ) : (
                  <path d="M14 10l7-7M15 3h6v6M10 14l-7 7M9 21H3v-6" />
                )}
              </svg>
            </button>
          </div>
          <div className="wb-canvas" ref={canvasRef}>
            <Excalidraw
              excalidrawAPI={setApi}
              onChange={handleChange}
              UIOptions={UI_OPTIONS}
              theme="light"
              name={`system-design-${template.id}`}
            />
          </div>
        </div>

        <div className="wb-actions">
          <button type="button" className="wb-btn wb-btn--primary" onClick={() => exportScene("png")} disabled={!api}>
            export PNG
          </button>
          <button type="button" className="wb-btn" onClick={() => exportScene("svg")} disabled={!api}>
            export SVG
          </button>
          <button type="button" className="wb-btn" onClick={copyShareCode} disabled={!api} aria-label="Copy drawing as share code text">
            copy as text
          </button>
          <button type="button" className="wb-btn" onClick={() => setDialog({ type: "import", text: "" })} disabled={!api} aria-label="Paste drawing from share code text">
            paste from text
          </button>
          <button type="button" className="wb-btn wb-btn--ghost" onClick={copyMermaid} disabled={!api} aria-label="Copy as Mermaid flowchart, one-way and lossy" title="One-way and lossy: labelled shapes and bound arrows only">
            copy as Mermaid
          </button>
          <span className="wb-status" role="status">{status}</span>
        </div>
        {dialog && dialog.type === "import" && (
          <ImportDialog
            initialText={dialog.text}
            replacing={api.getSceneElements().length > 0}
            onLoad={loadImported}
            onClose={() => setDialog(null)}
          />
        )}
        {dialog && dialog.type === "copy" && <CopyFallbackDialog text={dialog.text} onClose={() => setDialog(null)} />}
        <p className="wb-hint">On touch screens, drag with two fingers to pan; scroll the page from the margins outside the canvas.</p>

        <div className="wb-info">
          <section className="wb-panel" aria-labelledby="wb-template-title">
            <h2 className="wb-panel__tag">TEMPLATE</h2>
            <h3 id="wb-template-title" className="wb-panel__title">{template.title}</h3>
            <p className="wb-panel__text">{template.description}</p>
          </section>
          <section className="wb-panel" aria-labelledby="wb-points-title">
            <h2 id="wb-points-title" className="wb-panel__tag">{template.id === BLANK_ID ? "HOW TO" : "TALKING POINTS"}</h2>
            <ul className="wb-panel__list">
              {template.talkingPoints.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>
        </div>

        <section className="wb-panel wb-notes" aria-labelledby="wb-notes-title">
          <h2 id="wb-notes-title" className="wb-panel__tag">NOTES</h2>
          <label htmlFor="wb-notes-text" className="wb-notes__label">
            {`Your notes for ${template.id === BLANK_ID ? "the blank canvas" : template.title}`}
          </label>
          <textarea
            id="wb-notes-text"
            className="wb-notes__text"
            rows={6}
            value={notes[templateId] || ""}
            onChange={handleNotes}
            placeholder="Requirements, assumptions, capacity estimates, trade-offs to mention..."
          />
          <p className="wb-notes__hint">Saved in this browser, separately for each diagram.</p>
        </section>
      </div>
    </main>
  );
};

export default Whiteboard;
