import React, { useId } from 'react';
import { Dialog } from '@mui/material';

/**
 * The app's one modal: a title (and optional description), a body and a footer
 * for the actions. MUI's Dialog underneath keeps focus inside, closes on Esc
 * and puts focus back where it was.
 *
 * `dismissible={false}` is for a modal that must be ended with its own button —
 * one-time secrets — so a stray click on the backdrop or Esc cannot throw the
 * contents away. `locked` is the temporary version, for while something is
 * running: backdrop, Esc and the close button all do nothing until it is
 * false again. `busy` draws an indeterminate progress bar along the top.
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  locked = false,
  busy = false,
}) => {
  const titleId = useId();

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (locked) return;
        if (!dismissible && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
        onClose?.();
      }}
      className="AppModal"
      aria-labelledby={titleId}
      slotProps={{ paper: { className: `AppModal-Paper AppModal-Paper--${size}` } }}
    >
      {busy && <div className="AppModal-Progress" role="progressbar" aria-label="Working" />}
      <div className="AppModal-Head">
        <div className="AppModal-Heading">
          <h2 className="AppModal-Title" id={titleId}>
            {title}
          </h2>
          {description && <p className="AppModal-Desc">{description}</p>}
        </div>
        {dismissible && (
          <button type="button" className="AppModal-Close" aria-label="Close" onClick={onClose} disabled={locked}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
      <div className="AppModal-Body">{children}</div>
      {footer && <div className="AppModal-Foot">{footer}</div>}
    </Dialog>
  );
};
