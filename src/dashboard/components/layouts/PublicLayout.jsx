import React, { useEffect, useState } from 'react';
import { Navigate } from '@dashboard/libs/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@dashboard/features/auth/authSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { clearAuthRedirect, peekAuthRedirect } from '@dashboard/utils/authRedirect';
import { Logo } from '@dashboard/components/elements/Logo';
import { TypedLine, useTypewriter } from '@dashboard/components/elements/Typewriter';

/**
 * Chrome for signed-out pages (login, register, password reset). Bounces an
 * already-authenticated visitor back to wherever they were originally headed.
 *
 * `redirectWhenAuthenticated={false}` keeps the page rendering for a signed-in
 * user. Email verification needs that: someone can be logged in and still have
 * an unverified address, and bouncing them would drop the token unused.
 */
const TITLE = 'Welcome to Field.';
const SUBTITLE = 'Ten document and AI products behind one API key.';
const COPY = [
  { text: TITLE, speed: 62 },
  { text: SUBTITLE, speed: 30, pause: 450 },
];

export const PublicLayout = ({ children, redirectWhenAuthenticated = true }) => {
  const { typed, active, animated } = useTypewriter(COPY, { onceKey: 'joinfield-intro-typed' });

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const shouldRedirect = isAuthenticated && redirectWhenAuthenticated;
  // Read once: Next's router.replace is not instant, so this page can render
  // again after the effect below cleared the saved path, and a second read
  // would send the user to the dashboard home instead.
  const [savedRedirect] = useState(peekAuthRedirect);
  const redirectTo = shouldRedirect ? savedRedirect || ROUTE_PATHS.DASHBOARD : null;

  useEffect(() => {
    if (isAuthenticated) clearAuthRedirect();
  }, [isAuthenticated]);

  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="Layout Layout-Public">
      <div className="Layout-Start">
        <div className="Layout-Start-Inner">
          <div className="Layout-Brand" aria-label="Field">
            <Logo />
            <span>Field</span>
          </div>
          {children}
        </div>
      </div>
      <aside className="Layout-End" aria-hidden="true">
        <div className="Layout-End-Mark">
          <Logo size={28} />
        </div>
        <div className="Layout-End-Copy">
          {/* The underscore follows the line being typed, and rests on the last one. */}
          <TypedLine className="title" text={TITLE} typed={typed[0]} cursor={animated && active === 0} />
          <TypedLine className="desc" text={SUBTITLE} typed={typed[1]} cursor={animated && (active === 1 || active === -1)} />
        </div>
        <span className="Layout-End-Foot">joinfield.ai</span>
      </aside>
    </div>
  );
};
