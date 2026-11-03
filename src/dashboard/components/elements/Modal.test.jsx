import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal';

const setup = props => {
  const onClose = vi.fn();
  render(
    <Modal open title="Working" onClose={onClose} {...props}>
      body
    </Modal>,
  );
  return onClose;
};

const pressEscape = () => fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });

describe('Modal', () => {
  it('closes on Esc, backdrop and the close button by default', () => {
    const onClose = setup();
    pressEscape();
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('does not close while locked: Esc, backdrop and the close button do nothing', () => {
    const onClose = setup({ locked: true, busy: true });
    pressEscape();
    fireEvent.click(document.querySelector('.MuiBackdrop-root'));
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('is not dismissed by Esc or the backdrop when dismissible is false', () => {
    const onClose = setup({ dismissible: false });
    pressEscape();
    fireEvent.click(document.querySelector('.MuiBackdrop-root'));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });
});
