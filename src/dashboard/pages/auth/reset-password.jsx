'use client';

import React, { useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { PublicLayout } from '@dashboard/components/layouts/PublicLayout';
import { InputFilledPassword } from '@dashboard/components/elements/InputFilledPassword';
import { resetPassword } from '@dashboard/features/auth/authAction';
import { clearAuthError, selectAuthLoading } from '@dashboard/features/auth/authSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';

export const ResetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loading = useSelector(selectAuthLoading);
  const { error, message } = useSelector(state => state.auth);

  // The emailed link carries the one-time token, e.g. /reset-password?token=abc
  const token = searchParams.get('token');

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues: { password: '' } });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = async data => {
    const result = await dispatch(resetPassword({ ...data, token }));
    if (!result.error) router.replace(ROUTE_PATHS.LOGIN);
  };

  return (
    <PublicLayout>
      <div className="Page Page-ForgotPassword">
        <div className="ForgotPassword">
          <div className="Heading">
            <div className="title">Set a new password</div>
            <div className="desc">Choose a password you haven't used before.</div>
          </div>

          {!token ? (
            <div className="auth-error">
              This reset link is missing its token. Request a new one from{' '}
              <Link href={ROUTE_PATHS.FORGOT_PASSWORD}>the reset page</Link>.
            </div>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container rowSpacing="24px">
                <Grid size={12}>
                  <InputFilledPassword control={control} errors={errors} />
                </Grid>
              </Grid>

              {message && <div className="auth-notice">{message}</div>}
              {error && <div className="auth-error">{error}</div>}

              <Grid container>
                <Grid className="form-action-send" size={12}>
                  <Button type="submit" fullWidth variant="contained" size="large" loading={loading}>
                    Update password
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          <div className="ForgotPassword-Footer">
            <Link href={ROUTE_PATHS.LOGIN}>Back to log in</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
