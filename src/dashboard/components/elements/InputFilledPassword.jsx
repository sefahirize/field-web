import { FormControl, IconButton, InputLabel, TextField } from '@mui/material';
import { FORM_TEXT } from '@dashboard/data';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { IconEye } from '@dashboard/components/icons';
import { IconEyeSlash } from '@dashboard/components/icons';

/**
 * A password field with a show / hide button, for react-hook-form.
 *
 * `name` is the form field it is bound to (default "password") and also where its
 * error is read from — it used to read the error under an undefined name, so
 * "This is required!" never showed under a password field. `rules` are the
 * validation rules (required by default); `helper` is a hint shown under the field
 * until there is an error to show instead.
 */
export const InputFilledPassword = ({
  errors,
  control,
  label = 'Password',
  labelTop = null,
  name = 'password',
  rules = { required: FORM_TEXT.required },
  helper = null,
  autoComplete,
}) => {
  const [passwordType, changePasswordType] = useState('password');

  const handleClickShowPassword = () => {
    changePasswordType(prev => (prev === 'password' ? 'text' : 'password'));
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const message = errors?.[name]?.message;

  return (
    <>
      {labelTop ? <InputLabel className="Label-TextField">{labelTop}</InputLabel> : null}
      <FormControl className="InputFilledPassword" fullWidth size={'small'}>
        <Controller
          render={({ field }) => (
            <TextField
              error={!!message}
              helperText={message || helper}
              label={label}
              variant="filled"
              type={passwordType}
              autoComplete={autoComplete}
              {...field}
            />
          )}
          name={name}
          control={control}
          rules={rules}
        />
        <IconButton
          aria-label={passwordType === 'password' ? `Show ${label.toLowerCase()}` : `Hide ${label.toLowerCase()}`}
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          size="medium"
          className="button-passwordType"
        >
          {passwordType === 'password' ? <IconEye /> : <IconEyeSlash />}
        </IconButton>
      </FormControl>
    </>
  );
};
