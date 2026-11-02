import React, { useId } from 'react';
import { Drawer } from '@mui/material';

/**
 * A panel that slides in from the right: for work that belongs next to the page
 * it was started from (uploading, editing) rather than over it. Same contract as
 * Modal — title, body, footer, and `locked` / `busy` for while a request runs,
 * when the backdrop, Esc and the close button must not drop it.
 */
export const Sheet = ({ open, onClose, title, description, children, footer, locked = false, busy = false }) => {
  const titleId = useId();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={(event, reason) => {
        if (locked) return;
        onClose?.(reason);
      }}
      className="AppSheet"
      slotProps={{ paper: { className: 'AppSheet-Paper', 'aria-labelledby': titleId, role: 'dialog', 'aria-modal': true } }}
    >
      {busy && <div className="AppModal-Progress" role="progressbar" aria-label="Working" />}
      <div className="AppSheet-Head">
        <div>
          <h2 className="AppSheet-Title" id={titleId}>
            {title}
          </h2>
          {description && <p className="AppSheet-Desc">{description}</p>}
        </div>
        <button type="button" className="AppModal-Close" aria-label="Close" onClick={onClose} disabled={locked}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="AppSheet-Body">{children}</div>
      {footer && <div className="AppSheet-Foot">{footer}</div>}
    </Drawer>
  );
};
