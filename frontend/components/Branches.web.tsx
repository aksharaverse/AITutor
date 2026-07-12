// Generative branch art (à la antfu.me) — web only. A canvas slowly grows
// two hairline branches in from opposite corners, then stops. Native resolves
// Branches.tsx (null) via Metro platform extensions.

import React, { useEffect, useRef } from "react";

import { useTheme } from "@/lib/theme";

type Step = { x: number; y: number; angle: number; depth: number };

export function Branches() {
  const t = useTheme();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 1;
    ctx.strokeStyle = t.dot;

    const r = (n = 1) => Math.random() * n;
    let steps: Step[] = [
      { x: w * 0.92, y: -5, angle: Math.PI / 2 + r(0.4) - 0.2, depth: 0 },
      { x: w * 0.08, y: h + 5, angle: -Math.PI / 2 + r(0.4) - 0.2, depth: 0 },
    ];
    let total = 0;
    let raf = 0;

    function grow(s: Step): Step[] {
      if (!ctx) return [];
      const nx = s.x + Math.cos(s.angle) * (6 + r(4));
      const ny = s.y + Math.sin(s.angle) * (6 + r(4));
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      total++;
      const next: Step[] = [];
      // Young branches always fork so each tree takes shape; older ones fork
      // at 50% each — a critical process that dies out on its own.
      if (s.depth < 5 || r() < 0.5)
        next.push({ x: nx, y: ny, angle: s.angle + r(0.4) - 0.06, depth: s.depth + 1 });
      if (s.depth < 5 || r() < 0.5)
        next.push({ x: nx, y: ny, angle: s.angle - r(0.4) + 0.06, depth: s.depth + 1 });
      return next;
    }

    function frame() {
      const batch = steps.splice(0, 10);
      for (const s of batch) steps.push(...grow(s));
      if (steps.length > 0 && total < 700) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [t.dot]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
