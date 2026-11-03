import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CopyButton } from './CopyButton';
import { CodeBlock } from './CodeBlock';

afterEach(() => {
  vi.useRealTimers();
});

describe('CopyButton', () => {
  it('copies the text, says Copied, and goes back after a moment', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });
    render(<CopyButton text="hello" label="Copy result" />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy result' }));
    });
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(screen.getByRole('button', { name: 'Copied' })).toHaveClass('is-copied');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');

    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.getByRole('button', { name: 'Copy result' })).not.toHaveClass('is-copied');
  });

  it('says so when the browser refuses', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    document.execCommand = vi.fn().mockReturnValue(false);
    render(<CopyButton text="x" />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    });
    expect(screen.getByRole('status')).toHaveTextContent('Could not copy');
  });

  it('falls back to execCommand where there is no clipboard API', async () => {
    Object.assign(navigator, { clipboard: undefined });
    document.execCommand = vi.fn().mockReturnValue(true);
    render(<CopyButton text="x" />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
  });
});

describe('CodeBlock', () => {
  it('shows the code with a copy button', () => {
    render(<CodeBlock text={'{\n  "a": 1\n}'} label="Copy result" />);
    expect(screen.getByRole('button', { name: 'Copy result' })).toBeInTheDocument();
    expect(screen.getByText(/"a": 1/)).toBeInTheDocument();
  });
});
