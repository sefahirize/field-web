import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Modal } from '@dashboard/components/elements/Modal';
import { API_ENVIRONMENTS } from '@dashboard/features/apiCredentials/apiCredentialsApi';
import { expiresDaysOf } from '@dashboard/features/apiCredentials/keyFields';

const ENVIRONMENT_COPY = {
  test: { label: 'Test', text: 'For building and trying things out.' },
  production: { label: 'Production', text: 'For applications that are live.' },
};

const PRESETS = [
  { id: 'never', label: 'Never', days: 0 },
  { id: '30', label: '30 days', days: 30 },
  { id: '90', label: '90 days', days: 90 },
  { id: '365', label: '1 year', days: 365 },
  { id: 'custom', label: 'Custom' },
];

/** The form's starting point for a new key, or for the key being edited. */
const initialState = row => {
  if (!row) return { name: '', environment: 'test', expiry: 'never', custom: '' };

  const days = expiresDaysOf(row);
  const remaining = days > 0 ? days : null;
  const preset = PRESETS.find(p => p.days === remaining);

  return {
    name: row.name ?? '',
    environment: row.environment ?? 'test',
    // A key that already expires keeps its expiry unless it is changed here.
    expiry: remaining === null ? 'never' : preset ? preset.id : row.expires_at ? 'keep' : 'custom',
    custom: remaining === null ? '' : String(remaining),
    keepDays: remaining,
  };
};

/**
 * Create a key, or edit one. The expiry is chosen from presets because that is
 * what people want ("90 days"), with a custom number behind "Custom". Editing a
 * key that expires offers to keep that date.
 */
export const KeyFormModal = ({ row, saving, error, onSubmit, onClose }) => {
  const editing = Boolean(row);
  const [form, setForm] = useState(() => initialState(row));

  const set = patch => setForm(prev => ({ ...prev, ...patch }));

  const expiresDays = (() => {
    if (form.expiry === 'custom') return Number(form.custom);
    if (form.expiry === 'keep') return form.keepDays;
    return PRESETS.find(p => p.id === form.expiry)?.days ?? 0;
  })();

  const customInvalid = form.expiry === 'custom' && !(Number.isInteger(expiresDays) && expiresDays > 0);
  const canSave = form.name.trim().length > 0 && !customInvalid && !saving;

  const submit = event => {
    event.preventDefault();
    if (canSave) onSubmit({ name: form.name.trim(), environment: form.environment, expiresDays });
  };

  const presets = form.keepDays && !PRESETS.some(p => p.days === form.keepDays)
    ? [...PRESETS.slice(0, -1), { id: 'keep', label: `Keep (${form.keepDays}d left)` }, PRESETS[PRESETS.length - 1]]
    : PRESETS;

  return (
    <Modal
      open
      onClose={saving ? undefined : onClose}
      title={editing ? 'Edit API key' : 'Create an API key'}
      description={
        editing
          ? 'Change how this key is named, labelled and when it expires. Its secret stays the same.'
          : 'You will see the secret once, right after you create it.'
      }
      footer={
        <>
          <Button variant="outlined" size="large" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" size="large" type="submit" form="api-key-form" disabled={!canSave}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Create key'}
          </Button>
        </>
      }
    >
      <form id="api-key-form" className="KeyForm" onSubmit={submit}>
        <div className="FormField">
          <label className="FormField-Label" htmlFor="key-name">
            Name
          </label>
          <input
            id="key-name"
            className="FormField-Input"
            value={form.name}
            onChange={event => set({ name: event.target.value })}
            placeholder="e.g. Production backend"
            maxLength={100}
            autoComplete="off"
            autoFocus
            required
          />
          <span className="FormField-Help">Something you will recognise later. It is only for you.</span>
        </div>

        <fieldset className="KeyForm-Group">
          <legend className="FormField-Label">Environment</legend>
          <div className="OptionCards" role="radiogroup" aria-label="Environment">
            {API_ENVIRONMENTS.map(env => (
              <label className={`OptionCard ${form.environment === env ? 'is-selected' : ''}`} key={env}>
                <input
                  type="radio"
                  name="environment"
                  value={env}
                  checked={form.environment === env}
                  onChange={() => set({ environment: env })}
                />
                <span className="OptionCard-Label">{ENVIRONMENT_COPY[env]?.label ?? env}</span>
                <span className="OptionCard-Text">{ENVIRONMENT_COPY[env]?.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="KeyForm-Group">
          <legend className="FormField-Label">Expires</legend>
          <div className="Segmented" role="radiogroup" aria-label="Expiry">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={form.expiry === preset.id}
                className={`Segmented-Option ${form.expiry === preset.id ? 'is-selected' : ''}`}
                onClick={() => set({ expiry: preset.id })}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {form.expiry === 'custom' && (
            <div className="KeyForm-Custom">
              <input
                className={`FormField-Input ${customInvalid ? 'is-invalid' : ''}`}
                type="text"
                inputMode="numeric"
                aria-label="Days until the key expires"
                placeholder="Number of days"
                value={form.custom}
                onChange={event => set({ custom: event.target.value.replace(/\D/g, '').slice(0, 5) })}
                aria-invalid={customInvalid}
              />
              <span className="FormField-Help">days from today</span>
            </div>
          )}
        </fieldset>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
};
