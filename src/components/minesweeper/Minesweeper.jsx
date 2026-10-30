import React from "react";
import { createPortal } from "react-dom";
import { ROWS, COLS, MINES, newGame, reveal, toggleFlag, flagCount } from "./game";
import "./Minesweeper.css";

const OPEN_EVENT = "minesweeper:open";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const TAPS_NEEDED = 7;
const TAP_GAP_MS = 700;
const TERMINAL_INPUT = "term__input";

// Lets non-React code (the terminal's `sudo minesweeper`) open the game.
export const openMinesweeper = () => window.dispatchEvent(new Event(OPEN_EVENT));

// Touch fallback: call on every tap of the profile photo.
let taps = 0;
let lastTap = 0;
export const registerPhotoTap = () => {
  const now = Date.now();
  taps = now - lastTap <= TAP_GAP_MS ? taps + 1 : 1;
  lastTap = now;
  if (taps >= TAPS_NEEDED) {
    taps = 0;
    openMinesweeper();
  }
};

// Removes the b / a the Konami code left in the terminal input.
const stripTyped = (input) => {
  const next = input.value.replace(/ba?$/i, "");
  if (next === input.value) return;
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, next);
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

const pad3 = (n) => (n < 0 ? `-${String(-n).padStart(2, "0")}` : String(n).padStart(3, "0"));

const cellView = (game, i) => {
  const s = game.st[i];
  const over = game.status === "lost";
  const mine = game.mines && game.mines[i];
  if (s === "r") {
    if (mine) return { cls: "boom", glyph: "✸", label: "exploded mine" };
    const n = game.adj[i];
    return n
      ? { cls: `open n${n}`, glyph: String(n), label: `revealed, ${n} adjacent ${n === 1 ? "mine" : "mines"}` }
      : { cls: "open", glyph: "", label: "revealed, empty" };
  }
  if (s === "f") {
    if (over && !mine) return { cls: "wrong", glyph: "⚑", label: "flagged, wrong" };
    return { cls: "flag", glyph: "⚑", label: "flagged" };
  }
  if (mine && over) return { cls: "mine", glyph: "✸", label: "mine" };
  if (mine && game.status === "won") return { cls: "flag", glyph: "⚑", label: "flagged" };
  return { cls: "", glyph: "", label: "hidden" };
};

