import React, { useState } from "react";
import Flashcards from "./Flashcards";
import SpotPattern from "./SpotPattern";
import { PATTERNS } from "./patternsData";
import "./Patterns.css";

const TABS = [
  { id: "flashcards", label: "flashcards" },
  { id: "spot", label: "spot the pattern" },
];

const Patterns = () => {
  const [tab, setTab] = useState("flashcards");
  // jump.nonce lets the same card be requested twice in a row.
  const [jump, setJump] = useState(null);

  const handleJump = (id) => {
    setJump({ id, nonce: Date.now() });
    setTab("flashcards");
  };

  return (
    <main className="pt" aria-labelledby="pt-heading">
      <div className="pt__inner">
        <p className="pt__label">{"// patterns/"}</p>
        <h1 id="pt-heading" className="pt__heading">LeetCode Patterns</h1>
        <p className="pt__sub">
          {PATTERNS.length} patterns from the NeetCode 250, as flashcards. Pick a topic, guess the idea,
          flip to check, and mark what sticks.
        </p>

        <div className="pt-tabs" role="tablist" aria-label="Patterns views">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`pt-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`pt-panel-${t.id}`}
              className={`pt-tab${tab === t.id ? " is-active" : ""}`}
              onClick={() => {
                setJump(null);
                setTab(t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id={`pt-panel-${tab}`} role="tabpanel" aria-labelledby={`pt-tab-${tab}`}>
          {tab === "flashcards" ? (
            <Flashcards jump={jump} />
          ) : (
            <SpotPattern onJump={handleJump} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Patterns;
