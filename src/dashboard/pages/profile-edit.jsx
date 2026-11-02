'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

import { selectAuthUser } from '@dashboard/features/auth/authSlice';
import { clearProfileFeedback, updateAvatar, updateProfile } from '@dashboard/features/profile/profileSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { DialogConfirm } from '@dashboard/components/modals/DialogConfirm';
import { BackLink } from '@dashboard/components/elements/BackLink';
import { ProfileAvatar } from '@dashboard/components/profile/ProfileAvatar';
import { toBareBase64 } from '@dashboard/libs/files';
import { snackActions } from '@dashboard/libs/snackbar';
import { PaternEmail } from '@dashboard/utils/formPatterns';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const fromUser = user => ({
  name: user?.name ?? '',
  surname: user?.surname ?? user?.lastname ?? '',
  email: user?.email ?? '',
});

/** Checks the details form; returns `{ field: message }` for what is wrong. */
export const validateDetails = form => {
  const problems = {};
  if (!form.name.trim()) problems.name = 'Enter your first name.';
  if (!form.surname.trim()) problems.surname = 'Enter your last name.';
  if (!form.email.trim()) problems.email = 'Enter your email address.';
  else if (!PaternEmail.value.test(form.email.trim())) problems.email = 'That does not look like an email address.';
  return problems;
};

/**
 * /profile/edit — changing the name, the email and the photo, on a screen of its
 * own. The photo is saved the moment it is chosen; the details are saved with
 * the buttons at the bottom, which become active once something has changed. Saving returns
 * to the profile.
 */
