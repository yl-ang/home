import React, { useEffect, useState } from "react";
import GradientASCII from "./GradientASCII";
import "./SiteBackground.css";

const COLORS = ["#0b1020", "#1e3fd8", "#38bdf8", "#a5d8ff"];

// Glyph size follows the viewport so the pattern keeps its density on 1440p/4K/ultrawide
const cellSizeFor = (width) => Math.min(30, Math.max(12, Math.round(width / 90)));

const SiteBackground = () => {
  const [cellSize, setCellSize] = useState(() => cellSizeFor(window.innerWidth));

  useEffect(() => {
    const onResize = () => setCellSize(cellSizeFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="site-background" aria-hidden="true">
      <GradientASCII
        colors={COLORS}
        shape="rise"
        cellSize={cellSize}
        glow={0.15}
        glyphOpacity={0.6}
        gradientOpacity={0.55}
      />
    </div>
  );
};

export default SiteBackground;
