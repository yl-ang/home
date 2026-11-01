import React from "react";
import { createPortal } from "react-dom";
import {
  COLS,
  ROWS,
  HOME_COLS,
  LIVES,
  TIME_LIMIT,
  rowKind,
  newGame,
  hop,
  step,
  diveState,
} from "./game";
import "./Frogger.css";

const OPEN_EVENT = "frogger:open";
const HIGH_KEY = "frogger:high";

// Lets non-React code (the terminal's `sudo frogger`) open the game.
export const openFrogger = () => window.dispatchEvent(new Event(OPEN_EVENT));

const DIRS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const CAUSE_TEXT = {
  car: "ROADKILL: look both ways next time",
  water: "SPLASH: frogs can swim, you cannot",
  swept: "SWEPT AWAY: the current won",
  time: "TIMEOUT: the lily pads waited in vain",
  hedge: "OUCH: that is a hedge",
  occupied: "OCCUPIED: that pad is taken",
};

const loadHigh = () => {
  try {
    return Number(window.localStorage.getItem(HIGH_KEY)) || 0;
  } catch (e) {
    return 0;
  }
};
const saveHigh = (n) => {
  try {
    window.localStorage.setItem(HIGH_KEY, String(n));
  } catch (e) {
    // storage unavailable: the high score just lasts for this session
  }
};

const pct = (n, of) => `${(n * 100) / of}%`;

const Lane = ({ lane, time }) => (
  <div className="fg-lane" style={{ top: pct(lane.row, ROWS), height: pct(1, ROWS) }}>
    {lane.xs.map((x, i) => {
      const style = { left: pct(x, COLS), width: pct(lane.w, COLS) };
      if (lane.kind === "turtle") {
        return (
          <div key={i} className={`fg-obj fg-turtles is-${diveState(lane, i, time)}`} style={style}>
            {Array.from({ length: lane.w }, (_, k) => (
              <span className="fg-shell" key={k} />
            ))}
          </div>
        );
      }
      const cls = lane.kind === "log" ? "fg-log" : `fg-vehicle fg-${lane.kind} fg-v${lane.style} fg-${lane.dir > 0 ? "r" : "l"}`;
      return <div key={i} className={`fg-obj ${cls}`} style={style} />;
    })}
  </div>
);

