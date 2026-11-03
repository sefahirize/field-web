import { describe, it, expect } from 'vitest';
import { dayLabel, entryDelta, entryKind, entryTitle, formatDelta, groupByDay } from './ledger';

const NOW = new Date(2026, 9, 12, 15, 0); // 12 Oct 2026, local
const at = (day, hour = 10) => new Date(2026, 9, day, hour, 0).toISOString();

describe('ledger', () => {
  it('reads the sign from the balance movement, then from amount', () => {
    expect(entryDelta({ balance_before: 10, balance_after: 9, amount: -1 })).toBe(-1);
    expect(entryDelta({ balance_before: 0, balance_after: 0, amount: 5 })).toBe(5);
    expect(formatDelta({ balance_before: 0, balance_after: 100 })).toBe('+100');
    expect(formatDelta({ balance_before: 10, balance_after: 9 })).toBe('−1');
  });

  it('picks an icon kind by type, then by direction', () => {
    expect(entryKind({ type: 'usage' })).toBe('spend');
    expect(entryKind({ type: 'cross_usage' })).toBe('swap');
    expect(entryKind({ type: 'welcome_bonus' })).toBe('gift');
    expect(entryKind({ type: 'purchase', balance_before: 0, balance_after: 500 })).toBe('add');
    expect(entryKind({ type: 'adjustment', balance_before: 5, balance_after: 1 })).toBe('spend');
  });

  it('names an entry without saying its type twice', () => {
    expect(entryTitle({ type: 'welcome_bonus', description: 'Welcome bonus credits' })).toEqual({
      title: 'Welcome bonus credits',
      type: null,
    });
    expect(entryTitle({ type: 'usage', description: 'Parsed cv.pdf' })).toEqual({ title: 'Parsed cv.pdf', type: 'Usage' });
    expect(entryTitle({ type: 'usage' })).toEqual({ title: 'Usage', type: null });
  });

  it('labels days, and groups entries by day in order', () => {
    expect(dayLabel(at(12), NOW)).toBe('Today');
    expect(dayLabel(at(11), NOW)).toBe('Yesterday');
    expect(dayLabel(at(8), NOW)).toMatch(/Oct 8/);
    expect(dayLabel('nope', NOW)).toBe('Earlier');

    const groups = groupByDay(
      [
        { id: 1, created_at: at(12, 14) },
        { id: 2, created_at: at(12, 9) },
        { id: 3, created_at: at(11) },
        { id: 4, created_at: at(3) },
      ],
      NOW,
    );
    expect(groups.map(g => [g.label, g.entries.length])).toEqual([
      ['Today', 2],
      ['Yesterday', 1],
      [expect.stringMatching(/Oct 3/), 1],
    ]);
  });
});
