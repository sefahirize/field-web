'use client';

import { useSyncExternalStore } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import { getTheme } from '@dashboard/libs/theme';
import { ThemeModeProvider, useThemeMode } from '@dashboard/libs/themeMode';
import store from '@dashboard/libs/store';
import { injectStore } from '@dashboard/libs/axios';
import { SnackbarUtilsConfigurator } from '@dashboard/libs/snackbar';

injectStore(store);

/** The MUI theme follows the resolved light / dark choice. */
const ThemedApp = ({ children }) => {
  const { resolved } = useThemeMode();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={getTheme(resolved)}>
        <div className="App">{children}</div>
      </ThemeProvider>
      <CssBaseline />
    </StyledEngineProvider>
  );
};

const subscribe = () => () => {};

/**
 * Everything the dashboard pages run inside (it was App.js in the CRA app).
 *
 * The dashboard reads localStorage, sessionStorage and window while it renders
 * (tokens, theme, layout), so it renders in the browser only, as the CRA app
 * did: the server sends the empty shell and the pre-paint script, and the
 * pages appear once this mounts.
 */
export const AppProviders = ({ children }) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!isClient) return null;

  // The store sits above the snackbars: an upload's progress toast reads it.
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={9} autoHideDuration={2000} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <SnackbarUtilsConfigurator />

        <ThemeModeProvider>
          <ThemedApp>{children}</ThemedApp>
        </ThemeModeProvider>
      </SnackbarProvider>
    </Provider>
  );
};
