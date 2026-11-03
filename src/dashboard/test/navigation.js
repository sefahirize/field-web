import { vi } from 'vitest';

/**
 * What `next/navigation` answers in tests (see ./setup.jsx). A test sets the
 * route with `setRoute('/app/help?q=key')` and checks where the code went with
 * `navigation.router.push` / `replace`, which are mocks.
 */
export const navigation = {
  router: null,
  pathname: '/',
  searchParams: new URLSearchParams(),
  params: {},
};

export const setRoute = (path, params = {}) => {
  const url = new URL(path, 'http://localhost');
  navigation.pathname = url.pathname;
  navigation.searchParams = url.searchParams;
  navigation.params = params;
};

export const resetNavigation = () => {
  navigation.router = { push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() };
  setRoute('/');
};

resetNavigation();
