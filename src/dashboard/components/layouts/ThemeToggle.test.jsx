import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LAYOUT_STORAGE_KEY, ThemeModeProvider } from '@dashboard/libs/themeMode';
import { ThemeToggle } from './ThemeToggle';

const setup = () =>
  render(
    <ThemeModeProvider>
      <ThemeToggle />
    </ThemeModeProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.layout;
});

describe('layout choice', () => {
  it('is classic until the user picks the rail, and remembers the pick', async () => {
    setup();
    expect(document.documentElement.dataset.layout).toBe('classic');

    await userEvent.click(screen.getByRole('button', { name: /Change theme/ }));
    await userEvent.click(screen.getByRole('menuitemradio', { name: /Rail/ }));

    expect(document.documentElement.dataset.layout).toBe('rail');
    expect(localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe('rail');
  });

  it('starts from what was saved, and marks it in the menu', async () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, 'rail');
    setup();
    expect(document.documentElement.dataset.layout).toBe('rail');

    await userEvent.click(screen.getByRole('button', { name: /Change theme/ }));
    expect(screen.getByRole('menuitemradio', { name: /Rail/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: /Classic/ })).toHaveAttribute('aria-checked', 'false');
  });

  it('ignores a saved value it does not know', () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, 'sideways');
    setup();
    expect(document.documentElement.dataset.layout).toBe('classic');
  });
});
