import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import creditsReducer from '@dashboard/features/credits/creditsSlice';
import productsReducer from '@dashboard/features/products/productsSlice';
import { creditsApi } from '@dashboard/features/credits/creditsApi';
import { UsageMenu } from './UsageMenu';

vi.mock('axios', () => ({}));
vi.mock('@dashboard/features/credits/creditsApi', () => ({
  creditsApi: { balance: vi.fn(), history: vi.fn(), list: vi.fn(), balanceFor: vi.fn(), use: vi.fn() },
}));
vi.mock('@dashboard/features/products/productsApi', () => ({ productsApi: { list: vi.fn().mockResolvedValue([]) } }));

const row = (id, key, name, total, used) => ({
  product_id: id,
  product_key: key,
  product_name: name,
  total_credits: total,
  used_credits: used,
  remaining_credits: total - used,
});

const setup = rows => {
  creditsApi.balance.mockResolvedValue(rows);
  const store = configureStore({
    reducer: { credits: creditsReducer, products: productsReducer, auth: (state = { user: { credits: rows } }) => state },
  });
  render(
    <Provider store={store}>
      <UsageMenu />
    </Provider>,
  );
};

describe('UsageMenu', () => {
  it('lists the active products with their own usage, and flags the ones running low or out', async () => {
    setup([
      row(1, 'ai_model', 'AI Model', 100, 30),
      row(2, 'embedding', 'Embedding', 10, 9),
      row(3, 'ocr', 'OCR', 5, 5),
      row(4, 'translation', 'Translation', 0, 0),
    ]);

    const button = screen.getByRole('button', { name: 'Usage: 1 running low, 1 out of credits' });
    expect(button.querySelector('.UsageToggle-Dot')).not.toBeNull();
    await userEvent.click(button);

    const dialog = await screen.findByRole('dialog', { name: 'Credit usage' });
    // While the refresh runs the numbers stay and only the corner says so; then the count returns.
    expect(await within(dialog).findByText('3 active products')).toBeInTheDocument();
    expect(within(dialog).getByText('70 left')).toBeInTheDocument();
    expect(within(dialog).getByText('30% used · 30 of 100')).toBeInTheDocument();
    expect(within(dialog).getByText('Out of credits')).toBeInTheDocument();
    expect(within(dialog).queryByText('Translation')).toBeNull(); // no credits: not active
    expect(within(dialog).getAllByRole('progressbar')).toHaveLength(3);
    expect(within(dialog).getByRole('link', { name: 'Credit history' })).toHaveAttribute('href', '/app/credits');
    expect(creditsApi.balance).toHaveBeenCalled(); // fresh numbers on open
  });

  it('has no warning dot when nothing is low, and says so when there are no credits', async () => {
    setup([row(1, 'ai_model', 'AI Model', 100, 10)]);
    const button = screen.getByRole('button', { name: 'Usage' });
    expect(button.querySelector('.UsageToggle-Dot')).toBeNull();
    await userEvent.click(button);
    expect(await screen.findByText('1 active product')).toBeInTheDocument();
  });

  it('shows an empty state without credits', async () => {
    setup([row(1, 'ai_model', 'AI Model', 0, 0)]);
    await userEvent.click(screen.getByRole('button', { name: 'Usage' }));
    expect(await screen.findByText('No active products')).toBeInTheDocument();
    // The note waits for the refresh that opening starts, so it is not shown over a skeleton.
    expect(await screen.findByText(/Credits you buy appear here/)).toBeInTheDocument();
  });
});
