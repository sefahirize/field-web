import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ROUTE_PATHS, documentPath } from '@dashboard/data/paths';
import { snackActions } from '@dashboard/libs/snackbar';
import {
  UploadDoneToast,
  UploadErrorToast,
  UploadProgressToast,
  uploadFailures,
} from '@dashboard/components/documents/UploadToasts';

const PLACEMENT = { vertical: 'bottom', horizontal: 'right' };

/**
 * Tells the user how an upload is going, from wherever they are in the app: a
 * toast that stays while files are being processed, then one with the result and
 * a link to it. It lives in the signed-in layout rather than on the Documents
 * page, because the upload outlives the sheet that started it and the page the
 * user may have left. Also asks the browser to confirm closing the tab mid-upload,
 * since that would cancel the request.
 */
export const UploadNotifier = () => {
  const upload = useSelector(state => state.documents.upload);
  const handled = useRef({ start: null, end: null });
  const progressKey = useRef(null);

  useEffect(() => {
    if (!upload.id) return;

    if (upload.status === 'uploading' && handled.current.start !== upload.id) {
      handled.current.start = upload.id;
      progressKey.current = snackActions.custom(key => <UploadProgressToast toastKey={key} />, {
        persist: true,
        anchorOrigin: PLACEMENT,
      });
      return;
    }

    if ((upload.status === 'done' || upload.status === 'error') && handled.current.end !== upload.id) {
      handled.current.end = upload.id;
      if (progressKey.current) snackActions.close(progressKey.current);
      progressKey.current = null;

      if (upload.status === 'error') {
        snackActions.custom(key => <UploadErrorToast toastKey={key} message={upload.error} />, {
          persist: true,
          anchorOrigin: PLACEMENT,
        });
        return;
      }

      const { documents, errors } = upload.result;
      const single = documents.length === 1 && documents[0].uuid;
      snackActions.custom(
        key => (
          <UploadDoneToast
            toastKey={key}
            documents={documents}
            errors={errors}
            to={single ? documentPath(documents[0].uuid) : ROUTE_PATHS.DOCUMENTS}
            linkLabel={single ? 'Open document' : 'View documents'}
          />
        ),
        {
          // Something that failed stays until it is read; a clean result can leave on its own.
          persist: uploadFailures(documents, errors).length > 0 || documents.length === 0,
          autoHideDuration: 15000,
          anchorOrigin: PLACEMENT,
        },
      );
    }
  }, [upload.status, upload.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (upload.status !== 'uploading') return undefined;
    const warn = event => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [upload.status]);

  return null;
};
