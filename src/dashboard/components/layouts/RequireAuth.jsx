'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSession } from '@dashboard/features/auth/authAction';
import { selectIsAuthenticated } from '@dashboard/features/auth/authSlice';
import { ProtectedLayout } from '@dashboard/components/layouts/ProtectedLayout';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { Navigate } from '@dashboard/libs/navigation';
import { saveAuthRedirect } from '@dashboard/utils/authRedirect';

/**
 * Auth gate for a branch of routes. The `(protected)` route group's layout
 * renders it, so a new protected page is guarded by where its folder sits —
 * there is no per-page step to forget.
 */
export const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const search = useSearchParams().toString();

  // We hold a token but haven't loaded the user yet (e.g. after a page reload).
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchSession());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!isAuthenticated) {
    // Remember where they were headed so login can return them there.
    saveAuthRedirect(search ? `${pathname}?${search}` : pathname);
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};