const Game = ({ onClose }) => {
  const [game, setGame] = React.useState(newGame);
  const [paused, setPaused] = React.useState(true);
  const [high, setHigh] = React.useState(loadHigh);
  const dialogRef = React.useRef(null);
  const gameRef = React.useRef(game);
  const pausedRef = React.useRef(true);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  const setPause = React.useCallback((p) => {
    pausedRef.current = p;
    setPaused(p);
  }, []);

  const commit = React.useCallback((next) => {
    if (next === gameRef.current) return;
    gameRef.current = next;
    setGame(next);
  }, []);

  const go = React.useCallback(
    (dir) => {
      if (gameRef.current.status === "over") return;
      if (pausedRef.current) setPause(false); // the first move just starts / resumes
      else commit(hop(gameRef.current, dir));
    },
    [commit, setPause]
  );

  const restart = React.useCallback(() => {
    commit(newGame());
    setPause(false);
  }, [commit, setPause]);

  // Focus in on open, back out on close, and freeze the page behind the modal.
  React.useEffect(() => {
    const prev = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    if (prev && prev.blur) prev.blur(); // keep keystrokes out of the terminal input
    if (dialogRef.current) dialogRef.current.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, []);

  // Keyboard: handled in the capture phase so nothing reaches the page or the
  // other hidden games' listeners while this modal is open.
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.stopPropagation();
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === "Escape") {
        e.preventDefault();
        closeRef.current();
      } else if (DIRS[k]) {
        e.preventDefault();
        go(DIRS[k]);
      } else if (k === "p") {
        e.preventDefault();
        if (gameRef.current.status === "playing") setPause(!pausedRef.current);
      } else if (k === "r" && gameRef.current.status === "over") {
        e.preventDefault();
        restart();
      } else if (k === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll("button:not([disabled])");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [go, setPause, restart]);

  // Hidden tabs pause the game.
  React.useEffect(() => {
    const onVis = () => document.hidden && setPause(true);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [setPause]);

  // requestAnimationFrame loop, only alive while the game is running.
  React.useEffect(() => {
    if (paused) return undefined;
    let raf = 0;
    let last = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      commit(step(gameRef.current, dt));
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [paused, commit]);

  React.useEffect(() => {
    if (game.score > high) {
      setHigh(game.score);
      saveHigh(game.score);
    }
  }, [game.score, high]);

  const over = game.status === "over";
  const dead = game.dying > 0;
  const cleared = game.clear > 0;
  const status = over
    ? `GAME OVER: ${CAUSE_TEXT[game.cause] || "the frog is gone"}`
    : cleared
    ? `LEVEL ${game.level} CLEARED: faster traffic ahead`
    : dead
    ? CAUSE_TEXT[game.cause]
    : `level ${game.level}: fill all ${HOME_COLS.length} lily pads`;
  const timeFrac = Math.max(0, game.timeLeft / TIME_LIMIT);

  const pad = (dir, label, glyph) => (
    <button
      type="button"
      className={`fg-key fg-key--${dir}`}
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        go(dir);
      }}
      onClick={(e) => e.detail === 0 && go(dir)}
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="fg-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        className="fg-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fg-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="fg-bar">
          <span className="fg-dots" aria-hidden="true">
            <i className="fg-dot fg-dot--red" />
            <i className="fg-dot fg-dot--yellow" />
            <i className="fg-dot fg-dot--green" />
          </span>
          <h2 className="fg-title" id="fg-title">frogger.exe</h2>
          <button type="button" className="fg-close" onClick={onClose} aria-label="Close frogger">
            ✕
          </button>
        </div>

        <div className="fg-body">
          <div className="fg-head">
            <span>score {String(game.score).padStart(5, "0")}</span>
            <span className="fg-hi">hi {String(high).padStart(5, "0")}</span>
            <span>lv {game.level}</span>
            <span className="fg-lives" aria-label={`${game.lives} lives left`}>
              {"♥".repeat(Math.max(0, game.lives))}
              <span className="fg-lives-lost">{"♥".repeat(Math.max(0, LIVES - Math.max(0, game.lives)))}</span>
            </span>
          </div>

          <div
            className="fg-timer"
            role="progressbar"
            aria-label="time left"
            aria-valuemin={0}
            aria-valuemax={TIME_LIMIT}
            aria-valuenow={Math.ceil(game.timeLeft)}
          >
            <i className={timeFrac < 0.25 ? "is-low" : ""} style={{ width: `${timeFrac * 100}%` }} />
          </div>

          <div className="fg-board" role="img" aria-label="Frogger board">
            {Array.from({ length: ROWS }, (_, r) => (
              <div key={r} className={`fg-row fg-row--${rowKind(r)}`} style={{ top: pct(r, ROWS), height: pct(1, ROWS) }} />
            ))}
            {HOME_COLS.map((c) => (
              <div key={c} className="fg-home" style={{ left: pct(c, COLS), width: pct(1, COLS), height: pct(1, ROWS) }}>
                <span className="fg-pad" />
                {game.homes.includes(c) && <span className="fg-frog fg-frog--home" />}
              </div>
            ))}
            {game.lanes.map((lane) => (
              <Lane key={lane.row} lane={lane} time={game.time} />
            ))}
            {!cleared && !over && (
              <div
                className={`fg-frog-cell${dead ? " is-dead" : ""}`}
                style={{ left: pct(game.frog.x, COLS), top: pct(game.frog.row, ROWS), width: pct(1, COLS), height: pct(1, ROWS) }}
              >
                <span className={`fg-frog fg-face-${game.frog.face}`} />
              </div>
            )}

            {(paused || over) && (
              <div className="fg-overlay">
                <p className="fg-overlay-title">{over ? "GAME OVER" : game.score || game.level > 1 ? "PAUSED" : "READY?"}</p>
                {over && <p className="fg-overlay-sub">final score {game.score}{game.score >= high && game.score > 0 ? " (new high!)" : ""}</p>}
                {over ? (
                  <button type="button" className="fg-btn" onClick={restart} autoFocus>
                    play again
                  </button>
                ) : (
                  <button type="button" className="fg-btn" onClick={() => setPause(false)} autoFocus>
                    {game.score || game.level > 1 ? "resume" : "start"}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className={`fg-status${over || dead ? " is-lose" : ""}${cleared ? " is-win" : ""}`} aria-live="polite">
            {status}
          </p>

          <div className="fg-controls">
            <div className="fg-pad-grid">
              {pad("up", "Hop up", "▲")}
              {pad("left", "Hop left", "◀")}
              {pad("down", "Hop down", "▼")}
              {pad("right", "Hop right", "▶")}
            </div>
            <button
              type="button"
              className="fg-btn fg-btn--pause"
              disabled={over}
              onClick={() => setPause(!paused)}
            >
              {paused ? "resume" : "pause"}
            </button>
          </div>
          <p className="fg-hint">arrows / WASD to hop · P pause · Esc to exit</p>
        </div>
      </div>
    </div>
  );
};

const Frogger = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  return open ? createPortal(<Game onClose={() => setOpen(false)} />, document.body) : null;
};

export default Frogger;
