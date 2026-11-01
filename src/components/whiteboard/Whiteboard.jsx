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
import "./Whiteboard.css";

const STORAGE_KEY = "wb-blank-scene-v1";
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

  const templateRef = useRef(DEFAULT_TEMPLATE);
  const loadedSig = useRef("");
  const pendingSave = useRef(null);
  const saveTimer = useRef(null);

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

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const handleChange = useCallback(
    (elements, appState) => {
      if (templateRef.current !== BLANK_ID) return;
      pendingSave.current = { elements: elements.filter((e) => !e.isDeleted), appState };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flushSave, SAVE_DELAY_MS);
    },
    [flushSave]
  );

  const handleSelect = (e) => {
    const next = e.target.value;
    if (!api || next === templateId) return;
    flushSave();
    const elements = api.getSceneElements();
    const edited = elements.length > 0 && (templateId === BLANK_ID || signature(elements) !== loadedSig.current);
    setBackup(edited ? { templateId, title: template.title, elements, appState: viewState(api.getAppState()) } : null);
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

        <div className="wb-card">
          <div className="wb-card__head">
            <span className="wb-dot wb-dot--r" /><span className="wb-dot wb-dot--y" /><span className="wb-dot wb-dot--g" />
            <span className="wb-card__path">{`~/whiteboard/${template.id}`}</span>
          </div>
          <div className="wb-canvas">
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
          <span className="wb-status" role="status">{status}</span>
        </div>
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
      </div>
    </main>
  );
};

export default Whiteboard;
