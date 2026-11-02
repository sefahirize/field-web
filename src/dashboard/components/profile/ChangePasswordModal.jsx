'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { Modal } from '@dashboard/components/elements/Modal';
import { InputFilledPassword } from '@dashboard/components/elements/InputFilledPassword';
import { changePassword, clearProfileFeedback } from '@dashboard/features/profile/profileSlice';
import { FORM_TEXT, MIN_PASSWORD_LENGTH } from '@dashboard/data';
import { snackActions } from '@dashboard/libs/snackbar';

/**
 * PUT /profile/password. The API asks only for the new password, twice — no
 * current one — so neither does this window.
 */
export const ChangePasswordModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.profile.password);
  const saving = status === 'saving';

  const {
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { password: '', passwordConfirm: '' },
  });

  const close = () => {
    dispatch(clearProfileFeedback());
    onClose();
  };

  const onSubmit = async values => {
    const result = await dispatch(changePassword(values));
    if (!result.error) {
      snackActions.success('Password changed.');
      close();
    }
  };

  return (
    <Modal
      open
      size="sm"
      onClose={saving ? undefined : close}
      locked={saving}
      busy={saving}
      title="Change password"
      description="Choose a new password. You will stay signed in on this device."
      footer={
        <>
          <Button variant="outlined" size="large" onClick={close} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" size="large" type="submit" form="change-password-form" disabled={saving}>
            {saving ? 'Saving…' : 'Change password'}
          </Button>
        </>
      }
    >
      <form id="change-password-form" className="KeyForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputFilledPassword
          control={control}
          errors={errors}
          label="New password"
          autoComplete="new-password"
          helper={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
          rules={{
            required: FORM_TEXT.required,
            minLength: { value: MIN_PASSWORD_LENGTH, message: `Use at least ${MIN_PASSWORD_LENGTH} characters.` },
            onChange: () => {
              if (touchedFields.passwordConfirm) trigger('passwordConfirm');
            },
          }}
        />
        <InputFilledPassword
          control={control}
          errors={errors}
          name="passwordConfirm"
          label="Repeat new password"
          autoComplete="new-password"
          rules={{
            required: FORM_TEXT.required,
            validate: value => value === getValues('password') || 'The two passwords do not match.',
          }}
        />
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
};
