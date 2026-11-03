import { describe, it, expect } from 'vitest';
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchSelect } from './SearchSelect';
import { ProductIcon } from './ProductIcon';

const OPTIONS = [
  { value: 1, label: 'AI Model', hint: 'General purpose model usage' },
  { value: 2, label: 'CV Parser', hint: 'Structured data from resumes' },
  { value: 3, label: 'Invoice Parser', hint: 'Invoices to data', disabled: true, note: 'Added' },
  { value: 4, label: 'OCR', hint: 'Text from images' },
];

const Harness = ({ initial = '' }) => {
  const [value, setValue] = useState(initial);
  return (
    <>
      <label htmlFor="p">Product</label>
      <SearchSelect id="p" value={value} options={OPTIONS} onChange={setValue} placeholder="Select a product" />
      <output data-testid="value">{String(value)}</output>
    </>
  );
};

describe('SearchSelect', () => {
  it('opens on click, filters while typing and picks with Enter', async () => {
    render(<Harness />);
    const input = screen.getByRole('combobox', { name: 'Product' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(4);

    await userEvent.type(input, 'parser');
    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      expect.stringContaining('CV Parser'),
      expect.stringContaining('Invoice Parser'),
    ]);

    await userEvent.keyboard('{Enter}');
    expect(screen.getByTestId('value')).toHaveTextContent('2');
    expect(input).toHaveValue('CV Parser');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('matches the hint text as well as the label', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('resumes');
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  it('skips disabled options with the arrow keys and never picks them', async () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input); // active starts on the first enabled option (AI Model)
    await userEvent.keyboard('{ArrowDown}{ArrowDown}'); // CV Parser, then OCR — Invoice Parser is skipped
    await userEvent.keyboard('{Enter}');
    expect(screen.getByTestId('value')).toHaveTextContent('4');

    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: /Invoice Parser/ }));
    expect(screen.getByTestId('value')).toHaveTextContent('4');
  });

  it('keeps the old value on Escape and shows an empty state', async () => {
    render(<Harness initial={1} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('AI Model');

    await userEvent.click(input);
    await userEvent.keyboard('zzz');
    expect(screen.getByText(/No match for/)).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveValue('AI Model');
    expect(screen.getByTestId('value')).toHaveTextContent('1');
  });
});

describe('ProductIcon', () => {
  it('matches the API path to a bundled icon by file name, and uses an https URL as it is', () => {
    const { container, rerender } = render(<ProductIcon product={{ icon: '/icons/cv-parser.png' }} />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/src/dashboard/assets/product-icons/cv-parser.png');

    rerender(<ProductIcon product={{ icon: 'https://cdn.example.com/x.png' }} />);
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://cdn.example.com/x.png');
  });

  it('falls back to the Field mark when there is no icon, no bundled one, or it fails to load', () => {
    const { container, rerender } = render(<ProductIcon product={{ icon: '' }} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.ProductIcon--fallback svg')).not.toBeNull();

    rerender(<ProductIcon product={{ icon: '/icons/ocr.png' }} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.ProductIcon--fallback svg')).not.toBeNull();

    rerender(<ProductIcon product={{ icon: 'https://cdn.example.com/missing.png' }} />);
    const img = container.querySelector('img');
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.ProductIcon--fallback svg')).not.toBeNull();
  });
});
