import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import creditsReducer from '@dashboard/features/credits/creditsSlice';
import productsReducer from '@dashboard/features/products/productsSlice';
import { creditsApi } from '@dashboard/features/credits/creditsApi';
import { CreditHistory } from './credit-history';

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

const BALANCE = [
  row(1, 'ai_model', 'AI Model', 100, 30),
  row(2, 'cv_parser', 'CV Parser', 500, 20),
  row(3, 'embedding', 'Embedding', 10, 9), // 90% used: running low
  row(4, 'ocr', 'OCR', 5, 5), // none left
  row(5, 'translation', 'Translation', 0, 0),
  row(6, 'speech_to_text', 'Speech to Text', 0, 0),
];

const today = new Date();
const entry = (id, type, before, after, description) => ({
  id,
  type,
  description,
  balance_before: before,
  balance_after: after,
  created_at: today.toISOString(),
  product: { id: 1, key: 'ai_model', product_name: 'AI Model' },
});

const setup = () => {
  const store = configureStore({
    reducer: { credits: creditsReducer, products: productsReducer, auth: (state = { user: null }) => state },
  });
  render(
    <Provider store={store}>
      <CreditHistory />
    </Provider>,
  );
};

beforeEach(() => {
  creditsApi.balance.mockResolvedValue(BALANCE);
  creditsApi.history.mockImplementation(async ({ page }) =>
    page === 1
      ? { items: [entry(1, 'usage', 100, 99, 'Parsed cv.pdf'), entry(2, 'welcome_bonus', 0, 100, 'Welcome bonus credits')], meta: { page: 1, limit: 20, total: 3, total_pages: 2 } }
      : { items: [entry(3, 'usage', 99, 98, 'Parsed invoice.pdf')], meta: { page: 2, limit: 20, total: 3, total_pages: 2 } },
  );
});

describe('CreditHistory', () => {
  it('states facts about each product and never adds credits of different products together', async () => {
    setup();

    const hero = await screen.findByRole('region', { name: 'Credits overview' });
    // 4 of the 6 products hold credits; one of them is running low, one is out.
    expect(await within(hero).findByText('4')).toBeInTheDocument();
    expect(within(hero).getByText(/of 6/)).toBeInTheDocument();
    expect(within(hero).getByText('1 running low · 1 out of credits')).toBeInTheDocument();
    expect(within(hero).getByText('No credits yet').nextSibling).toHaveTextContent('2');
    // No sum across products anywhere: 70 + 480 + 1 + 0 = 551, and 100 + 500 + 10 + 5 = 615 received.
    expect(screen.queryByText('551')).toBeNull();
    expect(screen.queryByText(/615/)).toBeNull();
    expect(screen.queryByText(/received/i)).toBeNull();

    const usage = (await screen.findAllByRole('listitem')).filter(item => item.classList.contains('UsageRow'));
    expect(usage).toHaveLength(4);
    expect(usage[0]).toHaveTextContent('CV Parser'); // most credits left first
    expect(usage[0]).toHaveTextContent('480 left');
    expect(usage[0]).toHaveTextContent('4% used · 20 of 500');
    expect(within(usage[0]).getByRole('progressbar', { name: /CV Parser: 4% of credits used/ })).toHaveAttribute('aria-valuenow', '4');
    expect(usage[3]).toHaveTextContent('OCR');
    expect(usage[3].querySelector('.UsageRow-Bar--out')).not.toBeNull();
    expect(usage[2].querySelector('.UsageRow-Bar--low')).not.toBeNull();

    await userEvent.click(screen.getByRole('button', { name: /show 2 products with no credits/i }));
    expect(screen.getByText('Translation')).toBeInTheDocument();
  });

  it('lists the ledger by day with signed amounts, and loads more onto the end', async () => {
    setup();

    expect(await screen.findByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Parsed cv.pdf')).toBeInTheDocument();
    expect(screen.getByText('−1')).toBeInTheDocument();
    expect(screen.getByText('+100')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByText('Parsed invoice.pdf')).toBeInTheDocument();
    expect(screen.getByText('Parsed cv.pdf')).toBeInTheDocument(); // the first page is still there
    expect(screen.queryByRole('button', { name: 'Load more' })).toBeNull(); // nothing left
    expect(creditsApi.history).toHaveBeenLastCalledWith({ page: 2, limit: 20 });
  });

  it('says so when there is no activity yet', async () => {
    creditsApi.history.mockResolvedValue({ items: [], meta: { page: 1, limit: 20, total: 0, total_pages: 1 } });
    setup();
    expect(await screen.findByText('No credit activity yet')).toBeInTheDocument();
  });
});
