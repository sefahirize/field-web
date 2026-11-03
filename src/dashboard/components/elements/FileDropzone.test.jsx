import { describe, it, expect, vi } from 'vitest';
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileDropzone } from './FileDropzone';

const file = (name, size = 1024) => new File([new Uint8Array(size)], name, { type: 'application/pdf' });
const dropData = (...files) => ({ dataTransfer: { files, types: ['Files'] } });

const Harness = ({ onAdd = () => {}, disabled = false }) => {
  const [files, setFiles] = useState([]);
  return (
    <FileDropzone
      files={files}
      onAdd={picked => {
        onAdd(picked);
        setFiles(current => [...current, ...picked]);
      }}
      onRemove={index => setFiles(current => current.filter((_, i) => i !== index))}
      onClear={() => setFiles([])}
      accept=".pdf"
      hint="PDF only"
      disabled={disabled}
    />
  );
};

describe('FileDropzone', () => {
  it('highlights while files are dragged over it and takes a drop', () => {
    const onAdd = vi.fn();
    render(<Harness onAdd={onAdd} />);
    const zone = screen.getByRole('button', { name: /drag and drop/i });

    fireEvent.dragEnter(zone, dropData());
    expect(zone).toHaveClass('is-dragging');
    expect(screen.getByText('Drop to add')).toBeInTheDocument();

    fireEvent.drop(zone, dropData(file('a.pdf'), file('b.pdf')));
    expect(zone).not.toHaveClass('is-dragging');
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0].map(f => f.name)).toEqual(['a.pdf', 'b.pdf']);
    expect(screen.getByText('2 files · 2.0 KB')).toBeInTheDocument();
  });

  it('ignores drags that carry no files, such as selected text', () => {
    render(<Harness />);
    const zone = screen.getByRole('button', { name: /drag and drop/i });
    fireEvent.dragEnter(zone, { dataTransfer: { types: ['text/plain'] } });
    expect(zone).not.toHaveClass('is-dragging');
  });

  it('adds files from the picker and lets the same file be picked again', async () => {
    const onAdd = vi.fn();
    const { container } = render(<Harness onAdd={onAdd} />);
    const input = container.querySelector('input[type="file"]');

    await userEvent.upload(input, file('c.pdf'));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
  });

  it('removes one file or clears them all', () => {
    render(<Harness />);
    const zone = screen.getByRole('button', { name: /drag and drop/i });
    fireEvent.drop(zone, dropData(file('a.pdf'), file('b.pdf')));

    fireEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(screen.queryByText('a.pdf')).toBeNull();
    expect(screen.getByText('b.pdf')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.queryByText('b.pdf')).toBeNull();
  });

  it('does nothing when disabled', () => {
    const onAdd = vi.fn();
    render(<Harness onAdd={onAdd} disabled />);
    const zone = screen.getByRole('button', { name: /drag and drop/i });
    fireEvent.drop(zone, dropData(file('a.pdf')));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
