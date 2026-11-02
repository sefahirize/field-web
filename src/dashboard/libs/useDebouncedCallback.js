import { useEffect, useMemo, useRef } from 'react';

/**
 * `callback`, called `wait` ms after the last call with that call's arguments.
 * `.cancel()` drops a pending call. The returned function keeps its identity
 * and always runs the latest `callback`. A pending call is dropped on unmount.
 *
 * Covers the one use the app had for the `use-debounce` package (trailing
 * calls only), so that dependency is not needed.
 */
export const useDebouncedCallback = (callback, wait) => {
  const latest = useRef(callback);
  const timer = useRef(null);

  useEffect(() => {
    latest.current = callback;
  });

  const debounced = useMemo(() => {
    const run = (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => latest.current(...args), wait);
    };
    run.cancel = () => clearTimeout(timer.current);
    return run;
  }, [wait]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return debounced;
};
