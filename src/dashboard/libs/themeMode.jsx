import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Light / dark / system.
 *
 * What the user picked is kept in localStorage; what is applied is a
 * `data-theme="light|dark"` attribute on <html>, which the CSS custom properties
 * in styles/_tokens.scss follow. A small script in public/index.html applies it
 * before the first paint so a dark page does not flash white.
 *
 * LIGHT IS THE DEFAULT. Nothing changes for anyone until they choose Dark or
 * System from the header; `DEFAULT_PREFERENCE` is the one place to change that.
 */
export const THEME_STORAGE_KEY = 'joinfield-theme'; // deliberately not `jf_*`: signing out must not reset it
export const DEFAULT_PREFERENCE = 'light';
export const PREFERENCES = ['light', 'dark', 'system'];

/**
 * The layout: "classic" (the standard Mono shell, the default) or "rail" (dark
 * icon-collapsible navigation on a cream ground). Applied as `data-layout` on
 * <html>; styles/Components/Layouts/_Rail.scss does the rest.
 */
export const LAYOUT_STORAGE_KEY = 'joinfield-layout';
export const DEFAULT_LAYOUT = 'classic';
export const LAYOUTS = ['classic', 'rail'];

export const readLayout = () => {
  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return LAYOUTS.includes(stored) ? stored : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
};

export const applyLayout = layout => {
  document.documentElement.dataset.layout = layout;
};

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const readPreference = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return PREFERENCES.includes(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
};

const systemPrefersDark = () => Boolean(window.matchMedia?.(DARK_QUERY).matches);

/** `system` becomes what the device asks for right now. */
export const resolveTheme = preference =>
  preference === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : preference === 'dark' ? 'dark' : 'light';

const THEME_COLORS = { light: '#0E0E0C', dark: '#0B0B0A' };

export const applyTheme = resolved => {
  document.documentElement.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[resolved]);
};

const ThemeModeContext = createContext({
  preference: DEFAULT_PREFERENCE,
  resolved: 'light',
  setPreference: () => {},
  layout: DEFAULT_LAYOUT,
  setLayout: () => {},
});

export const ThemeModeProvider = ({ children }) => {
  const [preference, setPreferenceState] = useState(readPreference);
  const [resolved, setResolved] = useState(() => resolveTheme(readPreference()));

  const [layout, setLayoutState] = useState(readLayout);

  const setLayout = useCallback(next => {
    if (!LAYOUTS.includes(next)) return;
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice still applies for this visit */
    }
    setLayoutState(next);
  }, []);

  useEffect(() => applyLayout(layout), [layout]);

  const setPreference = useCallback(next => {
    if (!PREFERENCES.includes(next)) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice still applies for this visit */
    }
    setPreferenceState(next);
  }, []);

  // Apply whenever the choice changes, and follow the device while on "system".
  useEffect(() => {
    const update = () => {
      const next = resolveTheme(preference);
      setResolved(next);
      applyTheme(next);
    };
    update();

    if (preference !== 'system' || !window.matchMedia) return undefined;
    const query = window.matchMedia(DARK_QUERY);
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, [preference]);

  // Another tab changed it.
  useEffect(() => {
    const onStorage = event => {
      if (event.key === THEME_STORAGE_KEY) setPreferenceState(readPreference());
      if (event.key === LAYOUT_STORAGE_KEY) setLayoutState(readLayout());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, layout, setLayout }),
    [preference, resolved, setPreference, layout, setLayout],
  );
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeModeContext);
