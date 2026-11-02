import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@dashboard/features/ui/uiSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { HELP_PATH } from '@dashboard/data/help';
import { Logo } from '@dashboard/components/elements/Logo';
import { GlobalSearch } from '@dashboard/components/layouts/GlobalSearch';
import { ThemeToggle } from '@dashboard/components/layouts/ThemeToggle';
import { UsageMenu } from '@dashboard/components/layouts/UsageMenu';
import { IconSidebar } from '@dashboard/components/icons';

/**
 * The bar across the top of signed-in pages: the search for pages and help,
 * and a link to Help. On tablet and below it also carries the brand and the
 * button that opens the navigation drawer, since the sidebar is hidden there.
 */
export const ProtectedHeader = () => {
  const dispatch = useDispatch();
  const { isOpenSidebar } = useSelector(state => state.ui);

  return (
    <header className="Layout-Header">
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={isOpenSidebar ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpenSidebar}
        onClick={() => dispatch(toggleSidebar())}
      >
        <IconSidebar />
      </button>
      <Link href={ROUTE_PATHS.DASHBOARD} className="Layout-Header-Brand" aria-label="Field home">
        <Logo size={22} />
        <span>Field</span>
      </Link>

      <GlobalSearch />

      <div className="Layout-Header-Actions">
        <UsageMenu />
        <ThemeToggle />
        <Link href={HELP_PATH} className="HeaderLink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.6 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.6v.1M12 16.8v.01" />
          </svg>
          <span>Help</span>
        </Link>
      </div>
    </header>
  );
};
