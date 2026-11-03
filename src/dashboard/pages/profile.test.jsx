import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SnackbarProvider } from 'notistack';
import profileReducer from '@dashboard/features/profile/profileSlice';
import { profileApi } from '@dashboard/features/profile/profileApi';
import { SnackbarUtilsConfigurator } from '@dashboard/libs/snackbar';
import { navigation, setRoute } from '@dashboard/test/navigation';
import { Profile } from './profile';
import { ProfileEdit, validateDetails } from './profile-edit';

vi.mock('axios', () => ({}));
vi.mock('@dashboard/features/profile/profileApi', () => ({
  profileApi: { get: vi.fn(), update: vi.fn(), updateAvatar: vi.fn(), changePassword: vi.fn() },
}));
vi.mock('@dashboard/features/auth/authAction', () => ({ fetchSession: () => async () => ({ payload: {} }) }));
vi.mock('@dashboard/features/auth/authSlice', () => ({ selectAuthUser: state => state.auth.user }));

const USER = {
  id: 42,
  name: 'Ayşe',
  surname: 'Yılmaz',
  email: 'ayse@example.com',
  company: 'Acme',
  role: 'user',
  is_verified: true,
  verified_at: '2026-09-02T10:00:00Z',
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-10-01T10:00:00Z',
};

const setup = (ui, user = USER, path = '/app/profile') => {
  setRoute(path);
  const store = configureStore({ reducer: { profile: profileReducer, auth: (state = { user }) => state } });
  render(
    <Provider store={store}>
      <SnackbarProvider>
        <SnackbarUtilsConfigurator />
        {ui}
      </SnackbarProvider>
    </Provider>,
  );
  return store;
};

beforeEach(() => vi.clearAllMocks());

describe('Profile', () => {
  it('shows who the account belongs to, with a way to edit it', () => {
    setup(<Profile />);

    expect(screen.getByRole('heading', { name: 'Ayşe Yılmaz' })).toBeInTheDocument();
    expect(screen.getAllByText('ayse@example.com').length).toBeGreaterThan(0);
    expect(screen.getByText('Email verified')).toBeInTheDocument();
    const about = screen.getByRole('region', { name: 'About' });
    expect(within(about).getByText('Acme')).toBeInTheDocument();
    expect(within(about).getByText('42')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit profile' })).toHaveAttribute('href', '/app/profile/edit');
  });

  it('says when the email is not verified', () => {
    setup(<Profile />, { ...USER, is_verified: false });
    expect(screen.getByText('Email not verified')).toBeInTheDocument();
  });

  it('changes the password from a window, checking length and confirmation first', async () => {
    profileApi.changePassword.mockResolvedValue({ message: 'Password changed.' });
    setup(<Profile />);

    await userEvent.click(screen.getByRole('button', { name: 'Change' }));
    const dialog = await screen.findByRole('dialog', { name: 'Change password' });

    await userEvent.click(within(dialog).getByRole('button', { name: 'Change password' }));
    expect(await within(dialog).findAllByText('This is required!')).toHaveLength(2);
    expect(profileApi.changePassword).not.toHaveBeenCalled();

    await userEvent.type(within(dialog).getByLabelText('New password', { selector: 'input' }), 'correct horse');
    await userEvent.type(within(dialog).getByLabelText('Repeat new password', { selector: 'input' }), 'different');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Change password' }));
    expect(await within(dialog).findByText('The two passwords do not match.')).toBeInTheDocument();

    await userEvent.clear(within(dialog).getByLabelText('Repeat new password', { selector: 'input' }));
    await userEvent.type(within(dialog).getByLabelText('Repeat new password', { selector: 'input' }), 'correct horse');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Change password' }));

    await waitFor(() => expect(profileApi.changePassword).toHaveBeenCalledWith({ password: 'correct horse', passwordConfirm: 'correct horse' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Change password' })).toBeNull());
  });
});

describe('ProfileEdit', () => {
  it('validates the details', () => {
    expect(validateDetails({ name: '', surname: ' ', email: 'nope' })).toEqual({
      name: 'Enter your first name.',
      surname: 'Enter your last name.',
      email: 'That does not look like an email address.',
    });
    expect(validateDetails({ name: 'A', surname: 'B', email: 'a@b.co' })).toEqual({});
  });

  it('starts from the current details, and only enables saving once something changed', async () => {
    setup(<ProfileEdit />, USER, '/app/profile/edit');

    expect(screen.getByLabelText('First name')).toHaveValue('Ayşe');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    expect(screen.getByText('No changes yet')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('First name'), 'm');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
  });

  it('warns when the email changes, refuses bad input, saves, and goes back to the profile', async () => {
    profileApi.update.mockResolvedValue({ message: 'Profile saved.' });
    setup(<ProfileEdit />, USER, '/app/profile/edit');

    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('That does not look like an email address.')).toBeInTheDocument();
    expect(profileApi.update).not.toHaveBeenCalled();

    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.type(screen.getByLabelText('Email'), 'ayse.new@example.com');
    expect(screen.getByText(/You are changing your email address/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(profileApi.update).toHaveBeenCalledWith({ name: 'Ayşe', surname: 'Yılmaz', email: 'ayse.new@example.com' }),
    );
    await waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith('/app/profile'));
  });

  it('asks before throwing away unsaved changes', async () => {
    setup(<ProfileEdit />, USER, '/app/profile/edit');
    await userEvent.type(screen.getByLabelText('Last name'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Discard your changes?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Discard' }));
    await waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith('/app/profile'));
  });

  it('refuses a photo that is the wrong type or too large without calling the API', async () => {
    setup(<ProfileEdit />, USER, '/app/profile/edit');
    const input = document.querySelector('input[type="file"]');

    await userEvent.upload(input, new File(['x'], 'notes.txt', { type: 'text/plain' }), { applyAccept: false });
    expect(await screen.findByText('Choose a JPEG, PNG or WebP image.')).toBeInTheDocument();

    const big = new File([new Uint8Array(3 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    await userEvent.upload(input, big);
    expect(await screen.findByText('That image is over 2 MB. Choose a smaller one.')).toBeInTheDocument();
    expect(profileApi.updateAvatar).not.toHaveBeenCalled();
  });
});
