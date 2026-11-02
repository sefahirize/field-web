import React, { useLayoutEffect, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';

/**
 * One line of text that ends in "…" instead of breaking the layout, with the
 * whole text in a tooltip — but only when something was actually cut off, so
 * short text does not grow a pointless tooltip. A cut-off line can take focus,
 * so the tooltip is there for the keyboard too. Needs a width to truncate
 * against: put it in a cell or flex item that can shrink (`min-width: 0`).
 */
export const TruncatedText = ({ text, className = '', placement = 'top' }) => {
  const ref = useRef(null);
  const [truncated, setTruncated] = useState(false);
  const value = text === null || text === undefined || text === '' ? '' : String(text);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const measure = () => setTruncated(element.scrollWidth > element.clientWidth + 1);
    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <Tooltip
      title={truncated ? value : ''}
      placement={placement}
      arrow
      enterDelay={250}
      enterTouchDelay={0}
      leaveTouchDelay={4000}
      classes={{ tooltip: 'AppTooltip', arrow: 'AppTooltip-Arrow' }}
    >
      <span ref={ref} className={`Truncate ${className}`} tabIndex={truncated ? 0 : undefined}>
        {value}
      </span>
    </Tooltip>
  );
};
