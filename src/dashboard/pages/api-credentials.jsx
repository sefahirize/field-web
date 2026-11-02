'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Menu, MenuItem } from '@mui/material';

import {
  clearApiCredentialsFeedback,
  consumeApiCredentialsMessage,
  createApiCredential,
  deleteApiCredential,
  dismissRevealed,
  fetchApiCredential,
  fetchApiCredentials,
  regenerateApiCredential,
  updateApiCredential,
} from '@dashboard/features/apiCredentials/apiCredentialsSlice';
import {
  createdAt,
  describeExpiry,
  expiresDaysOf,
  formatDate,
  keyPrefix,
  lastUsedAt,
} from '@dashboard/features/apiCredentials/keyFields';
import { DialogConfirm } from '@dashboard/components/modals/DialogConfirm';
import { KeyFormModal } from '@dashboard/components/apiKeys/KeyFormModal';
import { SecretModal } from '@dashboard/components/apiKeys/SecretModal';
import { TestKeyModal } from '@dashboard/components/apiKeys/TestKeyModal';
import { TEST_TOOLS_ENABLED } from '@dashboard/data';
import { snackActions } from '@dashboard/libs/snackbar';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ApiCredentials = () => {
  const dispatch = useDispatch();
  const { items, status, error, saving, actionError, message, revealed } = useSelector(state => state.apiCredentials);

  const [modal, setModal] = useState(null); // { kind: 'form', row? } | { kind: 'test', key? }
  const [confirm, setConfirm] = useState(null); // { kind: 'delete' | 'regenerate', row }
  const [menu, setMenu] = useState(null); // { anchor, row }

  useEffect(() => {
    dispatch(fetchApiCredentials());
    return () => {
      dispatch(clearApiCredentialsFeedback());
      // A secret must not survive leaving the page.
      dispatch(dismissRevealed());
    };
  }, [dispatch]);

  // A success message is a moment, not a fixture: show it as a toast once.
  useEffect(() => {
    if (!message) return;
    snackActions.success(message);
    dispatch(consumeApiCredentialsMessage());
  }, [message, dispatch]);

  // Which optional columns this account's keys actually carry.
  const columns = useMemo(
    () => ({
      created: items.some(row => createdAt(row)),
      lastUsed: items.some(row => lastUsedAt(row)),
    }),
    [items],
  );

  const closeModal = () => {
    setModal(null);
    dispatch(clearApiCredentialsFeedback());
  };

  const saveKey = async values => {
    const row = modal?.row;
    const action = row ? updateApiCredential({ id: row.id, values }) : createApiCredential(values);
    const result = await dispatch(action);
    if (!result.error) setModal(null);
  };

  // The form starts from GET /api-credentials/:id rather than the list row, so
  // an edit never begins from a stale copy; the row is the fallback.
  const startEdit = async row => {
    setMenu(null);
    dispatch(clearApiCredentialsFeedback());
    const result = await dispatch(fetchApiCredential(row.id));
    setModal({ kind: 'form', row: !result.error && result.payload ? { ...row, ...result.payload } : row });
  };

  const onConfirm = async () => {
    const { kind, row } = confirm;
    setConfirm(null);
    if (kind === 'delete') {
      await dispatch(deleteApiCredential(row.id));
    } else {
      await dispatch(
        regenerateApiCredential({
          id: row.id,
          values: { name: row.name ?? '', environment: row.environment ?? 'test', expiresDays: expiresDaysOf(row) },
        }),
      );
    }
  };

  const gridColumns = [
    'minmax(0, 2fr)',
    'minmax(0, 1.3fr)',
    columns.created && 'minmax(0, 1fr)',
    columns.lastUsed && 'minmax(0, 1fr)',
    'minmax(0, 1fr)',
    '40px',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="Page Page-ApiCredentials">
      <div className="PageHeading">
        <div>
          <h1 className="PageHeading-Title">API keys</h1>
          <p className="PageHeading-Desc">Keys your applications use to call Field. Treat them like passwords.</p>
        </div>
        <div className="PageHeading-Actions">
          {TEST_TOOLS_ENABLED && (
            <Button variant="outlined" onClick={() => setModal({ kind: 'test' })}>
              Test a key
            </Button>
          )}
          <Button variant="contained" startIcon={<PlusIcon />} onClick={() => setModal({ kind: 'form' })}>
            Create key
          </Button>
        </div>
      </div>

      {error && (
        <div className="Notice Notice--danger" role="alert">
          <span>{error}</span>
          <button type="button" className="Notice-Action" onClick={() => dispatch(fetchApiCredentials())}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && items.length === 0 && (
        <section className="EmptyState">
          <span className="EmptyState-Icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="15.5" r="3.5" />
              <path d="m10.5 13 8-8M15.5 8 18 10.5M18 5.5 20.5 8" />
            </svg>
          </span>
          <h2 className="EmptyState-Title">Create your first API key</h2>
          <p className="EmptyState-Text">
            A key lets your own code call Field. Create one, copy its secret, and add it to your application.
          </p>
          <Button variant="contained" startIcon={<PlusIcon />} onClick={() => setModal({ kind: 'form' })}>
            Create key
          </Button>
        </section>
      )}

      {(status === 'loading' || items.length > 0) && status !== 'error' && (
        <section className="KeyList" aria-label="API keys" aria-busy={status === 'loading' && items.length === 0}>
          <div className="KeyList-Head" style={{ gridTemplateColumns: gridColumns }}>
            <span>Name</span>
            <span>Key</span>
            {columns.created && <span>Created</span>}
            {columns.lastUsed && <span>Last used</span>}
            <span>Expires</span>
            <span />
          </div>

          {status === 'loading' &&
            items.length === 0 &&
            [0, 1, 2].map(i => (
              <div className="KeyRow KeyRow--skeleton" key={i} style={{ gridTemplateColumns: gridColumns }}>
                <span className="Skeleton" />
                <span className="Skeleton" />
                <span className="Skeleton" />
                <span />
              </div>
            ))}

          {items.map(row => {
            const expiry = describeExpiry(row);
            const prefix = keyPrefix(row);
            const production = row.environment === 'production';
            return (
              <div className="KeyRow" key={row.id} style={{ gridTemplateColumns: gridColumns }}>
                <span className="KeyRow-Name">
                  <span className="KeyRow-NameText">{row.name || 'Untitled key'}</span>
                  <span className={`EnvBadge EnvBadge--${production ? 'production' : 'test'}`}>
                    {production ? 'Production' : row.environment === 'test' ? 'Test' : row.environment ?? 'Unknown'}
                  </span>
                </span>
                <span className="KeyRow-Cell" data-label="Key">
                  <code
                    className="KeyRow-Key"
                    title="Only the start of the key is kept; the full secret is shown once, when it is created."
                  >
                    {prefix ?? '••••••••••••'}
                  </code>
                </span>
                {columns.created && (
                  <span className="KeyRow-Cell" data-label="Created">
                    {createdAt(row) ? formatDate(createdAt(row)) : '—'}
                  </span>
                )}
                {columns.lastUsed && (
                  <span className="KeyRow-Cell" data-label="Last used">
                    {lastUsedAt(row) ? formatDate(lastUsedAt(row)) : 'Never'}
                  </span>
                )}
                <span className={`KeyRow-Cell KeyRow-Expiry KeyRow-Expiry--${expiry.tone}`} data-label="Expires">
                  {expiry.text}
                </span>
                <span className="KeyRow-Menu">
                  <button
                    type="button"
                    className="IconButton"
                    aria-label={`Actions for ${row.name || 'key'}`}
                    aria-haspopup="menu"
                    disabled={saving}
                    onClick={event => setMenu({ anchor: event.currentTarget, row })}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <circle cx="12" cy="5" r="1.7" />
                      <circle cx="12" cy="12" r="1.7" />
                      <circle cx="12" cy="19" r="1.7" />
                    </svg>
                  </button>
                </span>
              </div>
            );
          })}
        </section>
      )}

      {items.length > 0 && (
        <p className="KeyNote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          A key’s secret is shown once, when it is created or regenerated. If one is lost, regenerate it.
        </p>
      )}

      <Menu
        anchorEl={menu?.anchor}
        open={Boolean(menu)}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => startEdit(menu.row)}>Edit</MenuItem>
        <MenuItem
          onClick={() => {
            setConfirm({ kind: 'regenerate', row: menu.row });
            setMenu(null);
          }}
        >
          Regenerate secret
        </MenuItem>
        <MenuItem
          className="MenuItem--danger"
          onClick={() => {
            setConfirm({ kind: 'delete', row: menu.row });
            setMenu(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {modal?.kind === 'form' && (
        <KeyFormModal
          key={modal.row?.id ?? 'new'}
          row={modal.row}
          saving={saving}
          error={actionError}
          onSubmit={saveKey}
          onClose={closeModal}
        />
      )}

      {revealed && (
        <SecretModal
          revealed={revealed}
          onDone={() => dispatch(dismissRevealed())}
          onTest={TEST_TOOLS_ENABLED ? () => setModal({ kind: 'test', key: revealed.secret }) : undefined}
        />
      )}

      {modal?.kind === 'test' && <TestKeyModal initialKey={modal.key} onClose={() => setModal(null)} />}

      <DialogConfirm
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        type={confirm?.kind === 'delete' ? 'alert' : 'warning'}
        title={confirm?.kind === 'delete' ? 'Delete this API key?' : 'Regenerate this API key?'}
        desc={
          confirm && (
            <>
              <strong>{confirm.row.name || 'Untitled key'}</strong>{' '}
              {confirm.kind === 'delete'
                ? 'will stop working immediately. This cannot be undone.'
                : 'gets a new secret. Anything still using the current one will stop working.'}
            </>
          )
        }
        TextConfirmButton={confirm?.kind === 'delete' ? 'Delete key' : 'Regenerate'}
        ClickConfirmButton={onConfirm}
      />
    </div>
  );
};