export const ProfileEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectAuthUser);
  const { status, error } = useSelector(state => state.profile);

  const [form, setForm] = useState(() => fromUser(user));
  const [problems, setProblems] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const seeded = useRef(Boolean(user));
  const fileInput = useRef(null);

  // The user can arrive after the page does (a reload); seed the form once it lands.
  useEffect(() => {
    if (user && !seeded.current) {
      seeded.current = true;
      setForm(fromUser(user));
    }
  }, [user]);

  useEffect(() => () => dispatch(clearProfileFeedback()), [dispatch]);

  const original = fromUser(user);
  const dirty = Boolean(user) && Object.keys(original).some(key => form[key] !== original[key]);
  const emailChanged = Boolean(user) && form.email.trim() !== original.email;
  const saving = status === 'saving';
  const uploading = status === 'uploading';

  // Closing the tab with unsaved changes asks first.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = event => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const setField = key => event => {
    const next = { ...form, [key]: event.target.value };
    setForm(next);
    if (attempted) setProblems(validateDetails(next));
  };

  const goBack = () => router.push(ROUTE_PATHS.PROFILE);
  const cancel = () => (dirty ? setConfirmLeave(true) : goBack());

  const save = async event => {
    event.preventDefault();
    setAttempted(true);
    const found = validateDetails(form);
    setProblems(found);
    if (Object.keys(found).length > 0) return;

    const result = await dispatch(updateProfile({ name: form.name.trim(), surname: form.surname.trim(), email: form.email.trim() }));
    if (!result.error) {
      snackActions.success('Profile saved.');
      goBack();
    }
  };

  const pickPhoto = async event => {
    const file = event.target.files?.[0];
    event.target.value = ''; // the same file can be chosen again after an error
    if (!file) return;

    setPhotoError(null);
    if (!ACCEPTED.includes(file.type)) {
      setPhotoError('Choose a JPEG, PNG or WebP image.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setPhotoError('That image is over 2 MB. Choose a smaller one.');
      return;
    }

    let base64;
    try {
      base64 = await toBareBase64(file);
    } catch {
      setPhotoError('Could not read that file.');
      return;
    }
    const result = await dispatch(updateAvatar({ base64 }));
    if (!result.error) snackActions.success('Photo updated.');
  };

  if (!user) {
    return (
      <div className="Page Page-ProfileEdit" aria-busy="true">
        <BackLink to={ROUTE_PATHS.PROFILE}>Profile</BackLink>
        <div className="PageHeading">
          <h1 className="PageHeading-Title">Edit profile</h1>
        </div>
        <span className="Skeleton" style={{ height: 220, borderRadius: 16 }} />
      </div>
    );
  }

  const photoSaved = Boolean(user.profile);

  return (
    <div className="Page Page-ProfileEdit">
      <BackLink to={ROUTE_PATHS.PROFILE}>Profile</BackLink>
      <div className="PageHeading">
        <h1 className="PageHeading-Title">Edit profile</h1>
        <p className="PageHeading-Desc">Your name, your email and the photo other people see.</p>
      </div>

      <section className="ProfileCard" aria-labelledby="edit-photo">
        <h2 className="ProfileCard-Title" id="edit-photo">
          Photo
        </h2>
        <div className="PhotoRow">
          <ProfileAvatar user={user} size={84} busy={uploading} />
          <div className="PhotoRow-Actions">
            <div className="PhotoRow-Buttons">
              <Button variant="outlined" onClick={() => fileInput.current?.click()} disabled={uploading || saving}>
                {uploading ? 'Uploading…' : photoSaved ? 'Replace photo' : 'Upload photo'}
              </Button>
            </div>
            <span className="PhotoRow-Hint">JPEG, PNG or WebP · up to 2 MB. The photo is saved as soon as you choose it.</span>
            {photoError && (
              <span className="PhotoRow-Error" role="alert">
                {photoError}
              </span>
            )}
            <input ref={fileInput} type="file" accept={ACCEPTED.join(',')} onChange={pickPhoto} hidden />
          </div>
        </div>
      </section>

      <form className="ProfileCard" onSubmit={save} noValidate aria-labelledby="edit-details">
        <h2 className="ProfileCard-Title" id="edit-details">
          Personal details
        </h2>

        <div className="EditGrid">
          <div className="FormField">
            <label className="FormField-Label" htmlFor="edit-name">
              First name
            </label>
            <input
              id="edit-name"
              className={`FormField-Input ${problems.name ? 'is-invalid' : ''}`}
              value={form.name}
              onChange={setField('name')}
              autoComplete="given-name"
              aria-invalid={Boolean(problems.name)}
              aria-describedby={problems.name ? 'edit-name-error' : undefined}
            />
            {problems.name && (
              <span className="FieldError" id="edit-name-error" role="alert">
                {problems.name}
              </span>
            )}
          </div>

          <div className="FormField">
            <label className="FormField-Label" htmlFor="edit-surname">
              Last name
            </label>
            <input
              id="edit-surname"
              className={`FormField-Input ${problems.surname ? 'is-invalid' : ''}`}
              value={form.surname}
              onChange={setField('surname')}
              autoComplete="family-name"
              aria-invalid={Boolean(problems.surname)}
              aria-describedby={problems.surname ? 'edit-surname-error' : undefined}
            />
            {problems.surname && (
              <span className="FieldError" id="edit-surname-error" role="alert">
                {problems.surname}
              </span>
            )}
          </div>
        </div>

        <div className="FormField">
          <label className="FormField-Label" htmlFor="edit-email">
            Email
          </label>
          <input
            id="edit-email"
            className={`FormField-Input ${problems.email ? 'is-invalid' : ''}`}
            type="email"
            value={form.email}
            onChange={setField('email')}
            autoComplete="email"
            aria-invalid={Boolean(problems.email)}
            aria-describedby={problems.email ? 'edit-email-error' : undefined}
          />
          {problems.email && (
            <span className="FieldError" id="edit-email-error" role="alert">
              {problems.email}
            </span>
          )}
        </div>

        {emailChanged && !problems.email && (
          <div className="Notice Notice--warn" role="status">
            You are changing your email address. You may have to verify the new one before you can sign in again.
          </div>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <div className={`SaveBar ${dirty ? 'is-dirty' : ''}`}>
          <span className="SaveBar-Text">{dirty ? 'You have unsaved changes' : 'No changes yet'}</span>
          <div className="SaveBar-Actions">
            <Button variant="outlined" onClick={cancel} disabled={saving}>
              {dirty ? 'Cancel' : 'Back'}
            </Button>
            <Button variant="contained" type="submit" disabled={saving || !dirty}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>

      <DialogConfirm
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        type="warning"
        title="Discard your changes?"
        desc="The details you edited have not been saved."
        TextConfirmButton="Discard"
        ClickConfirmButton={goBack}
      />
    </div>
  );
};
