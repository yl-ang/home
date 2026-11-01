import React from "react";
import { createPortal } from "react-dom";
import { COLS, initialPieces, movePiece, canMove, isWon } from "./game";
import "./Klotski.css";

const OPEN_EVENT = "klotski:open";
const START_PIECE = "cao";
const DRAG_THRESHOLD = 0.45; // fraction of a cell the pointer must travel to slide one step
const ARROWS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
const PAD = [
  { dir: "up", glyph: "↑" },
  { dir: "down", glyph: "↓" },
  { dir: "left", glyph: "←" },
  { dir: "right", glyph: "→" },
];

// Lets non-React code (the terminal's `sudo klotski`) open the game.
export const openKlotski = () => window.dispatchEvent(new Event(OPEN_EVENT));

const pad3 = (n) => String(n).padStart(3, "0");

const fresh = () => ({ pieces: initialPieces(), moves: 0, won: false });

const reducer = (state, action) => {
  if (action.type === "reset") return fresh();
  if (state.won) return state;
  const pieces = movePiece(state.pieces, action.id, action.dir);
  return pieces ? { pieces, moves: state.moves + 1, won: isWon(pieces) } : state;
};

const Game = ({ onClose }) => {
  const [{ pieces, moves, won }, dispatch] = React.useReducer(reducer, null, fresh);
  const [selected, setSelected] = React.useState(START_PIECE);
  const dialogRef = React.useRef(null);
  const boardRef = React.useRef(null);
  const pieceRefs = React.useRef({});
  const drag = React.useRef(null);

  // Focus in on open, back out on close, and freeze the page behind the modal.
  React.useEffect(() => {
    const prev = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    if (pieceRefs.current[START_PIECE]) pieceRefs.current[START_PIECE].focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, []);

  const select = (id) => {
    setSelected(id);
    // Safari doesn't focus buttons on click; keep focus inside the dialog so arrow keys land.
    if (pieceRefs.current[id]) pieceRefs.current[id].focus({ preventScroll: true });
  };

  const step = (dir) => dispatch({ type: "move", id: selected, dir });

  const restart = () => {
    dispatch({ type: "reset" });
    select(START_PIECE);
  };

  const onPointerDown = (e, id) => {
    select(id);
    drag.current = { x: e.clientX, y: e.clientY };
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e, id) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const cell = boardRef.current.clientWidth / COLS;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < cell * DRAG_THRESHOLD) return;
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    dispatch({ type: "move", id, dir });
    d.x = e.clientX;
    d.y = e.clientY;
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onDialogKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (ARROWS[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      step(ARROWS[e.key]);
    } else if (e.key === "Tab") {
      const items = dialogRef.current.querySelectorAll('button:not([disabled]):not([tabindex="-1"])');
      if (!items.length) return;
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

  const status = won ? `ACCESS GRANTED: Cao Cao escaped in ${moves} moves` : "free Cao Cao: slide the big block to the exit";

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="kl-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="kl-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kl-title"
        ref={dialogRef}
        onKeyDown={onDialogKeyDown}
      >
        <div className="kl-bar">
          <span className="kl-dots" aria-hidden="true">
            <i className="kl-dot kl-dot--red" />
            <i className="kl-dot kl-dot--yellow" />
            <i className="kl-dot kl-dot--green" />
          </span>
          <h2 className="kl-title" id="kl-title">klotski.exe</h2>
          <button type="button" className="kl-close" onClick={onClose} aria-label="Close klotski">
            ✕
          </button>
        </div>

        <div className="kl-body">
          <div className="kl-head">
            <div className="kl-stats">
              <span>moves {pad3(moves)}</span>
            </div>
            <button type="button" className="kl-btn" onClick={restart}>
              reset
            </button>
          </div>

          <div className="kl-board" ref={boardRef} role="group" aria-label="Klotski board, 4 by 5">
            <div className="kl-slots" aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <i className="kl-slot" key={i} />
              ))}
            </div>
            {pieces.map((p) => (
              <button
                type="button"
                key={p.id}
                ref={(el) => {
                  pieceRefs.current[p.id] = el;
                }}
                className={`kl-piece kl-piece--${p.id === "cao" ? "cao" : p.w * p.h}${selected === p.id ? " is-selected" : ""}${
                  won && p.id === "cao" ? " is-win" : ""
                }`}
                style={{ "--r": p.r, "--c": p.c, "--w": p.w, "--h": p.h }}
                aria-pressed={selected === p.id}
                aria-label={`${p.name}, ${p.w} by ${p.h}, row ${p.r + 1} column ${p.c + 1}`}
                onPointerDown={(e) => onPointerDown(e, p.id)}
                onPointerMove={(e) => onPointerMove(e, p.id)}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onClick={() => select(p.id)}
              >
                <span aria-hidden="true">{p.glyph}</span>
              </button>
            ))}
            <div className="kl-exit" aria-hidden="true">
              <span>exit</span>
            </div>
          </div>

          <div className="kl-pad">
            {PAD.map(({ dir, glyph }) => (
              <button
                type="button"
                key={dir}
                className="kl-btn kl-btn--pad"
                aria-label={`Move selected piece ${dir}`}
                aria-disabled={won || !canMove(pieces, selected, dir)}
                onClick={() => step(dir)}
              >
                {glyph}
              </button>
            ))}
          </div>

          <p className={`kl-status${won ? " is-win" : ""}`} aria-live="polite">
            {status}
          </p>
          <p className="kl-hint">tap a piece · drag it or use arrows to slide · Esc to exit</p>
        </div>
      </div>
    </div>
  );
};

const Klotski = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  return open ? createPortal(<Game onClose={() => setOpen(false)} />, document.body) : null;
};

export default Klotski;
