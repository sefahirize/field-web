import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { snackActions } from '@dashboard/libs/snackbar';

const Close = ({ onClick }) => (
  <button type="button" className="UploadToast-Close" aria-label="Dismiss" onClick={onClick}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  </button>
);

const names = (list, max = 2) => {
  const shown = list.slice(0, max).join(', ');
  return list.length > max ? `${shown} and ${list.length - max} more` : shown;
};

/**
 * Shown for as long as an upload runs. It reads the store, so it keeps counting
 * ("2 of 5") without anyone re-issuing it. Custom toasts must forward their ref.
 */
export const UploadProgressToast = forwardRef(({ toastKey }, ref) => {
  const { total, done, names: files } = useSelector(state => state.documents.upload);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="UploadToast" role="status" ref={ref}>
      <span className="UploadToast-Icon UploadToast-Icon--busy" aria-hidden="true">
        <span className="ToastSpinner" />
      </span>
      <div className="UploadToast-Text">
        <strong className="UploadToast-Title">{total === 1 ? 'Processing 1 file' : `Processing ${total} files`}</strong>
        <span className="UploadToast-Sub">
          {total > 1 ? `${done} of ${total} done · ` : ''}
          {names(files)}
        </span>
        <span className="UploadToast-Hint">You can keep working — we will tell you when it is ready.</span>
        <span className="UploadToast-Bar" aria-hidden="true">
          <span style={{ width: `${Math.max(percent, 6)}%` }} />
        </span>
      </div>
      <Close onClick={() => snackActions.close(toastKey)} />
    </div>
  );
});

/**
 * What an upload ended in: the documents it made — with a link to the one, or to
 * the list when there are several — and the files it could not process.
 */
export const UploadDoneToast = forwardRef(({ toastKey, documents, errors, to, linkLabel }, ref) => {
  const ok = documents.length;
  const failed = errors.length;
  const tone = ok === 0 ? 'fail' : failed > 0 ? 'mixed' : 'ok';

  return (
    <div className={`UploadToast UploadToast--${tone}`} role={failed > 0 ? 'alert' : 'status'} ref={ref}>
      <span className={`UploadToast-Icon UploadToast-Icon--${tone}`} aria-hidden="true">
        {ok > 0 ? '✓' : '!'}
      </span>
      <div className="UploadToast-Text">
        <strong className="UploadToast-Title">
          {ok > 0 ? (ok === 1 ? '1 document is ready' : `${ok} documents are ready`) : 'Nothing was processed'}
        </strong>
        {ok > 0 && <span className="UploadToast-Sub">{names(documents.map(doc => doc.file_name || 'Untitled'))}</span>}
        {failed > 0 && (
          <span className="UploadToast-Failed">
            {failed === 1 ? '1 file failed' : `${failed} files failed`}:{' '}
            {errors
              .slice(0, 2)
              .map(e => `${e.fileName || 'A file'} — ${e.message}`)
              .join('; ')}
            {failed > 2 ? ` and ${failed - 2} more` : ''}
          </span>
        )}
        {ok > 0 && (
          <Link className="UploadToast-Link" href={to} onClick={() => snackActions.close(toastKey)}>
            {linkLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <Close onClick={() => snackActions.close(toastKey)} />
    </div>
  );
});

export const UploadErrorToast = forwardRef(({ toastKey, message }, ref) => (
  <div className="UploadToast UploadToast--fail" role="alert" ref={ref}>
    <span className="UploadToast-Icon UploadToast-Icon--fail" aria-hidden="true">
      !
    </span>
    <div className="UploadToast-Text">
      <strong className="UploadToast-Title">The upload did not go through</strong>
      <span className="UploadToast-Failed">{message}</span>
    </div>
    <Close onClick={() => snackActions.close(toastKey)} />
  </div>
));

UploadProgressToast.displayName = 'UploadProgressToast';
UploadDoneToast.displayName = 'UploadDoneToast';
UploadErrorToast.displayName = 'UploadErrorToast';
