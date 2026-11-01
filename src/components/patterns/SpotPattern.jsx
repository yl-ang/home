import React from "react";
import { SIGNALS } from "./patternsData";
import { pad2 } from "./patternsLogic";

const TIPS = [
  { n: "1 · recognise", text: "Read the prompt and name the pattern from the signal table before touching code." },
  { n: "2 · recall", text: "Say the key idea and complexity out loud, then sketch the template from memory." },
  { n: "3 · rewrite", text: "Solve one listed problem cold. Redo any miss after 1, 3 and 7 days." },
];

const SpotPattern = ({ onJump }) => (
  <div>
    <div className="pt-tablewrap">
      <table className="pt-table">
        <thead>
          <tr>
            <th scope="col">Signal in the problem</th>
            <th scope="col">Pattern</th>
            <th scope="col">Cards</th>
          </tr>
        </thead>
        <tbody>
          {SIGNALS.map((row) => (
            <tr key={row.signal}>
              <td>{row.signal}</td>
              <td className="pt-table__pattern">{row.pattern}</td>
              <td>
                <div className="pt-chips">
                  {row.cards.map((id) => (
                    <button
                      key={id}
                      type="button"
                      className="pt-chip pt-chip--link"
                      onClick={() => onJump(id)}
                      aria-label={`Open card ${id}`}
                    >
                      #{pad2(id)}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ol className="pt-tips">
      {TIPS.map((t) => (
        <li key={t.n} className="pt-tip">
          <p className="pt-tip__n">{t.n}</p>
          <p className="pt-tip__t">{t.text}</p>
        </li>
      ))}
    </ol>
  </div>
);

export default SpotPattern;
