import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyFormModal } from './KeyFormModal';
import { SecretModal } from './SecretModal';
import { describeExpiry, expiresDaysOf } from '@dashboard/features/apiCredentials/keyFields';

// A minute short of n days, so the whole-day count (rounded up) is n.
const inDays = n => new Date(Date.now() + n * 24 * 60 * 60 * 1000 - 60 * 1000).toISOString();

describe('key expiry helpers', () => {
  it('describes never, soon, later and expired', () => {
    expect(describeExpiry({})).toEqual({ text: 'Never', tone: 'none' });
    expect(describeExpiry({ expires_at: inDays(3) })).toMatchObject({ text: 'In 3 days', tone: 'soon' });
    expect(describeExpiry({ expires_at: inDays(40) }).tone).toBe('ok');
    expect(describeExpiry({ expires_at: inDays(-2) }).tone).toBe('expired');
  });

  it('keeps a dated key dated when it is saved again', () => {
    expect(expiresDaysOf({})).toBe(0);
    expect(expiresDaysOf({ expires_days: 90 })).toBe(90);
    expect(expiresDaysOf({ expires_at: inDays(29) })).toBe(29);
  });
});

describe('KeyFormModal', () => {
  it('creates a key with a preset expiry', async () => {
    const onSubmit = vi.fn();
    render(<KeyFormModal onSubmit={onSubmit} onClose={() => {}} />);

    const create = screen.getByRole('button', { name: 'Create key' });
    expect(create).toBeDisabled(); // no name yet

    await userEvent.type(screen.getByLabelText('Name'), '  Backend  ');
    await userEvent.click(screen.getByRole('radio', { name: /^Production/ }));
    await userEvent.click(screen.getByRole('radio', { name: '90 days' }));
    await userEvent.click(create);

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Backend', environment: 'production', expiresDays: 90 });
  });

  it('needs a whole number of days for a custom expiry', async () => {
    const onSubmit = vi.fn();
    render(<KeyFormModal onSubmit={onSubmit} onClose={() => {}} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Key');
    await userEvent.click(screen.getByRole('radio', { name: 'Custom' }));
    expect(screen.getByRole('button', { name: 'Create key' })).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Days until the key expires'), '45');
    await userEvent.click(screen.getByRole('button', { name: 'Create key' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Key', environment: 'test', expiresDays: 45 });
  });

  it('editing a dated key keeps its expiry unless it is changed', async () => {
    const onSubmit = vi.fn();
    const row = { id: 7, name: 'Old name', environment: 'production', expires_at: inDays(45) };
    render(<KeyFormModal row={row} onSubmit={onSubmit} onClose={() => {}} />);

    expect(screen.getByLabelText('Name')).toHaveValue('Old name');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Old name', environment: 'production', expiresDays: 45 });
  });
});

describe('SecretModal', () => {
  it('asks once before closing a key that was never copied', async () => {
    const onDone = vi.fn();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue() } });
    render(<SecretModal revealed={{ name: 'Backend', secret: 'jf_secret_123' }} onDone={onDone} />);

    expect(screen.getByText('jf_secret_123')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/not copied/);

    fireEvent.click(screen.getByRole('button', { name: 'Close anyway' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('closes straight away once the key was copied', async () => {
    const onDone = vi.fn();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue() } });
    render(<SecretModal revealed={{ name: 'Backend', secret: 'jf_secret_123' }} onDone={onDone} />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
