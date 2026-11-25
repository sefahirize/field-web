"use client";

import { useEffect, useRef, useState } from "react";

import { CardIcon, FilledIcon } from "../icons";
import s from "../site.module.css";
import { REDUCED_MOTION, useMediaQuery } from "../useMediaQuery";
import p from "./pipeline.module.css";
import { STEP_COUNT, STEP_MS, fillAt, scrollProgress, scrollTopFor, stepAt } from "./pipeline-math";

/** Must match the media query in pipeline.module.css. */
const PIN_QUERY = "(min-width: 960px) and (max-height: 1499px)";

const STEPS = [
  {
    n: "01",
    title: "Upload",
    text: "Drop files in the dashboard or send them to POST /process with an API key.",
    layer: "LAYER 01 · THE PAGE AS SENT",
    status: "PENDING",
    color: "#A9B4C6",
  },
  {
    n: "02",
    title: "Read",
    text: "Field finds the text on every page, scans and photos included, in reading order.",
    layer: "LAYER 02 · TEXT BLOCKS",
    status: "PROCESSING",
    color: "#F2B661",
  },
  {
    n: "03",
    title: "Extract",
    text: "The product you chose, CV Parser here, turns that text into named fields.",
    layer: "LAYER 03 · FIELDS",
    status: "PROCESSING",
    color: "#F2B661",
  },
  {
    n: "04",
    title: "Deliver",
    text: "JSON comes back to your code and the file lands in Documents, with its credit in Credit history.",
    layer: "LAYER 04 · JSON",
    status: "COMPLETED",
    color: "#5FD39A",
  },
];

const K = ({ children }: { children: string }) => <span className={p.key}>{children}</span>;

/** What the right-hand panel shows at each step. */
const OUTPUTS = [
  {
    label: "REQUEST",
    code: (
      <>
        <K>POST</K> /api/v1/process{"\n"}X-API-Key: ••••••••••••••••{"\n\n"}
        {"{\n"}
        {'  "product_key": "cv_parser",\n'}
        {'  "file_name":   "jane-doe-cv.pdf",\n'}
        {'  "data":        "JVBERi0xLjcKJc…"\n'}
        {"}"}
      </>
    ),
  },
  {
    label: "READING THE PAGES",
    code: "pages           2\ntext blocks     46\ncolumns         2\ntables          0\nreading order   top → bottom\nlanguage        en",
  },
  {
    label: "FIELDS FOUND",
    code: (
      <>
        {"{\n  "}
        <K>&quot;name&quot;</K>
        {':  "Jane Doe",\n  '}
        <K>&quot;title&quot;</K>
        {': "Data Engineer",\n  '}
        <K>&quot;email&quot;</K>
        {': "jane.doe@example.com",\n  '}
        <K>&quot;experience&quot;</K>
        {": [ 3 roles ],\n  "}
        <K>&quot;skills&quot;</K>
        {': ["SQL", "Python", "dbt", …]\n}'}
      </>
    ),
  },
  {
    label: "RESPONSE · 200 OK",
    short: true,
    code: (
      <>
        {"{\n  "}
        <K>&quot;success&quot;</K>
        {": true,\n  "}
        <K>&quot;is_cached&quot;</K>
        {": false,\n  "}
        <K>&quot;data&quot;</K>
        {': { "status": "completed", … }\n}'}
      </>
    ),
  },
];

const FIELDS = [
  { label: "name", left: 14, top: 16 },
  { label: "title", left: 96, top: 36 },
  { label: "email", left: 14, top: 64 },
  { label: "experience", left: 30, top: 110 },
  { label: "skills", left: 14, top: 168 },
];

/**
 * "How Field works". Pinned (desktop window): the scroll position picks the
 * step and a click scrolls to it. Otherwise: it plays by itself while on
 * screen, one step every STEP_MS, and a click picks a step and pauses.
 */
