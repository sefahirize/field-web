'use client';

import React, { useEffect } from 'react';
import { Box, Button, FormControl, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { PublicLayout } from '@dashboard/components/layouts/PublicLayout';
import { InputFilledPassword } from '@dashboard/components/elements/InputFilledPassword';
import { login } from '@dashboard/features/auth/authAction';
import { clearAuthError, selectAuthLoading } from '@dashboard/features/auth/authSlice';
import { isMockAuth } from '@dashboard/features/auth/authApi';
import { FORM_TEXT } from '@dashboard/data';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { PaternEmail } from '@dashboard/utils/formPatterns';

export const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(state => state.auth.error);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues: { email: '', password: '' } });

  // Don't carry a stale error in from a previous visit to this screen.
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = data => dispatch(login(data));

  return (
    <PublicLayout>
      <div className="Page Page-Login">
        <div className="Login">
          <div className="Login-Form">
            <div className="Heading">
              <div className="title">Log in</div>
              <div className="desc">Welcome back to Field</div>
            </div>

            {isMockAuth && (
              <div className="auth-notice">
                No backend connected yet — sign in with any email and the password <strong>password</strong>.
              </div>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Grid container rowSpacing={{ xs: '20px', sm: '24px' }}>
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

                <Grid size={12}>
                  <InputFilledPassword control={control} errors={errors} />
                </Grid>
              </Grid>

              {error && (
                <div className="auth-error">
                  {error}
                  {/* The backend blocks unverified accounts outright; on its own
                      that message leaves the user with nothing to do next. */}
                  {/not verified/i.test(error) && (
                    <>
                      <br />
                      Open the verification link we emailed you, then try again.
                    </>
                  )}
                </div>
              )}

              <Grid container>
                <Grid className="form-action-forgotPassword" size={12}>
                  <Button component={Link} href={ROUTE_PATHS.FORGOT_PASSWORD} variant="outlined" color="white">
                    Forgot password?
                  </Button>
                </Grid>
                <Grid className="form-action-send" size={12}>
                  <Button type="submit" fullWidth variant="contained" size="large" loading={loading}>
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>

          <div className="Login-Footer">
            <div className="redirect-login">
              Need an account? <Link href={ROUTE_PATHS.REGISTER}>Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
