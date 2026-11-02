'use client';

import React, { useEffect } from 'react';
import { Box, Button, FormControl, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { PublicLayout } from '@dashboard/components/layouts/PublicLayout';
import { requestPasswordReset } from '@dashboard/features/auth/authAction';
import { clearAuthError, selectAuthLoading } from '@dashboard/features/auth/authSlice';
import { FORM_TEXT } from '@dashboard/data';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { PaternEmail } from '@dashboard/utils/formPatterns';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const { error, message } = useSelector(state => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues: { email: '' } });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <PublicLayout>
      <div className="Page Page-ForgotPassword">
        <div className="ForgotPassword">
          <div className="Heading">
            <div className="title">Reset your password</div>
            <div className="desc">We'll email you a link to set a new one.</div>
          </div>

          <Box component="form" onSubmit={handleSubmit(data => dispatch(requestPasswordReset(data)))}>
            <Grid container rowSpacing="24px">
              <Grid size={12}>
                <FormControl fullWidth size="small">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: FORM_TEXT.required, pattern: PaternEmail }}
                    render={({ field }) => (
                      <TextField
                        error={!!errors?.email?.message}
                        helperText={errors?.email?.message}
                        label="Email"
                        variant="filled"
                        {...field}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {message && <div className="auth-notice">{message}</div>}
            {error && <div className="auth-error">{error}</div>}

            <Grid container>
              <Grid className="form-action-send" size={12}>
                <Button type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  Send reset link
                </Button>
              </Grid>
            </Grid>
          </Box>

          <div className="ForgotPassword-Footer">
            <Link href={ROUTE_PATHS.LOGIN}>Back to log in</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
