/**
 * Trailing-edge debounce with cancel(): the part of lodash/debounce the
 * landing used, without the dependency.
 */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, wait);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  return debounced;
}
