import React from "react";

const CHARS = "01$#%&XxS58";
const CELL = 26;
const FRAME_MS = 140;

// Sparse falling-characters backdrop. Throttled, paused offscreen/hidden,
// and drawn once (static) when the user prefers reduced motion.
const MatrixBackdrop = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let drops = [];
    let timer = null;
    let visible = true;

    const glyph = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w;
      canvas.height = h;
      cols = Math.ceil(w / CELL);
      drops = Array.from({ length: cols }, () => Math.random() * (h / CELL));
      ctx.font = "16px ui-monospace, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(0,0,0,0)";
    };

    const draw = () => {
      ctx.fillStyle = "rgba(5, 7, 15, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(96, 165, 250, 0.45)";
      for (let i = 0; i < cols; i++) {
        if (Math.random() < 0.55) continue; // keep it sparse
        ctx.fillText(glyph(), i * CELL, drops[i] * CELL);
        if (drops[i] * CELL > canvas.height && Math.random() > 0.9) drops[i] = 0;
        else drops[i] += 1;
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(96, 165, 250, 0.3)";
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < canvas.height / CELL; j++) {
          if (Math.random() < 0.07) ctx.fillText(glyph(), i * CELL, j * CELL);
        }
      }
    };

    const tick = () => {
      if (visible && !document.hidden) draw();
      timer = window.setTimeout(tick, FRAME_MS);
    };

    resize();
    let observer = null;
    let ro = null;
    if (reduced) {
      drawStatic();
    } else {
      tick();
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
        });
        observer.observe(canvas);
      }
    }
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => {
        resize();
        if (reduced) drawStatic();
      });
      ro.observe(canvas);
    }

    return () => {
      window.clearTimeout(timer);
      if (observer) observer.disconnect();
      if (ro) ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="about__matrix" aria-hidden="true" />;
};

export default MatrixBackdrop;
