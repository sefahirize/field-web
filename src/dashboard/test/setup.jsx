import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { navigation, resetNavigation } from './navigation';

// Vitest runs without globals, so Testing Library cannot register this itself.
afterEach(() => {
  cleanup();
  resetNavigation();
});

// No Next.js router runs under jsdom. Pages and components get a stand-in whose
// state the tests set and read through ./navigation.
vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.searchParams,
  useParams: () => navigation.params,
}));
