import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeModeProvider, THEME_STORAGE_KEY, applyTheme, readPreference, resolveTheme } from './themeMode';
import { ThemeToggle } from '@dashboard/components/layouts/ThemeToggle';

const mockMatchMedia = dark => {
  const listeners = new Set();
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: dark.current,
    addEventListener: (_, fn) => listeners.add(fn),
    removeEventListener: (_, fn) => listeners.delete(fn),
  }));
  return listeners;
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mockMatchMedia({ current: false });
});

describe('theme mode', () => {
  it('is light unless someone chooses otherwise, even on a dark device', () => {
    mockMatchMedia({ current: true });
    expect(readPreference()).toBe('light');
    expect(resolveTheme('light')).toBe('light');

    render(
      <ThemeModeProvider>
        <ThemeToggle />
      </ThemeModeProvider>,
    );
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('resolves system from the device', () => {
    mockMatchMedia({ current: true });
    expect(resolveTheme('system')).toBe('dark');
    mockMatchMedia({ current: false });
    expect(resolveTheme('system')).toBe('light');
  });

  it('ignores a stored value it does not know', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    expect(readPreference()).toBe('light');
  });

  it('applies and remembers a choice made in the toggle', async () => {
    render(
      <ThemeModeProvider>
        <ThemeToggle />
      </ThemeModeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /theme: light/i }));
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Dark' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(screen.getByRole('button', { name: /theme: dark/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /theme: dark/i }));
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Light' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('follows the device while on system', async () => {
    const dark = { current: false };
    const listeners = mockMatchMedia(dark);
    localStorage.setItem(THEME_STORAGE_KEY, 'system');

    render(
      <ThemeModeProvider>
        <ThemeToggle />
      </ThemeModeProvider>,
    );
    expect(document.documentElement.dataset.theme).toBe('light');

    dark.current = true;
    listeners.forEach(fn => fn());
    expect(await screen.findByRole('button', { name: /theme: system/i })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('picks up a change made in another tab', () => {
    render(
      <ThemeModeProvider>
        <ThemeToggle />
      </ThemeModeProvider>,
    );
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    fireEvent(window, new StorageEvent('storage', { key: THEME_STORAGE_KEY }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('applyTheme sets the attribute', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