export const Pipeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  // Null until the visitor presses Pause or Play, or picks a step.
  const [choice, setChoice] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const pinned = useMediaQuery(PIN_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  // With reduced motion it waits for the visitor instead of playing.
  const playing = choice ?? !reducedMotion;

  // Pinned: follow the scroll, at most once a frame.
  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const next = scrollProgress(box.top, box.height, window.innerHeight);
      if (next === null) return;
      setProgress(next);
      setStep(stepAt(next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pinned]);

  // Not pinned: play only while the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = !pinned && playing && inView;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep(current => (current + 1) % STEP_COUNT), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, step]);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (pinned && el) {
      const run = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: scrollTopFor(top, run, i), behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }
    setStep(i);
    setChoice(false);
  };

  // Arrow keys move along the steps (a vertical tab list).
  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowDown: step + 1,
      ArrowRight: step + 1,
      ArrowUp: step - 1,
      ArrowLeft: step - 1,
      Home: 0,
      End: STEP_COUNT - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + STEP_COUNT) % STEP_COUNT;
    goTo(next);
    tabRefs.current[next]?.focus();
  };

  const barFor = (i: number): { className: string; width?: string } => {
    if (pinned) return { className: p.barFill, width: `${Math.round(fillAt(progress, i) * 100)}%` };
    if (i < step) return { className: p.barFill, width: "100%" };
    if (i > step) return { className: p.barFill, width: "0%" };
    if (running) return { className: `${p.barFill} ${p.barRun}` };
    return { className: p.barFill, width: playing ? "0%" : "100%" };
  };

  const layer = (i: number) =>
    [p.layer, p[`l${i}`], step >= i && p.on, step === i && p.current, i === 0 && step === 0 && p.drop]
      .filter(Boolean)
      .join(" ");

  const current = STEPS[step];
  const output = OUTPUTS[step];

  return (
    <section id="how" ref={sectionRef} className={`${p.section} ${s.accentTop}`} data-reveal="line">
      <div className={p.stage}>
        <div className={p.frame}>
          <div className={p.head}>
            <div className={p.headCopy}>
              <div className={`${s.eyebrow} ${s.eyebrowOnDark}`} data-reveal>
                How Field works
              </div>
              <h2 className={p.title} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
                Watch a CV come apart
                <br />
                into data
              </h2>
            </div>
            <div className={p.headSide} data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <p>Every file goes through the same four layers. Scroll, or pick a step, to lift each one off the page.</p>
              <div className={p.counter}>
                <span aria-live="polite">
                  <span key={step} className={p.counterNum}>
                    {current.n}
                  </span>{" "}
                  <small>/ 04</small>
                </span>
                {!pinned && (
                  <button
                    type="button"
                    className={`${s.btn} ${s.btnGhost} ${p.play}`}
                    onClick={() => setChoice(!playing)}
                    aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
                  >
                    {playing ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M3 1.5l7 4.5-7 4.5z" fill="currentColor" />
                        </svg>
                        Play
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={p.body}>
            <div className={p.steps} role="tablist" aria-label="Pipeline steps" aria-orientation="vertical" onKeyDown={onKeyDown}>
              {STEPS.map((item, i) => {
                const bar = barFor(i);
                return (
                  <button
                    key={item.n}
                    ref={el => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`how-tab-${i}`}
                    aria-selected={step === i}
                    aria-controls="how-panel"
                    tabIndex={step === i ? 0 : -1}
                    className={p.step}
                    onClick={() => goTo(i)}
                  >
                    <span className={p.stepRow}>
                      <span className={p.stepNum}>{item.n}</span>
                      <span className={p.stepText}>
                        <span className={p.stepTitle}>{item.title}</span>
                        <span className={p.stepDesc}>{item.text}</span>
                      </span>
                    </span>
                    <span className={p.bar} aria-hidden="true">
                      <span
                        key={bar.className.includes(p.barRun) ? `run-${step}` : "static"}
                        className={bar.className}
                        style={bar.width ? { width: bar.width } : undefined}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={p.canvas} data-step={step}>
              <div className={p.stack} aria-hidden="true">
                <div className={layer(0)}>
                  <div className={p.avatar}>
                    <span />
                    <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ width: 78, height: 6, background: "#374151" }} />
                      <span style={{ width: 52, height: 4, background: "#9AA6B8" }} />
                    </span>
                  </div>
                  <div className={p.page} style={{ top: 58 }}>
                    <span />
                    <span style={{ width: "86%" }} />
                    <span style={{ width: "64%" }} />
                  </div>
                  <div className={p.page} style={{ top: 96 }}>
                    <span style={{ width: 44, height: 5, background: "#6B778C" }} />
                    <span />
                    <span style={{ width: "92%" }} />
                    <span style={{ width: "78%" }} />
                    <span style={{ width: "88%" }} />
                  </div>
                  <div className={p.page} style={{ top: 160 }}>
                    <span style={{ width: 36, height: 5, background: "#6B778C" }} />
                    <span style={{ display: "flex", gap: 5, height: "auto", background: "none" }}>
                      {[30, 40, 24, 34].map(w => (
                        <span key={w} style={{ width: w, height: 10, background: "#DCE3EE" }} />
                      ))}
                    </span>
                  </div>
                  <div className={p.upload}>
                    <i />
                  </div>
                  <div className={p.beam} />
                  <span className={p.layerTag}>01 PAGE</span>
                </div>

                <div className={layer(1)}>
                  <span className={p.block} style={{ left: 12, top: 12, width: 108, height: 34 }} />
                  <span className={p.block} style={{ left: 12, top: 54, right: 12, height: 26 }} />
                  <span className={p.block} style={{ left: 12, top: 92, right: 12, height: 54 }} />
                  <span className={p.block} style={{ left: 12, top: 156, right: 40, height: 28 }} />
                  <span className={p.layerTag}>02 TEXT</span>
                </div>

                <div className={layer(2)}>
                  {FIELDS.map((field, i) => (
                    <span
                      key={field.label}
                      className={p.chip}
                      style={{ left: field.left, top: field.top, "--i": i } as React.CSSProperties}
                    >
                      <b>{i + 1}</b>
                      {field.label}
                    </span>
                  ))}
                  <span className={p.layerTag}>03 FIELDS</span>
                </div>

                <div className={layer(3)}>
                  <div className={p.json}>
                    <span>{"{"}</span>
                    <span data-indent>
                      <K>&quot;name&quot;</K>: &quot;Jane Doe&quot;,
                    </span>
                    <span data-indent>
                      <K>&quot;title&quot;</K>: &quot;Data Engineer&quot;,
                    </span>
                    <span data-indent>
                      <K>&quot;email&quot;</K>: &quot;jane@…&quot;,
                    </span>
                    <span data-indent>
                      <K>&quot;experience&quot;</K>: [3],
                    </span>
                    <span data-indent>
                      <K>&quot;skills&quot;</K>: [6]
                    </span>
                    <span>{"}"}</span>
                  </div>
                  <span className={p.layerTag}>04 JSON</span>
                </div>
              </div>
              <div className={p.layerName}>{current.layer}</div>
            </div>

            <div className={p.panel} id="how-panel" role="tabpanel" aria-labelledby={`how-tab-${step}`}>
              <div className={p.file}>
                <div className={p.fileName}>
                  <img src="/assets/icons/products/cv-parser.png" alt="" width={28} height={28} />
                  <span>
                    <b>jane-doe-cv.pdf</b>
                    <small>CV Parser · 2 pages · 412 KB</small>
                  </span>
                </div>
                <span
                  className={p.status}
                  style={{ "--st": current.color } as React.CSSProperties}
                  data-busy={current.status === "PROCESSING" ? "" : undefined}
                >
                  {current.status}
                </span>
              </div>

              <div key={step} className={p.out}>
                <div className={p.outLabel}>{output.label}</div>
                <pre className={`${p.code} ${output.short ? p.codeShort : ""}`}>{output.code}</pre>
                {step === 3 && (
                  <div className={p.tiles}>
                    <div className={p.tile} style={{ "--i": 0 } as React.CSSProperties}>
                      <FilledIcon name="document" size={18} color="#8FB0FF" />
                      <span>
                        <b>Documents</b>
                        <small>Completed</small>
                      </span>
                    </div>
                    <div className={p.tile} style={{ "--i": 1 } as React.CSSProperties}>
                      <CardIcon />
                      <span>
                        <b>Credit history</b>
                        <small>CV Parser −1</small>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
