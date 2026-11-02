import React, { useEffect, useId, useRef, useState } from "react";
import { ShareCodeError, importShareText, parseShareText } from "./shareCode";

const FOCUSABLE = "button:not(:disabled), textarea, [href], input, select, [tabindex]:not([tabindex='-1'])";

// Modal shell: Esc closes, Tab stays inside, focus returns to whatever opened it.
const Modal = ({ title, onClose, initialFocus, children }) => {
  const titleId = useId();
  const box = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    (initialFocus?.current || box.current.querySelector(FOCUSABLE))?.focus();
    return () => opener && opener.focus && opener.focus();
  }, [initialFocus]);

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.nativeEvent.stopPropagation(); // keep large mode open underneath
      onClose();
    } else if (e.key === "Tab") {
      const items = [...box.current.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="wb-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()} onKeyDown={onKeyDown}>
      <div className="wb-modal__box" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={box}>
        <h2 id={titleId} className="wb-modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const CopyFallbackDialog = ({ text, onClose }) => {
  const area = useRef(null);
  return (
    <Modal title="Copy share code" onClose={onClose} initialFocus={area}>
      <p className="wb-modal__text">Automatic copy was blocked. Select all and copy it yourself (Ctrl/Cmd+C).</p>
      <textarea
        ref={area}
        className="wb-modal__area"
        readOnly
        rows={8}
        value={text}
        aria-label="Share code"
        onFocus={(e) => e.target.select()}
      />
      <div className="wb-modal__actions">
        <button type="button" className="wb-btn" onClick={() => area.current.select()}>select all</button>
        <button type="button" className="wb-btn wb-btn--primary" onClick={onClose}>done</button>
      </div>
    </Modal>
  );
};

export const ImportDialog = ({ initialText = "", replacing, onLoad, onClose }) => {
  const area = useRef(null);
  const [text, setText] = useState(initialText);
  const [note, setNote] = useState("");
  const [result, setResult] = useState({ state: "empty" });

  useEffect(() => {
    if (!text.trim()) {
      setResult({ state: "empty" });
      return undefined;
    }
    let cancelled = false;
    const parsed = parseShareText(text);
    if (!parsed.ok) {
      setResult({ state: "error", message: parsed.error });
      return undefined;
    }
    setResult({ state: "checking" });
    importShareText(text).then(
      (scene) => !cancelled && setResult({ state: "ok", scene, parts: parsed.total }),
      (err) => !cancelled && setResult({ state: "error", message: err instanceof ShareCodeError ? err.message : "Could not read the share code." })
    );
    return () => {
      cancelled = true;
    };
  }, [text]);

  const readClipboard = async () => {
    try {
      setText(await navigator.clipboard.readText());
      setNote("");
    } catch (e) {
      setNote("The browser blocked clipboard access. Paste into the box with Ctrl/Cmd+V instead.");
      area.current.focus();
    }
  };

  const count = result.state === "ok" ? result.scene.elements.length : 0;
  return (
    <Modal title="Paste from text" onClose={onClose} initialFocus={area}>
      <p className="wb-modal__text">
        Paste a share code (starting with EXWB1:). Parts can be in any order and surrounded by other text.
      </p>
      <textarea
        ref={area}
        className="wb-modal__area"
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Share code to import"
        aria-describedby="wb-import-result"
        spellCheck={false}
        placeholder="EXWB1:..."
      />
      <p id="wb-import-result" className={`wb-modal__result is-${result.state}`} role="status">
        {result.state === "ok" && `${count} element${count === 1 ? "" : "s"}, ${result.parts} part${result.parts === 1 ? "" : "s"} OK`}
        {result.state === "checking" && "Checking..."}
        {result.state === "error" && result.message}
        {note}
      </p>
      {result.state === "ok" && replacing && (
        <p className="wb-modal__hint">Loading replaces the canvas. Your current drawing stays available via &ldquo;restore it&rdquo;.</p>
      )}
      <div className="wb-modal__actions">
        <button type="button" className="wb-btn" onClick={readClipboard}>paste from clipboard</button>
        <button type="button" className="wb-btn wb-btn--primary" disabled={result.state !== "ok"} onClick={() => onLoad(result.scene)}>
          load
        </button>
        <button type="button" className="wb-btn" onClick={onClose}>cancel</button>
      </div>
    </Modal>
  );
};
