import { describe, it, expect } from 'vitest';
import { timeAgo } from './time';

const NOW = new Date('2026-10-12T12:00:00Z').getTime();
const ago = ms => new Date(NOW - ms).toISOString();

describe('timeAgo', () => {
  it('speaks in minutes, hours and days for the first week', () => {
    expect(timeAgo(ago(10 * 1000), NOW)).toBe('just now');
    expect(timeAgo(ago(5 * 60 * 1000), NOW)).toMatch(/5 minutes ago/);
    expect(timeAgo(ago(3 * 3600 * 1000), NOW)).toMatch(/3 hours ago/);
    expect(timeAgo(ago(26 * 3600 * 1000), NOW)).toMatch(/yesterday/);
    expect(timeAgo(ago(3 * 86400 * 1000), NOW)).toMatch(/3 days ago/);
  });

  it('gives the date from a week on, and a dash when there is none', () => {
    expect(timeAgo(ago(10 * 86400 * 1000), NOW)).toMatch(/2026/);
    expect(timeAgo(null, NOW)).toBe('—');
    expect(timeAgo('not a date', NOW)).toBe('—');
  });
});
