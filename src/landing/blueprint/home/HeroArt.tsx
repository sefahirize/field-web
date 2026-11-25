"use client";

import { useEffect, useRef } from "react";

import { REDUCED_MOTION, useMediaQuery } from "../useMediaQuery";
import h from "./home.module.css";

const AC = { stroke: "var(--ac)" };

// The doc card's text lines, drawn one after another on load.
const DOC_LINES = [
  [295, 157.5, 385, 202.5],
  [280, 165, 360, 205],
  [265, 172.5, 355, 217.5],
  [250, 180, 315, 212.5],
  [230, 190, 315, 232.5],
];

/**
 * The hero's isometric drawing: a page, a table and a chart lifting off a
 * sheet, with a line carrying data up to a JSON tag. The pieces land one by
 * one, then float; with a mouse, they shift a little with the pointer, each
 * by its depth.
 */
export const HeroArt = () => {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest("section");
    if (!el || !hero || !finePointer || reducedMotion) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onMove = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      x = ((event.clientX - box.left) / box.width) * 2 - 1;
      y = ((event.clientY - box.top) / box.height) * 2 - 1;
      schedule();
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      schedule();
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [finePointer, reducedMotion]);

  return (
    <div ref={ref} className={h.art}>
      <svg viewBox="0 0 520 440" role="img" aria-label="Isometric drawing of documents being read into data">
        {/* The sheet */}
        <g className={h.depth1}>
          <g className={h.sheetIn}>
            <polygon points="260,196 480,306 260,416 40,306" fill="#E7EDF8" />
            <polygon points="260,190 480,300 260,410 40,300" fill="#FFFFFF" stroke="#C9D3E6" strokeWidth="1" />
            <path d="M120 300 L 260 230 M 160 320 L 300 250 M 200 340 L 340 270 M 240 360 L 380 290" stroke="#E3E7EE" strokeWidth="1" />
          </g>
        </g>

        {/* The table */}
        <g className={h.depth2}>
          <g className={h.float} style={{ animationDelay: "1.6s" }}>
            <g className={h.cardIn} style={{ animationDelay: "0.35s" }}>
              <polygon points="170,251 280,306 170,361 60,306" fill="#B8C9EE" />
              <polygon points="170,245 280,300 170,355 60,300" fill="#DCE6FF" strokeWidth="1.2" style={AC} />
              <path
                d="M88 286 L198 341 M115 272.5 L225 327.5 M142 259 L252 314 M97 318.5 L207 263.5 M133 336.5 L243 281.5"
                strokeWidth="0.9"
                opacity="0.7"
                style={AC}
              />
            </g>
          </g>
        </g>

        {/* The page */}
        <g className={h.depth3}>
          <g className={h.float} style={{ animationDelay: "2s" }}>
            <g className={h.cardIn} style={{ animationDelay: "0.5s" }}>
              <polygon points="300,143 430,208 300,273 170,208" fill="#B8C9EE" />
              <polygon points="300,135 430,200 300,265 170,200" fill="#EEF3FF" strokeWidth="1.2" style={AC} />
              {DOC_LINES.map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  pathLength={1}
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.55"
                  className={h.write}
                  style={{ ...AC, animationDelay: `${1.05 + i * 0.12}s` }}
                />
              ))}
            </g>
          </g>
        </g>

        {/* The chart */}
        <g className={h.depth2}>
          <g className={h.float} style={{ animationDelay: "2.4s" }}>
            <g className={h.cardIn} style={{ animationDelay: "0.65s" }}>
              <polygon points="380,286 480,336 380,386 280,336" fill="#B8C9EE" />
              <polygon points="380,280 480,330 380,380 280,330" fill="#DCE6FF" strokeWidth="1.2" style={AC} />
              <ellipse cx="380" cy="330" rx="34" ry="17" fill="#FFFFFF" strokeWidth="1.2" style={AC} />
              <path d="M380 330 L414 330 M380 330 L362 316" strokeWidth="1.2" className={h.write} pathLength={1} style={{ ...AC, animationDelay: "1.4s" }} />
            </g>
          </g>
        </g>

        {/* The data line and the JSON tag */}
        <g className={h.depth4}>
          <g className={h.tagIn}>
            <path d="M300 60 L300 120" strokeWidth="1" strokeDasharray="3 4" className={h.flow} style={AC} />
            {/* A bit of data travelling up the line, from the page to the tag. */}
            <rect x="297" y="114" width="6" height="6" className={h.packet} style={{ fill: "var(--ac)" }} />
            <rect x="262" y="30" width="76" height="28" fill="#FFFFFF" strokeWidth="1" style={AC} />
            <text x="300" y="49" textAnchor="middle" fontSize="12" fill="#0F1623" className={h.mono}>
              JSON
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
