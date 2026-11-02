'use client';

import React from 'react';
import { Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@dashboard/features/auth/authSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';

export default function NotFound404() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const target = isAuthenticated ? ROUTE_PATHS.DASHBOARD : ROUTE_PATHS.LOGIN;

  return (
    <div className="Page-NotFound404">
      <section className="NotFound404">
        <Container>
          <div className="NotFound404-Content">
            <div className="heading">
              <h1>404</h1>
            </div>
            <div className="desc">
              <p>That page doesn't exist.</p>
            </div>
            <div className="actions">
              <Button onClick={() => router.push(target)} size="large" variant="contained">
                {isAuthenticated ? 'Go to dashboard' : 'Go to log in'}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
