import React, { useEffect, useRef, useState } from 'react';

/** Clipboard write that also works where `navigator.clipboard` is not available (plain http, old browsers). */
export const copyToClipboard = async text => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the old way */
  }

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
};

/**
 * A small button that copies `text` and says so: the copy icon turns into a
 * check that draws itself, and "Copied" slides out beside it for a couple of
 * seconds. If the browser refuses, it says "Could not copy" instead. The state
 * is also announced to screen readers.
 */
export const CopyButton = ({ text, label = 'Copy', className = '' }) => {
  const [state, setState] = useState('idle'); // idle | copied | failed
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyToClipboard(text);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), ok ? 2000 : 3000);
  };

  const message = state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not copy' : '';

  return (
    <>
      <button
        type="button"
        className={`CopyButton ${state !== 'idle' ? `is-${state}` : ''} ${className}`}
        onClick={copy}
        aria-label={state === 'copied' ? 'Copied' : label}
        title={state === 'idle' ? label : undefined}
      >
        <span className="CopyButton-Icon" aria-hidden="true">
          <svg className="CopyButton-Copy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
          </svg>
          <svg className="CopyButton-Check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="CopyButton-Label" aria-hidden="true">
          {message}
        </span>
      </button>
      <span className="sr-only" role="status">
        {message}
      </span>
    </>
  );
};