const Game = ({ onClose }) => {
  const [game, setGame] = React.useState(newGame);
  const [seconds, setSeconds] = React.useState(0);
  const [flagMode, setFlagMode] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const dialogRef = React.useRef(null);
  const cellRefs = React.useRef([]);
  const startRef = React.useRef(0);

  // Focus in on open, back out on close, and freeze the page behind the modal.
  React.useEffect(() => {
    const prev = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    if (cellRefs.current[0]) cellRefs.current[0].focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, []);

  React.useEffect(() => {
    if (game.status !== "playing") return undefined;
    const id = setInterval(
      () => setSeconds(Math.min(999, Math.floor((Date.now() - startRef.current) / 1000))),
      250
    );
    return () => clearInterval(id);
  }, [game.status]);

  const apply = (next) => {
    if (next === game) return;
    if (game.status === "idle" && next.status !== "idle") startRef.current = Date.now();
    if (next.status === "won" || next.status === "lost") {
      setSeconds(Math.min(999, Math.floor((Date.now() - startRef.current) / 1000)));
    }
    setGame(next);
  };

  const act = (i, forceFlag) => {
    setActive(i);
    apply(forceFlag || flagMode ? toggleFlag(game, i) : reveal(game, i));
  };

  const restart = () => {
    setGame(newGame());
    setSeconds(0);
    setActive(0);
  };

  const focusCell = (i) => {
    setActive(i);
    if (cellRefs.current[i]) cellRefs.current[i].focus();
  };

  const onBoardKeyDown = (e) => {
    const r = Math.floor(active / COLS);
    const c = active % COLS;
    const move = {
      ArrowUp: [r - 1, c],
      ArrowDown: [r + 1, c],
      ArrowLeft: [r, c - 1],
      ArrowRight: [r, c + 1],
    }[e.key];
    if (!move) return;
    e.preventDefault();
    const [nr, nc] = move;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) focusCell(nr * COLS + nc);
  };

  const onDialogKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      act(active, true);
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

  const onContextMenu = (e) => {
    e.preventDefault();
    const cell = e.target.closest("[data-i]");
    if (cell) act(Number(cell.dataset.i), true);
  };

  const left = MINES - flagCount(game);
  const status =
    game.status === "won"
      ? `ACCESS GRANTED: cleared in ${seconds}s`
      : game.status === "lost"
      ? "SEGFAULT: you hit a mine. try again?"
      : `${Math.max(left, 0)} ${left === 1 ? "mine" : "mines"} left`;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="ms-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="ms-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ms-title"
        ref={dialogRef}
        onKeyDown={onDialogKeyDown}
      >
        <div className="ms-bar">
          <span className="ms-dots" aria-hidden="true">
            <i className="ms-dot ms-dot--red" />
            <i className="ms-dot ms-dot--yellow" />
            <i className="ms-dot ms-dot--green" />
          </span>
          <h2 className="ms-title" id="ms-title">minesweeper.exe</h2>
          <button type="button" className="ms-close" onClick={onClose} aria-label="Close minesweeper">
            ✕
          </button>
        </div>

        <div className="ms-body">
          <div className="ms-head">
            <div className="ms-stats">
              <span>mines {pad3(left)}</span>
              <span>time {pad3(seconds)}</span>
            </div>
            <div className="ms-actions">
              <button
                type="button"
                className={`ms-btn${flagMode ? " is-on" : ""}`}
                aria-pressed={flagMode}
                onClick={() => setFlagMode((f) => !f)}
              >
                <span aria-hidden="true">⚑</span> flag mode
              </button>
              <button type="button" className="ms-btn" onClick={restart}>
                new game
              </button>
            </div>
          </div>

          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className="ms-board"
            role="grid"
            aria-label="Minesweeper board, 9 by 9, 10 mines"
            onKeyDown={onBoardKeyDown}
            onContextMenu={onContextMenu}
          >
            {Array.from({ length: ROWS }, (_, r) => (
              <div className="ms-row" role="row" key={r}>
                {Array.from({ length: COLS }, (_, c) => {
                  const i = r * COLS + c;
                  const v = cellView(game, i);
                  return (
                    <button
                      type="button"
                      role="gridcell"
                      key={i}
                      data-i={i}
                      ref={(el) => {
                        cellRefs.current[i] = el;
                      }}
                      className={`ms-cell ${v.cls}`}
                      tabIndex={i === active ? 0 : -1}
                      aria-label={`row ${r + 1}, column ${c + 1}, ${v.label}`}
                      onClick={() => act(i)}
                      onFocus={() => setActive(i)}
                    >
                      <span aria-hidden="true">{v.glyph}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <p
            className={`ms-status${game.status === "won" ? " is-win" : ""}${game.status === "lost" ? " is-lose" : ""}`}
            aria-live="polite"
          >
            {status}
          </p>
          <p className="ms-hint">click to reveal · right-click or F to flag · arrows to move · Esc to exit</p>
        </div>
      </div>
    </div>
  );
};

const Minesweeper = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);

    let idx = 0;
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[idx]) idx += 1;
      else idx = k === KONAMI[0] ? 1 : 0;
      if (idx < KONAMI.length) return;
      idx = 0;
      const el = document.activeElement;
      if (el && el.classList && el.classList.contains(TERMINAL_INPUT)) {
        e.preventDefault(); // keep the final "a" out of the input
        setTimeout(() => stripTyped(el), 0);
      }
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return open ? createPortal(<Game onClose={() => setOpen(false)} />, document.body) : null;
};

export default Minesweeper;
