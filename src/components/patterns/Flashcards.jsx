import React, { useEffect, useMemo, useState } from "react";
import { PATTERNS, TOPICS } from "./patternsData";
import {
  ALL,
  buildDeck,
  clamp,
  countByTopic,
  loadState,
  pad2,
  progressFor,
  saveState,
  tokenizeLine,
} from "./patternsLogic";

const COUNTS = countByTopic(PATTERNS, TOPICS);

const getStorage = () => {
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
};

const isTyping = (el) =>
  !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);

const Code = ({ code }) => (
  <pre className="pt-code" tabIndex={0} aria-label="Python template">
    <code>
      {code.split("\n").map((line, i) => (
        <span className="pt-code__line" key={i}>
          {tokenizeLine(line).map((tok, j) => (
            <span key={j} className={tok.type === "txt" ? undefined : `pt-tok--${tok.type}`}>
              {tok.text}
            </span>
          ))}
          {"\n"}
        </span>
      ))}
    </code>
  </pre>
);

const Flashcards = ({ jump }) => {
  const [saved] = useState(() => {
    const storage = getStorage();
    return storage ? loadState(storage) : { topic: ALL, status: {} };
  });
  const [topic, setTopic] = useState(jump ? ALL : saved.topic in COUNTS ? saved.topic : ALL);
  const [status, setStatus] = useState(saved.status);
  const [front, setFront] = useState("name");
  const [shuffled, setShuffled] = useState(false);
  const [hideKnown, setHideKnown] = useState(false);
  const [seed, setSeed] = useState(1);
  const [index, setIndex] = useState(jump ? clamp(jump.id - 1, 0, PATTERNS.length - 1) : 0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const storage = getStorage();
    if (storage) saveState(storage, { topic, status });
  }, [topic, status]);

  const deck = useMemo(
    () => buildDeck(PATTERNS, { topic, shuffled, hideKnown, status, seed }),
    [topic, shuffled, hideKnown, status, seed]
  );
  const pos = clamp(index, 0, Math.max(deck.length - 1, 0));
  const card = deck[pos];
  const progress = progressFor(PATTERNS, topic, status);
  const topicLabel = topic === ALL ? "all patterns" : topic;

  const go = (delta) => {
    if (!deck.length) return;
    setIndex((pos + delta + deck.length) % deck.length);
    setFlipped(false);
  };
  const flip = () => card && setFlipped((f) => !f);
  const mark = (kind) => {
    if (!card) return;
    setStatus((s) => ({ ...s, [card.id]: kind }));
    // A card hidden by "hide known" is replaced by the next one in place.
    if (!(kind === "known" && hideKnown)) setIndex((pos + 1) % deck.length);
    setFlipped(false);
  };
  const pickTopic = (t) => {
    setTopic(t);
    setIndex(0);
    setFlipped(false);
  };
  const toggleShuffle = (on) => {
    setShuffled(on);
    if (on) setSeed((s) => s + 1);
    setIndex(0);
    setFlipped(false);
  };
  const toggleHide = (on) => {
    setHideKnown(on);
    setIndex(0);
    setFlipped(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      const key = e.key;
      if (key === " ") {
        // Buttons and links handle Space natively; elsewhere stop the page scrolling.
        if (e.target.closest && e.target.closest("button, a, summary")) return;
        e.preventDefault();
        flip();
      } else if (key === "ArrowRight") go(1);
      else if (key === "ArrowLeft") go(-1);
      else if (key === "k" || key === "K") mark("known");
      else if (key === "r" || key === "R") mark("review");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const cardStatus = card ? status[card.id] : null;

  return (
    <div>
      <div className="pt-pills" role="group" aria-label="Filter by topic">
        {[ALL, ...TOPICS].map((t) => (
          <button
            key={t}
            type="button"
            className={`pt-pill${topic === t ? " is-active" : ""}`}
            aria-pressed={topic === t}
            onClick={() => pickTopic(t)}
          >
            {t} <span className="pt-pill__n">{COUNTS[t]}</span>
          </button>
        ))}
      </div>

      <div className="pt-options">
        <div className="pt-seg" role="group" aria-label="Front shows">
          <span className="pt-seg__label">front shows</span>
          {[
            ["name", "pattern name"],
            ["when", "when to use"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`pt-seg__btn${front === val ? " is-active" : ""}`}
              aria-pressed={front === val}
              onClick={() => setFront(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="pt-check">
          <input type="checkbox" checked={shuffled} onChange={(e) => toggleShuffle(e.target.checked)} />
          shuffle
        </label>
        <label className="pt-check">
          <input type="checkbox" checked={hideKnown} onChange={(e) => toggleHide(e.target.checked)} />
          hide known
        </label>
      </div>

      <div className="pt-progress">
        <p className="pt-progress__text">
          {progress.known} / {progress.total} known in {topicLabel}
        </p>
        <div
          className="pt-bar"
          role="progressbar"
          aria-label={`Known in ${topicLabel}`}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.known}
        >
          <div className="pt-bar__fill" style={{ width: `${progress.pct}%` }} />
        </div>
      </div>

      {card ? (
        <>
          <div
            className={`pt-card${flipped ? " is-flipped" : ""}`}
            tabIndex={0}
            role="group"
            aria-roledescription="flashcard"
            aria-label={`Card ${pos + 1} of ${deck.length}, ${flipped ? "back" : "front"}`}
            onClick={flip}
          >
            <div className="pt-card__head">
              <span className="pt-dot pt-dot--r" />
              <span className="pt-dot pt-dot--y" />
              <span className="pt-dot pt-dot--g" />
              <span className="pt-card__path">~/patterns/{pad2(card.id)}.md</span>
              {cardStatus && (
                <span className={`pt-state pt-state--${cardStatus}`}>
                  {cardStatus === "known" ? "known" : "review"}
                </span>
              )}
              <span className="pt-card__topic">{card.topic}</span>
            </div>

            {!flipped ? (
              <div className="pt-front">
                {front === "name" ? (
                  <>
                    <h2 className="pt-front__name">{card.name}</h2>
                    <p className="pt-front__prompt">
                      When do you reach for this? What's the key idea and the complexity?
                    </p>
                  </>
                ) : (
                  <>
                    <p className="pt-h">WHEN TO USE</p>
                    <p className="pt-front__when">{card.whenToUse}</p>
                    <p className="pt-front__prompt">Which pattern is this? What's the key idea?</p>
                  </>
                )}
                <p className="pt-front__hint">click or press Space to flip</p>
              </div>
            ) : (
              <div className="pt-back">
                <h2 className="pt-back__name">{card.name}</h2>
                <div className="pt-back__cols">
                  <div>
                    <p className="pt-h">WHEN TO USE</p>
                    <p className="pt-back__p">{card.whenToUse}</p>
                    <p className="pt-h">KEY IDEA</p>
                    <p className="pt-back__p">{card.keyIdea}</p>
                    <p className="pt-cx">{card.complexity}</p>
                  </div>
                  <div className="pt-back__code" onClick={(e) => e.stopPropagation()}>
                    <p className="pt-h">PYTHON TEMPLATE</p>
                    <Code code={card.code} />
                  </div>
                </div>
                <p className="pt-h">PRACTISE (NEETCODE 250)</p>
                <div className="pt-chips">
                  {card.problems.map((p) => (
                    <span key={p} className="pt-chip">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-controls">
            <button type="button" className="pt-btn" onClick={() => go(-1)}>
              ← prev
            </button>
            <span className="pt-count" aria-live="polite">
              {pos + 1} / {deck.length}
            </span>
            <button type="button" className="pt-btn" onClick={() => go(1)}>
              next →
            </button>
            <button type="button" className="pt-btn pt-btn--flip" onClick={flip}>
              {flipped ? "show front" : "flip"}
            </button>
            <button type="button" className="pt-btn pt-btn--review" onClick={() => mark("review")}>
              review again
            </button>
            <button type="button" className="pt-btn pt-btn--known" onClick={() => mark("known")}>
              got it
            </button>
          </div>
        </>
      ) : (
        <div className="pt-empty">
          <p>Every card in {topicLabel} is marked known. Nice.</p>
          <button type="button" className="pt-btn" onClick={() => toggleHide(false)}>
            show them again
          </button>
        </div>
      )}

      <div className="pt-foot">
        <p className="pt-keys">Space flip · ← → move · K got it · R review again</p>
        <button type="button" className="pt-btn pt-btn--ghost" onClick={() => setStatus({})}>
          reset progress
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
