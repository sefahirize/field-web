import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { TypedLine, useTypewriter } from './Typewriter';

const LINES = [
  { text: 'Hello.', speed: 50 },
  { text: 'World', speed: 50, pause: 100 },
];

const Demo = () => {
  const { typed, active, animated } = useTypewriter(LINES, { startDelay: 100 });
  return (
    <>
      <TypedLine className="a" text={LINES[0].text} typed={typed[0]} cursor={animated && active === 0} />
      <TypedLine className="b" text={LINES[1].text} typed={typed[1]} cursor={animated && (active === 1 || active === -1)} />
    </>
  );
};

// The typed text, without the cursor's underscore.
const live = () =>
  Array.from(document.querySelectorAll('.Typed-Live')).map(node => node.firstChild?.nodeType === 3 ? node.firstChild.textContent : '');
const mockMotion = reduce => {
  window.matchMedia = vi.fn().mockImplementation(() => ({ matches: reduce, addEventListener() {}, removeEventListener() {} }));
};

afterEach(() => vi.useRealTimers());

describe('Typewriter', () => {
  it('waits until a background tab is looked at before it starts typing', () => {
    vi.useFakeTimers();
    mockMotion(false);
    let state = 'hidden';
    vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => state);
    render(<Demo />);

    act(() => vi.advanceTimersByTime(2000));
    expect(live()).toEqual(['', '']);

    state = 'visible';
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => vi.advanceTimersByTime(400));
    expect(live()[0].length).toBeGreaterThan(0);
  });

  it('starts empty, types the first line, then the second, and rests on a cursor', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    mockMotion(false);
    render(<Demo />);

    expect(live()).toEqual(['', '']);
    expect(document.querySelector('.a .Typed-Caret')).not.toBeNull();

    act(() => vi.advanceTimersByTime(130));
    expect(live()[0].length).toBeGreaterThan(0);
    expect(live()[0].length).toBeLessThan('Hello.'.length);

    // Advance in small steps so React renders between keystrokes, as a clock would.
    for (let i = 0; i < 80; i += 1) act(() => vi.advanceTimersByTime(50));
    expect(live()[0]).toBe('Hello.');
    expect(live()[1]).toBe('World');
    // finished: the cursor has left the first line and rests on the last
    expect(document.querySelector('.a .Typed-Caret')).toBeNull();
    expect(document.querySelector('.b .Typed-Caret')).not.toBeNull();
  });

  it('keeps the whole text for screen readers and as an invisible spacer from the start', () => {
    vi.useFakeTimers();
    mockMotion(false);
    render(<Demo />);
    expect(screen.getByText('Hello.', { selector: '.sr-only' })).toBeInTheDocument();
    expect(document.querySelector('.a .Typed-Ghost')).toHaveTextContent('Hello.');
  });

  it('types once per page load: moving on and coming back shows the text at once, with no cursor', () => {
    vi.useFakeTimers();
    mockMotion(false);
    const Once = () => {
      const { typed, active, animated } = useTypewriter(LINES, { startDelay: 100, onceKey: 'intro-test' });
      return <TypedLine text={LINES[0].text} typed={typed[0]} cursor={animated && active === 0} />;
    };

    const first = render(<Once />);
    for (let i = 0; i < 80; i += 1) act(() => vi.advanceTimersByTime(50));
    first.unmount();

    render(<Once />);
    expect(document.querySelector('.Typed-Live')).toHaveTextContent('Hello.');
    expect(document.querySelector('.Typed-Caret')).toBeNull();
  });

  it('does not animate for people who prefer reduced motion', () => {
    mockMotion(true);
    render(<Demo />);
    expect(live()).toEqual(['Hello.', 'World']);
    expect(document.querySelector('.Typed-Caret')).toBeNull();
  });
});
