import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ProtectedHeader as Header } from '@dashboard/components/layouts/ProtectedHeader';
import { ProtectedSidebar as Sidebar } from '@dashboard/components/layouts/ProtectedSidebar';
import { SIDEBAR_STORAGE_KEY } from '@dashboard/features/ui/uiSlice';
import { useThemeMode } from '@dashboard/libs/themeMode';
import { Loading } from '@dashboard/components/elements/Loading';
import { UploadNotifier } from '@dashboard/components/documents/UploadNotifier';

/**
 * Chrome for signed-in pages. Purely presentational — the auth check lives in
 * `RequireAuth`, which renders this.
 */
export const ProtectedLayout = ({ loading = false, children, background = 'gray' }) => {
  const { isOpenSidebar, isSidebarCollapsed } = useSelector(state => state.ui);
  const { layout } = useThemeMode();

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, isSidebarCollapsed ? 'collapsed' : 'expanded');
    } catch {
      // storage can be blocked; the rail still works for this visit
    }
  }, [isSidebarCollapsed]);

  return (
    <div
      className={`Layout Layout-Protected background-${background} ${isOpenSidebar ? 'sidebar-opened' : ''} ${layout === 'rail' && isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${
        loading ? 'loading' : ''
      }`}
    >
      <Header />
      <Sidebar />
      <div className="Layout-Page">{children}</div>
      <Loading loading={loading} />
      <UploadNotifier />
    </div>
  );
};
