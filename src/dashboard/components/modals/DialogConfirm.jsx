import React from 'react';
import { Button } from '@mui/material';
import { Modal } from '@dashboard/components/elements/Modal';

const ICONS = {
  alert: <path d="M12 8v5M12 16.5v.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  warning: <path d="M12 8v5M12 16.5v.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  success: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

/**
 * Ask-before-you-do-it dialog. `desc` is React content, never an HTML string,
 * so a file or key name in it cannot inject markup. `type`: alert
 * (destructive, red button), warning, success.
 */
export const DialogConfirm = ({
  open,
  onClose,
  title,
  desc,
  TextConfirmButton,
  ClickConfirmButton,
  type = 'success',
  showCancelButton = true,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="sm"
    title={
      <span className="ConfirmTitle">
        <span className={`ConfirmIcon ConfirmIcon--${type}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[type] ?? ICONS.success}
          </svg>
        </span>
        {title}
      </span>
    }
    footer={
      <>
        {showCancelButton && (
          <Button onClick={onClose} variant="outlined" size="large">
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          size="large"
          color={type === 'alert' ? 'red' : 'primary'}
          className={type === 'alert' ? 'MuiButton-containedRed' : undefined}
          onClick={ClickConfirmButton}
        >
          {TextConfirmButton}
        </Button>
      </>
    }
  >
    <div className="ConfirmDesc">{desc}</div>
  </Modal>
);
