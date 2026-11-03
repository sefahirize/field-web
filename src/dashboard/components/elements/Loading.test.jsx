import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Loading } from './Loading';

const renderWith = (ui, isLoading) =>
  render(
    <Provider store={configureStore({ reducer: { ui: (state = { isLoading }) => state } })}>
      <Loading {...ui} />
    </Provider>,
  );

describe('Loading', () => {
  it('ignores the global request flag: a background request must not cover the page', () => {
    renderWith({}, true);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows only when a page asks for it', () => {
    renderWith({ loading: true }, false);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});
