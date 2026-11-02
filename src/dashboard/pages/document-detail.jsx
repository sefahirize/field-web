'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';

import { DOCUMENT_STATUSES } from '@dashboard/features/documents/documentsApi';
import {
  clearDocumentDetail,
  deleteDocument,
  downloadDocument,
  fetchDocument,
  updateDocumentStatus,
} from '@dashboard/features/documents/documentsSlice';
import { DialogConfirm } from '@dashboard/components/modals/DialogConfirm';
import { TEST_TOOLS_ENABLED } from '@dashboard/data';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { formatBytes } from '@dashboard/libs/files';
import { snackActions } from '@dashboard/libs/snackbar';
import { ProductLabel } from '@dashboard/components/elements/ProductLabel';
import { TruncatedText } from '@dashboard/components/elements/TruncatedText';
import { CodeBlock } from '@dashboard/components/elements/CodeBlock';
import { BackLink } from '@dashboard/components/elements/BackLink';

/**
 * /documents/:uuid — one document: GET /documents/:uuid for the record and its
 * logs, GET …/download for the original file, DELETE to remove it, and (as a
 * test tool) PUT …/status, the parser's write-back.
 */
export const DocumentDetail = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { detail, action } = useSelector(state => state.documents);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchDocument(uuid));
    return () => dispatch(clearDocumentDetail());
  }, [dispatch, uuid]);

  const doc = detail.doc?.uuid === uuid ? detail.doc : null;
  const busy = action.status === 'loading';

  const onDelete = async () => {
    setConfirmDelete(false);
    const result = await dispatch(deleteDocument(uuid));
    if (!result.error) {
      snackActions.success('Document deleted.');
      router.push(ROUTE_PATHS.DOCUMENTS);
    }
  };

  if (!doc) {
    return (
      <div className="Page Page-DocumentDetail">
        <BackLink to={ROUTE_PATHS.DOCUMENTS}>Documents</BackLink>
        <div className="PageHeading">
          <h1 className="PageHeading-Title">{detail.status === 'error' ? 'Document not found' : 'Loading…'}</h1>
        </div>
        {detail.status === 'error' && <div className="auth-error">{detail.error}</div>}
      </div>
    );
  }

  const logs = Array.isArray(doc.logs) ? doc.logs : [];
  const inFlight = doc.status === 'pending' || doc.status === 'processing';

  return (
    <div className="Page Page-DocumentDetail">
      <BackLink to={ROUTE_PATHS.DOCUMENTS}>Documents</BackLink>

      <div className="PageHeading">
        <h1 className="PageHeading-Title">{doc.file_name || 'Untitled'}</h1>
        {(doc.product || doc.product_key) && (
          <p className="PageHeading-Desc">
            <ProductLabel product={doc.product} productKey={doc.product_key} size={20} />
          </p>
        )}
      </div>

      <div className="ProfileForm-Actions">
        <button
          type="button"
          className="Button Button-Primary"
          disabled={busy}
          onClick={() => dispatch(downloadDocument({ uuid, fileName: doc.file_name }))}
        >
          {busy && action.kind === 'download' ? 'Downloading…' : 'Download original'}
        </button>
        <button type="button" className="Button Button-Secondary" disabled={busy} onClick={() => setConfirmDelete(true)}>
          {busy && action.kind === 'delete' ? 'Deleting…' : 'Delete'}
        </button>
        {inFlight && (
          <button type="button" className="Button Button-Ghost" onClick={() => dispatch(fetchDocument(uuid))}>
            Refresh
          </button>
        )}
      </div>

      {action.status === 'error' && action.kind !== 'status' && <div className="auth-error">{action.error}</div>}

      <div className="Panel">
        <div className="Panel-Head">
          <h2 className="Panel-Title">Details</h2>
          <span className={`Badge Badge-${doc.status ?? 'unknown'}`}>{doc.status ?? 'unknown'}</span>
        </div>
        <div className="AccountGrid">
          <Field
            label="Product"
            value={(doc.product || doc.product_key) && <ProductLabel product={doc.product} productKey={doc.product_key} />}
          />
          <Field label="Size" value={formatBytes(doc.file_size)} />
          <Field label="Type" value={doc.mime_type} />
          <Field label="From cache" value={doc.is_cached ? 'Yes — an identical file was processed before' : 'No'} />
          <Field label="Uploaded" value={formatDate(doc.created_at)} />
          <Field label="Processed" value={formatDate(doc.processed_at)} empty="Not yet" />
          <Field label="Document ID" value={doc.uuid} />
          <Field label="SHA-256" value={doc.file_hash} />
        </div>
      </div>

      <div className="Panel">
        <div className="Panel-Head">
          <h2 className="Panel-Title">Result</h2>
        </div>
        {doc.raw_json ? (
          <CodeBlock text={prettyJson(doc.raw_json)} label="Copy result" />
        ) : (
          <p className="Muted">{inFlight ? 'Still processing.' : 'No result was recorded for this document.'}</p>
        )}
      </div>

      <div className="Panel">
        <div className="Panel-Head">
          <h2 className="Panel-Title">Activity</h2>
        </div>
        <div className="Table Table--activity">
          <div className="Table-Head">
            <span>Event</span>
            <span>Status</span>
            <span>Message</span>
            <span>Date</span>
          </div>
          {logs.length === 0 && <div className="Table-Message">No activity recorded.</div>}
          {logs.map((log, i) => (
            <div className="Table-Row" key={log.id ?? i}>
              <span className="Table-Cell-Strong">{humanize(log.event_type)}</span>
              <span>
                <span className={`Badge Badge-${log.status ?? 'unknown'}`}>{log.status ?? '—'}</span>
              </span>
              <span className="Table-Cell-Fit">
                {log.message ? <TruncatedText text={log.message} /> : '—'}
              </span>
              <span className="Muted">{formatDate(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      {TEST_TOOLS_ENABLED && <StatusTool uuid={uuid} current={doc.status} />}

      <DialogConfirm
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        type="alert"
        title="Delete this document?"
        desc={
          <>
            <strong>{doc.file_name || 'Untitled'}</strong> and its result will be removed. This cannot be undone.
          </>
        }
        TextConfirmButton="Delete"
        ClickConfirmButton={onDelete}
      />
    </div>
  );
};

/**
 * PUT /documents/:uuid/status — the parser's write-back. The API takes it from
 * the user's session, so it can be exercised from here; it is a test tool, not
 * something a customer should have (see TEST_TOOLS_ENABLED).
 */
const StatusTool = ({ uuid, current }) => {
  const dispatch = useDispatch();
  const action = useSelector(state => state.documents.action);
  const [form, setForm] = useState({ status: current ?? 'completed', rawJson: '', logMessage: '' });
  const [localError, setLocalError] = useState(null);

  const setField = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }));
  const saving = action.kind === 'status' && action.status === 'loading';

  const onSubmit = event => {
    event.preventDefault();
    setLocalError(null);

    // raw_json is stored as a string, but anything else reading it expects
    // JSON; catch a typo here rather than saving it.
    if (form.rawJson.trim()) {
      try {
        JSON.parse(form.rawJson);
      } catch {
        setLocalError('Result must be valid JSON, or left empty.');
        return;
      }
    }

    dispatch(
      updateDocumentStatus({
        uuid,
        status: form.status,
        rawJson: form.rawJson.trim() || undefined,
        logMessage: form.logMessage.trim() || undefined,
      }),
    );
  };

  return (
    <div className="Panel">
      <div className="Panel-Head">
        <h2 className="Panel-Title">Set status (test tool)</h2>
      </div>
      <form className="ProfileForm" onSubmit={onSubmit}>
        <p className="Muted">
          PUT /documents/:uuid/status is how the parser reports back. The API accepts it from a user session, so it
          can be tried here. An empty result keeps the current one.
        </p>
        <div className="ProfileForm-Row">
          <label className="FormField">
            <span className="FormField-Label">Status</span>
            <select className="FormField-Input" value={form.status} onChange={setField('status')}>
              {DOCUMENT_STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="FormField">
            <span className="FormField-Label">Log message</span>
            <input
              className="FormField-Input"
              value={form.logMessage}
              onChange={setField('logMessage')}
              placeholder="Optional"
            />
          </label>
        </div>
        <label className="FormField">
          <span className="FormField-Label">Result (raw_json)</span>
          <textarea
            className="FormField-Input FormField-Textarea"
            value={form.rawJson}
            onChange={setField('rawJson')}
            placeholder='Optional, e.g. {"name": "Jane"}'
          />
        </label>

        {(localError || (action.kind === 'status' && action.error)) && (
          <div className="auth-error">{localError || action.error}</div>
        )}
        {action.kind === 'status' && action.message && <div className="auth-notice">{action.message}</div>}

        <div className="ProfileForm-Actions">
          <button type="submit" className="Button Button-Primary" disabled={saving}>
            {saving ? 'Saving…' : 'Set status'}
          </button>
        </div>
      </form>
    </div>
  );
};

/** raw_json arrives as a JSON string; indent it when it parses, show it as-is when not. */
const prettyJson = value => {
  if (typeof value !== 'string') return JSON.stringify(value, null, 2);
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

/** `status_completed` -> `Status completed` */
const humanize = value => {
  if (!value) return 'Event';
  const text = String(value).replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const Field = ({ label, value, empty = '—' }) => (
  <div className="Field">
    <span className="Field-Label">{label}</span>
    <span className="Field-Value">{value || <span className="Muted">{empty}</span>}</span>
  </div>
);

const formatDate = value => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
};
