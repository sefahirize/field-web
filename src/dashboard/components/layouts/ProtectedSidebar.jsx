import React, { useEffect, useState } from 'react';
import { Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@dashboard/features/auth/authAction';
import { selectAuthUser } from '@dashboard/features/auth/authSlice';
import { closeSidebar, toggleSidebarCollapsed } from '@dashboard/features/ui/uiSlice';
import { NAVIGATION } from '@dashboard/data';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { assetUrl } from '@dashboard/libs/assetUrl';
import { stringAvatar } from '@dashboard/utils';
import { useThemeMode } from '@dashboard/libs/themeMode';
import { Logo } from '@dashboard/components/elements/Logo';

/**
 * The navigation column. Always expanded on desktop; on tablet and below it is
 * an off-canvas drawer opened from the header, with a scrim behind it.
 */
export const ProtectedSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isOpenSidebar, isSidebarCollapsed: collapsedPreference } = useSelector(state => state.ui);
  const { layout } = useThemeMode();
  const isSidebarCollapsed = layout === 'rail' && collapsedPreference; // only the rail layout folds

  // A drawer that stays open after the user picked a destination covers it.
  useEffect(() => {
    dispatch(closeSidebar());
  }, [pathname, dispatch]);

  return (
    <>
      <div
        className={`Layout-Scrim ${isOpenSidebar ? 'is-visible' : ''}`}
        onClick={() => dispatch(closeSidebar())}
        aria-hidden="true"
      />
      <aside className="Layout-Sidebar" aria-label="Main navigation">
        <Link href={ROUTE_PATHS.DASHBOARD} className="Layout-Sidebar-Brand" aria-label="Field home">
          <Logo />
          <span className="Layout-Sidebar-BrandName">Field</span>
        </Link>

        {layout === 'rail' && (
          <button
            type="button"
            className="Layout-Sidebar-Collapse"
            onClick={() => dispatch(toggleSidebarCollapsed())}
            aria-label={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-pressed={isSidebarCollapsed}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m14 7-5 5 5 5" />
            </svg>
          </button>
        )}

        <nav className="Layout-Sidebar-Nav">
          {NAVIGATION.map(item => (
            <NavItem key={item.id} item={item} pathname={pathname} collapsed={isSidebarCollapsed} />
          ))}
        </nav>

        <UserMenu collapsed={isSidebarCollapsed} />
      </aside>
    </>
  );
};

const NavItem = ({ item, pathname, collapsed }) => {
  const isActive = item.href === ROUTE_PATHS.DASHBOARD ? pathname === item.href : pathname.startsWith(item.href);

  // Icon-only, the name moves to a tooltip (the label stays in the DOM for screen readers).
  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
      <Link href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined}>
        <span className="nav-icon">{item.icon}</span>
        <span className="nav-label">{item.label}</span>
      </Link>
    </Tooltip>
  );
};

const UserMenu = ({ collapsed }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    setAnchorEl(null);
    await dispatch(logout());
    router.replace(ROUTE_PATHS.LOGIN);
  };

  const displayName = [user?.name, user?.surname].filter(Boolean).join(' ') || user?.email || '';

  return (
    <>
      <button
        type="button"
        className="user-menu-trigger"
        aria-label="Account menu"
        title={collapsed ? displayName || 'Account' : undefined}
        aria-haspopup="menu"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        {/* GET /profile answers the photo as a relative /uploads path. MUI falls
            back to the initials by itself when there is none or it fails to load. */}
        <Avatar src={assetUrl(user?.profile) ?? undefined} alt={displayName}>
          {stringAvatar(displayName || '.')}
        </Avatar>
        <span className="user-menu-text">
          <span className="user-menu-name">{displayName || 'Account'}</span>
          {user?.email && displayName !== user.email && <span className="user-menu-sub">{user.email}</span>}
        </span>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); router.push(ROUTE_PATHS.PROFILE); }}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </>
  );
};
