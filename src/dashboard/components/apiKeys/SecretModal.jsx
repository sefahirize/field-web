import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { Modal } from '@dashboard/components/elements/Modal';

/**
 * The one moment a key's secret is on screen. It cannot be dismissed by a click
 * outside or Esc; "Done" ends it, and asks once more if the key was never
 * copied, since a lost secret can only be replaced by regenerating the key.
 */
export const SecretModal = ({ revealed, onDone, onTest }) => {
  const [copied, setCopied] = useState(false);
  const [warned, setWarned] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(revealed.secret);
      setCopied(true);
      setWarned(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const done = () => {
    if (revealed.secret && !copied && !warned) {
      setWarned(true);
      return;
    }
    onDone();
  };

  return (
    <Modal
      open
      dismissible={false}
      title="Copy your API key"
      description={`“${revealed.name || 'Untitled key'}” is ready. This is the only time the full key is shown.`}
      footer={
        <>
          {onTest && revealed.secret && (
            <Button variant="outlined" size="large" onClick={onTest}>
              Test this key
            </Button>
          )}
          <Button variant="contained" size="large" onClick={done}>
            {warned && !copied ? 'Close anyway' : 'Done'}
          </Button>
        </>
      }
    >
      {revealed.secret ? (
        <div className="SecretBox">
          <code className="SecretBox-Value" aria-label="Secret key">
            {revealed.secret}
          </code>
          <Button variant={copied ? 'outlined' : 'contained'} size="small" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      ) : (
        // The secret's field name is unverified; show what came back rather than lose it.
        <div className="auth-notice">
          The key was saved, but its secret was not found in the response:{' '}
          <code>{JSON.stringify(revealed.raw)}</code>
        </div>
      )}

      <div className={`SecretNote ${warned && !copied ? 'is-warned' : ''}`} role={warned && !copied ? 'alert' : undefined}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        <span>
          {warned && !copied
            ? 'You have not copied the key yet. If you close this, the only way to get a working key is to regenerate it.'
            : 'Store it somewhere safe, like a password manager or your server’s secrets. Field cannot show it again — if it is lost, regenerate the key.'}
        </span>
      </div>
    </Modal>
  );
};
