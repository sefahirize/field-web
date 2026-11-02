import React, { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

// Which intros have been typed since the page loaded. Kept in memory, not in
// storage: moving between screens inside the app does not retype, but loading the
// page again (a refresh, a new visit) does.
const typedKeys = new Set();
const readSeen = key => Boolean(key) && typedKeys.has(key);
const writeSeen = key => {
  if (key) typedKeys.add(key);
};

/**
 * Types `lines` out one after another, from nothing, a character at a time — a
 * little uneven, like a person. Returns how much of each line has been typed and
 * which line is being typed (`active`, or -1 once all are done), and `animated`
 * (false when the user asked for reduced motion).
 *
 * For people who ask for reduced motion nothing animates: the text is simply there.
 * With `onceKey`, it types once per page load; moving between the sign-in, sign-up
 * and reset screens afterwards shows the text at once instead of retyping it,
 * while a refresh types it again.
 *
 * `lines`: `[{ text, speed? (ms per character), pause? (ms before the line starts) }]`
 */
export const useTypewriter = (lines, { startDelay = 500, onceKey } = {}) => {
  const skip = () => prefersReducedMotion() || readSeen(onceKey);
  const [typed, setTyped] = useState(() => (skip() ? lines.map(l => l.text) : lines.map(() => '')));
  const [active, setActive] = useState(() => (skip() ? -1 : 0));
  const [animated] = useState(() => !skip());
  const signature = lines.map(line => line.text).join('\u0000');

  useEffect(() => {
    if (skip()) {
      setTyped(lines.map(line => line.text));
      setActive(-1);
      return undefined;
    }

    setTyped(lines.map(() => ''));
    setActive(0);

    let timer;
    let line = 0;
    let char = 0;

    const step = () => {
      const { text, speed = 55 } = lines[line];
      char += 1;
      // Copied out before queueing: React runs the updater later, by which time
      // `line` and `char` may already have moved on to the next line.
      const at = line;
      const upto = char;
      setTyped(current => current.map((value, index) => (index === at ? text.slice(0, upto) : value)));

      if (char < text.length) {
        // A human rhythm: each key a little early or late, a longer beat after punctuation.
        const beat = /[.,]/.test(text[char - 1]) ? 260 : 0;
        timer = setTimeout(step, speed * (0.6 + Math.random() * 0.8) + beat);
        return;
      }

      if (line + 1 < lines.length) {
        line += 1;
        char = 0;
        setActive(line);
        timer = setTimeout(step, lines[line].pause ?? 400);
      } else {
        setActive(-1);
        writeSeen(onceKey);
      }
    };

    const begin = () => {
      timer = setTimeout(step, startDelay + (lines[0]?.pause ?? 0));
    };

    // A tab opened in the background is not typed into: browsers slow its timers
    // to a crawl. Start when it is first looked at.
    let onVisible;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      onVisible = () => {
        if (document.visibilityState !== 'visible') return;
        document.removeEventListener('visibilitychange', onVisible);
        begin();
      };
      document.addEventListener('visibilitychange', onVisible);
    } else {
      begin();
    }

    return () => {
      clearTimeout(timer);
      if (onVisible) document.removeEventListener('visibilitychange', onVisible);
    };
  }, [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  // With reduced motion, or text already typed this session, it just appears: no cursor to rest on.
  return { typed, active, animated };
};

/**
 * One typed line. An invisible copy of the whole text holds the space, so the
 * layout does not jump as it grows or reflow when it wraps; the typed text sits
 * on top of it, ending in a blinking underscore while it is the line being typed
 * (and on the last line, afterwards, as a resting cursor). Screen readers get the
 * finished text straight away.
 */
export const TypedLine = ({ text, typed, cursor, className = '' }) => (
  <span className={`Typed ${className}`}>
    <span className="sr-only">{text}</span>
    <span className="Typed-Ghost" aria-hidden="true">
      {text}
    </span>
    <span className="Typed-Live" aria-hidden="true">
      {typed}
      {cursor && <span className="Typed-Caret">_</span>}
    </span>
  </span>
);
