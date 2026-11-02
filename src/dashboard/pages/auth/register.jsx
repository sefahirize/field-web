'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { PublicLayout } from '@dashboard/components/layouts/PublicLayout';
import { InputFilledPassword } from '@dashboard/components/elements/InputFilledPassword';
import { register as registerUser } from '@dashboard/features/auth/authAction';
import { clearAuthError, selectAuthLoading } from '@dashboard/features/auth/authSlice';
import { FORM_TEXT, MIN_PASSWORD_LENGTH } from '@dashboard/data';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { PaternEmail } from '@dashboard/utils/formPatterns';

export const Register = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(state => state.auth.error);

  const {
    handleSubmit,
    formState: { errors, touchedFields },
    control,
    getValues,
    trigger,
  } = useForm({
    // Check a field when it is left, then keep it right as it is edited.
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { name: '', surname: '', email: '', password: '', passwordConfirm: '' },
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // The backend will not log in an unverified account, so registering always
  // ends here rather than in a session.
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const onSubmit = async data => {
    const result = await dispatch(registerUser(data));
    if (!result.error) {
      setRegisteredEmail(data.email);
      setAwaitingVerification(true);
    }
  };

  if (awaitingVerification) {
    return (
      <PublicLayout>
        <div className="Page Page-Register">
          <div className="Register">
            <div className="Register-Form">
              <div className="Heading">
                <div className="title">Check your inbox</div>
                <div className="desc">
                  We sent a verification link to <strong>{registeredEmail}</strong>. Open it to activate your
                  account — you cannot sign in until you do.
                </div>
              </div>
              <div className="auth-notice">
                The link works once.
                {/* There is no resend endpoint, and registering again with the same
                    address answers 409 rather than issuing a fresh link — so there
                    is nothing truthful to offer here beyond getting in touch. */}
                {' '}
                If it has expired or you never received it, contact support and we will re-issue it.
              </div>
              <div className="Register-Footer">
                <div className="redirect-login">
                  Already verified? <Link href={ROUTE_PATHS.LOGIN}>Log in</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="Page Page-Register">
        <div className="Register">
          <div className="Register-Form">
            <div className="Heading">
              <div className="title">Create your account</div>
              <div className="desc">Get started with Field</div>
            </div>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Grid container rowSpacing={{ xs: '20px', sm: '24px' }} columnSpacing={{ xs: 0, sm: '16px' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: FORM_TEXT.required }}
                      render={({ field }) => (
                        <TextField
                          error={!!errors?.name?.message}
                          helperText={errors?.name?.message}
                          label="First name"
                          variant="filled"
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <Controller
                      name="surname"
                      control={control}
                      rules={{ required: FORM_TEXT.required }}
                      render={({ field }) => (
                        <TextField
                          error={!!errors?.surname?.message}
                          helperText={errors?.surname?.message}
                          label="Last name"
                          variant="filled"
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

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
                  <InputFilledPassword
                    control={control}
                    errors={errors}
                    autoComplete="new-password"
                    helper={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
                    rules={{
                      required: FORM_TEXT.required,
                      minLength: { value: MIN_PASSWORD_LENGTH, message: `Use at least ${MIN_PASSWORD_LENGTH} characters.` },
                      // Changing the password re-checks a confirmation that was already typed.
                      onChange: () => {
                        if (touchedFields.passwordConfirm) trigger('passwordConfirm');
                      },
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <InputFilledPassword
                    control={control}
                    errors={errors}
                    name="passwordConfirm"
                    label="Confirm password"
                    autoComplete="new-password"
                    rules={{
                      required: FORM_TEXT.required,
                      validate: value => value === getValues('password') || 'Passwords do not match.',
                    }}
                  />
                </Grid>
              </Grid>

              {error && <div className="auth-error">{error}</div>}

              <Grid container>
                <Grid className="form-action-send" size={12}>
                  <Button type="submit" fullWidth variant="contained" size="large" loading={loading}>
                    Create account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>

          <div className="Register-Footer">
            <div className="redirect-login">
              Already have an account? <Link href={ROUTE_PATHS.LOGIN}>Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
