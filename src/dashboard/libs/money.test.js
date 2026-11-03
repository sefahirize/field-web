import { describe, it, expect } from 'vitest';
import { money } from './money';

describe('money', () => {
  it('shows prices in US dollars with two decimals', () => {
    expect(money(12.5)).toBe('$12.50');
    expect(money(250000)).toBe('$250,000.00');
    expect(money('0.8')).toBe('$0.80');
  });

  it('treats a missing amount as zero', () => {
    expect(money(null)).toBe('$0.00');
    expect(money(undefined)).toBe('$0.00');
  });
});
