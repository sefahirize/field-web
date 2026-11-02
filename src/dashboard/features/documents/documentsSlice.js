import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { documentsApi } from './documentsApi';
import { fetchCreditBalance } from '@dashboard/features/credits/creditsSlice';
import { toApiError } from '@dashboard/libs/apiError';
import { saveBlob, toBareBase64 } from '@dashboard/libs/files';

const guard = fn => async (arg, thunkApi) => {
  try {
    return await fn(arg, thunkApi);
  } catch (error) {
    return thunkApi.rejectWithValue(toApiError(error));
  }
};

export const fetchDocuments = createAsyncThunk('documents/fetch', guard(query => documentsApi.list(query)));

/** File objects -> what uploadDocuments takes. Kept out of the action: a File is not serialisable. */
export const encodeFiles = files =>
  Promise.all(files.map(async file => ({ fileName: file.name, data: await toBareBase64(file) })));

/**
 * Uploads already-encoded files (see encodeFiles), one request per file.
 *
 * One at a time because the server processes each file inside its request — a
 * few seconds each, so a batch in one request can run for a long time and fail
 * as a whole. Sending them one by one gives a real "2 of 5", lets one bad file
 * fail alone, and makes the list fill up as files finish. The answers are folded
 * into the same `{ documents, errors, cachedCount }` the single request gave.
 *
 * The list is read back after every file and the balance at the end: every file
 * is charged, cached or not. Only one upload runs at a time (the state holds
 * one), so a second is refused until the first is done.
 */
export const uploadDocuments = createAsyncThunk(
  'documents/upload',
  guard(async ({ productKey, files }, { dispatch, getState }) => {
    const documents = [];
    const errors = [];
    let cachedCount = 0;
    let productName = null;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      try {
        const result = await documentsApi.upload({ productKey, files: [file] });
        documents.push(...result.documents);
        errors.push(...result.errors);
        cachedCount += result.cachedCount;
        productName = productName ?? result.productName;
      } catch (error) {
        errors.push({ fileName: file.fileName, message: toApiError(error).message });
      }

      dispatch(uploadProgressed(index + 1));
      dispatch(fetchDocuments(getState().documents.query));
    }

    dispatch(fetchCreditBalance());
    return { documents, errors, cachedCount, productName };
  }),
  { condition: (_, { getState }) => getState().documents.upload.status !== 'uploading' },
);

export const fetchDocument = createAsyncThunk('documents/fetchOne', guard(uuid => documentsApi.get(uuid)));

export const downloadDocument = createAsyncThunk(
  'documents/download',
  guard(async ({ uuid, fileName }) => {
    const { blob, fileName: name } = await documentsApi.download(uuid, fileName);
    saveBlob(blob, name);
    return { fileName: name };
  }),
);

export const deleteDocument = createAsyncThunk(
  'documents/delete',
  guard(async (uuid, { dispatch, getState }) => {
    const result = await documentsApi.remove(uuid);
    dispatch(fetchDocuments(getState().documents.query));
    return result;
  }),
);

export const updateDocumentStatus = createAsyncThunk(
  'documents/updateStatus',
  guard(async ({ uuid, ...values }) => {
    await documentsApi.updateStatus(uuid, values);
    // The answer carries the document but not its logs; read it back whole so
    // the new log entry shows.
    return documentsApi.get(uuid);
  }),
);

const initialState = {
  items: [],
  meta: { page: 1, limit: 20, total: 0, total_pages: 1 },
  stats: { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 },
  query: { page: 1, limit: 20, status: null, search: '', product_key: null },
  status: 'idle',
  error: null,

  // idle | uploading | done | error. While uploading: the batch's `id`, the
  // `names` and `productKey` it was started with, and how many are `done`.
  upload: { status: 'idle', result: null, error: null, id: null, names: [], total: 0, done: 0, productKey: null, finishedAt: null },

  // The document open on the detail page.
  detail: { doc: null, status: 'idle', error: null }, // idle | loading | ready | error
  // Download, delete and status changes on that document.
  action: { kind: null, status: 'idle', error: null, message: null },
};

const ACTIONS = [
  [downloadDocument, 'download', null],
  [deleteDocument, 'delete', 'Document deleted.'],
  [updateDocumentStatus, 'status', 'Status updated.'],
];

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setQuery: (state, { payload }) => {
      // Any change other than the page itself resets to page 1 — staying on
      // page 7 of a filter that now returns two rows shows an empty table.
      const changingPageOnly = Object.keys(payload).length === 1 && 'page' in payload;
      state.query = { ...state.query, ...payload, ...(changingPageOnly ? {} : { page: 1 }) };
    },
    clearUploadResult: state => {
      // Never while a batch is running: that would orphan it.
      if (state.upload.status !== 'uploading') state.upload = initialState.upload;
    },
    uploadProgressed: (state, { payload }) => {
      state.upload.done = payload;
    },
    clearDocumentDetail: state => {
      state.detail = initialState.detail;
      state.action = initialState.action;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDocuments.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, { payload }) => {
        state.items = payload.items;
        state.meta = payload.meta;
        state.stats = payload.stats;
        state.status = 'ready';
      })
      .addCase(fetchDocuments.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? 'Could not load documents.';
      })

      .addCase(uploadDocuments.pending, (state, { meta }) => {
        const files = meta.arg?.files ?? [];
        state.upload = {
          ...initialState.upload,
          status: 'uploading',
          id: meta.requestId,
          names: files.map(file => file.fileName),
          total: files.length,
          productKey: meta.arg?.productKey ?? null,
        };
      })
      .addCase(uploadDocuments.fulfilled, (state, { payload }) => {
        state.upload = { ...state.upload, status: 'done', result: payload, error: null, done: state.upload.total, finishedAt: Date.now() };
      })
      .addCase(uploadDocuments.rejected, (state, { payload, meta }) => {
        // A refused second upload (the condition) never started; leave the running one alone.
        if (meta.condition) return;
        state.upload = {
          ...state.upload,
          status: 'error',
          result: null,
          error: payload?.message ?? 'Could not upload these files.',
          finishedAt: Date.now(),
        };
      })

      .addCase(fetchDocument.pending, state => {
        state.detail.status = 'loading';
        state.detail.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, { payload }) => {
        state.detail = { doc: payload, status: 'ready', error: null };
      })
      .addCase(fetchDocument.rejected, (state, { payload }) => {
        state.detail.status = 'error';
        state.detail.error = payload?.message ?? 'Could not load this document.';
      });

    ACTIONS.forEach(([thunk, kind, message]) => {
      builder
        .addCase(thunk.pending, state => {
          state.action = { kind, status: 'loading', error: null, message: null };
        })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.action = { kind, status: 'done', error: null, message };
          if (thunk === updateDocumentStatus && payload) state.detail.doc = payload;
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.action = { kind, status: 'error', error: payload?.message ?? 'That did not work.', message: null };
        });
    });
  },
});

export const { setQuery, clearUploadResult, uploadProgressed, clearDocumentDetail } = documentsSlice.actions;
export default documentsSlice.reducer;
