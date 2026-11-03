import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TruncatedText } from './TruncatedText';

const LONG = 'File uploaded successfully. SHA-256: 01fc202c86024569562a234643d21728ad3fd707bfb6c82a21ea102c09996d01';

const sizes = (scrollWidth, clientWidth) => {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth);
};

afterEach(() => vi.restoreAllMocks());

describe('TruncatedText', () => {
  it('shows the whole text in a tooltip, and can be focused, when it is cut off', async () => {
    sizes(600, 200);
    render(<TruncatedText text={LONG} />);

    const line = screen.getByText(LONG);
    expect(line).toHaveAttribute('tabindex', '0');

    await userEvent.hover(line);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(LONG);
  });

  it('adds no tooltip and no tab stop when the text fits', async () => {
    sizes(100, 200);
    render(<TruncatedText text="AI extraction completed" />);

    const line = screen.getByText('AI extraction completed');
    expect(line).not.toHaveAttribute('tabindex');
    await userEvent.hover(line);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
