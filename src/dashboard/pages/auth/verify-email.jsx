'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { PublicLayout } from '@dashboard/components/layouts/PublicLayout';
import { verifyEmail } from '@dashboard/features/auth/authAction';
import { clearAuthError } from '@dashboard/features/auth/authSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';

/**
 * Landing page for the link in the verification email:
 *   /verify-email?token=<uuid>
 *
 * It verifies on mount rather than asking the user to press anything — they
 * already expressed intent by clicking the link in their inbox.
 */
export const VerifyEmail = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState(token ? 'verifying' : 'missing-token');
  const error = useSelector(s => s.auth.error);
  const message = useSelector(s => s.auth.message);

  // React runs effects twice in development; without this the token would be
  // spent on the first call and the second would report "invalid token".
  const attempted = useRef(false);

  useEffect(() => {
    dispatch(clearAuthError());
    if (!token || attempted.current) return;
    attempted.current = true;

    dispatch(verifyEmail({ token })).then(result => {
      setState(result.error ? 'failed' : 'verified');
    });
  }, [dispatch, token]);

  return (
    <PublicLayout redirectWhenAuthenticated={false}>
      <div className="Page Page-ForgotPassword">
        <div className="ForgotPassword">
          <div className="Heading">
            <div className="title">{TITLES[state]}</div>
            <div className="desc">{DESCRIPTIONS[state]}</div>
          </div>

          {state === 'verified' && <div className="auth-notice">{message || 'Your email is verified.'}</div>}
          {state === 'failed' && (
            <div className="auth-error">
              {/* The API's own wording is lowercase and terse, so it gets its own
                  line rather than being glued onto a sentence of ours. */}
              <strong>{capitalise(error) || 'That link is not valid.'}</strong>
              <br />
              Verification links expire once used. Sign in to request a new one.
            </div>
          )}

          <div className="ForgotPassword-Footer">
            <Link href={ROUTE_PATHS.LOGIN}>{state === 'verified' ? 'Continue to log in' : 'Back to log in'}</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

const capitalise = text => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

const TITLES = {
  verifying: 'Verifying your email',
  verified: 'Email verified',
  failed: "That link didn't work",
  'missing-token': 'Nothing to verify',
};

const DESCRIPTIONS = {
  verifying: 'One moment.',
  verified: 'Your account is ready to use.',
  failed: 'The link may have already been used, or it has expired.',
  'missing-token': 'This page needs the link from your verification email.',
};
