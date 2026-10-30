import React from "react";
import { runCommand, complete } from "./commands";

const BOOT = [
  { text: "portfolio-sh 1.0 · type `help` to see what I can do" },
  { text: "[ OK ] session started as guest", kind: "ok" },
  { text: "" },
  { text: "Try: ls, whoami, projects" },
];

const QUICK = ["help", "ls", "whoami", "projects", "experience", "skills"];

let nextId = 0;
const entry = (props) => ({ id: nextId++, ...props });

const Terminal = () => {
  const [entries, setEntries] = React.useState(() => [
    entry({ type: "out", lines: BOOT }),
  ]);
  const [value, setValue] = React.useState("");
  const [history, setHistory] = React.useState([]);
  const [cursor, setCursor] = React.useState(-1);
  const inputRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const interacted = React.useRef(false);

  // Keep the newest output in view inside the terminal only. Skipped until
  // the user interacts so page load never scrolls or steals focus.
  React.useEffect(() => {
    if (!interacted.current || !bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries]);

  const focusInput = () => {
    interacted.current = true;
    if (inputRef.current) inputRef.current.focus({ preventScroll: true });
  };

  const exec = (raw) => {
    interacted.current = true;
    const result = runCommand(raw);
    if (result.clear) {
      setEntries([]);
    } else {
      setEntries((prev) => [
        ...prev,
        entry({ type: "cmd", text: raw }),
        ...(result.lines.length ? [entry({ type: "out", lines: result.lines })] : []),
      ]);
    }
    if (raw.trim()) setHistory((h) => [...h, raw]);
    setCursor(-1);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      exec(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === -1) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const { value: completed, options } = complete(value);
      if (options.length) {
        setEntries((prev) => [
          ...prev,
          entry({ type: "cmd", text: value }),
          entry({ type: "out", lines: [{ text: options.join("  ") }] }),
        ]);
      }
      setValue(completed);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  const runQuick = (cmd) => {
    exec(cmd);
    focusInput();
  };

  return (
    <div className="term" role="group" aria-label="Interactive terminal">
      <div className="term__bar" aria-hidden="true">
        <span className="term__dot term__dot--red" />
        <span className="term__dot term__dot--yellow" />
        <span className="term__dot term__dot--green" />
        <span className="term__title">yongliang@portfolio: ~</span>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className="term__body" ref={bodyRef} onClick={focusInput}>
        <div className="term__output" role="log" aria-live="polite" aria-label="Terminal output">
          {entries.map((en) =>
            en.type === "cmd" ? (
              <div className="term__line" key={en.id}>
                <span className="term__prompt">guest@portfolio:~$</span> {en.text}
              </div>
            ) : (
              <div className="term__block" key={en.id}>
                {en.lines.map((l, i) => (
                  <div
                    key={i}
                    className={`term__line${l.kind ? ` term__line--${l.kind}` : ""}`}
                  >
                    {l.href ? (
                      <a href={l.href} target="_blank" rel="noreferrer noopener">
                        {l.text}
                      </a>
                    ) : (
                      l.text || " "
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <label className="term__input-row">
          <span className="term__prompt" aria-hidden="true">guest@portfolio:~$</span>
          <input
            ref={inputRef}
            className="term__input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal command input"
          />
        </label>
      </div>
      <div className="term__footer">
        {QUICK.map((cmd) => (
          <button type="button" key={cmd} className="term__btn" onClick={() => runQuick(cmd)}>
            {cmd}
          </button>
        ))}
        <span className="term__hint">↑ ↓ history · Tab completes</span>
      </div>
    </div>
  );
};

export default Terminal;
