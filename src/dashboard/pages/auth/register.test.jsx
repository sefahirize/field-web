import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Register } from './register';

const mockRegister = vi.fn();
vi.mock('@dashboard/features/auth/authAction', () => ({
  register: data => async () => {
    mockRegister(data);
    return {};
  },
}));
vi.mock('@dashboard/features/auth/authSlice', () => ({
  clearAuthError: () => ({ type: 'auth/clearError' }),
  selectAuthLoading: state => state.auth.loading,
  selectIsAuthenticated: () => false,
}));
vi.mock('@dashboard/components/layouts/PublicLayout', () => ({ PublicLayout: ({ children }) => <div>{children}</div> }));

const setup = () => {
  const store = configureStore({ reducer: { auth: (state = { loading: false, error: null }) => state } });
  render(
    <Provider store={store}>
      <Register />
    </Provider>,
  );
};

const type = async (label, value) => userEvent.type(screen.getByLabelText(label, { selector: 'input' }), value);

beforeEach(() => mockRegister.mockClear());

describe('Register', () => {
  it('shows the password rule up front and says so when the password is missing', async () => {
    setup();
    expect(screen.getAllByText('Use at least 8 characters.')).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    // The password and its confirmation are both required; neither error was ever shown before.
    expect(await screen.findAllByText('This is required!')).toHaveLength(5);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('asks for a longer password and for a matching confirmation', async () => {
    setup();
    await type('First name', 'Ayşe');
    await type('Last name', 'Yılmaz');
    await type('Email', 'ayse@example.com');
    await type('Password', 'short');
    await type('Confirm password', 'different');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
    expect(screen.getAllByText('Use at least 8 characters.').length).toBeGreaterThan(0);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits when the password is long enough and matches', async () => {
    setup();
    await type('First name', 'Ayşe');
    await type('Last name', 'Yılmaz');
    await type('Email', 'ayse@example.com');
    await type('Password', 'correct horse');
    await type('Confirm password', 'correct horse');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));
    expect(mockRegister.mock.calls[0][0]).toMatchObject({ email: 'ayse@example.com', password: 'correct horse' });
  });
});
