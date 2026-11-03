import { describe, it, expect } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { navigation, setRoute } from '@dashboard/test/navigation';
import { GlobalSearch } from './GlobalSearch';

const setup = () => {
  setRoute('/app');
  return render(<GlobalSearch />);
};

describe('GlobalSearch', () => {
  it('suggests pages and questions when focused, and closes on Escape', async () => {
    setup();
    const input = screen.getByRole('combobox', { name: /search pages and help/i });
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option').length).toBeGreaterThan(3);

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a page with Enter', async () => {
    setup();
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'analytics');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(navigation.router.push).toHaveBeenCalledWith('/app/analytics');
    expect(input).toHaveValue('');
  });

  it('sends a question to the Help page opened on it', async () => {
    setup();
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'lost secret');
    await userEvent.click(screen.getByRole('option', { name: /lost an API key/i }));
    expect(navigation.router.push).toHaveBeenCalledWith('/app/help?open=lost-api-key');
  });

  it('always offers to search Help for the exact text, even with no match', async () => {
    setup();
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'qqzzxx');
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(navigation.router.push).toHaveBeenCalledWith('/app/help?q=qqzzxx');
  });

  it('jumps to the box with Ctrl+K and with "/"', () => {
    setup();
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true });
    expect(input).toHaveFocus();
    input.blur();
    fireEvent.keyDown(document.body, { key: '/' });
    expect(input).toHaveFocus();
  });
});
