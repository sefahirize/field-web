import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { configureStore } from '@reduxjs/toolkit';
import documentsReducer, { uploadDocuments } from '@dashboard/features/documents/documentsSlice';
import { documentsApi } from '@dashboard/features/documents/documentsApi';
import { SnackbarUtilsConfigurator } from '@dashboard/libs/snackbar';
import { UploadNotifier } from './UploadNotifier';

vi.mock('axios', () => ({}));
vi.mock('@dashboard/features/documents/documentsApi', () => ({
  documentsApi: { upload: vi.fn(), list: vi.fn() },
}));
vi.mock('@dashboard/features/credits/creditsSlice', () => ({ fetchCreditBalance: () => ({ type: 'credits/noop' }) }));

const setup = () => {
  const store = configureStore({
    reducer: { documents: documentsReducer },
    middleware: getDefault => getDefault({ serializableCheck: false, immutableCheck: false }),
  });
  render(
    <Provider store={store}>
      <SnackbarProvider maxSnack={5}>
        <SnackbarUtilsConfigurator />
        <UploadNotifier />
      </SnackbarProvider>
    </Provider>,
  );
  return store;
};

const file = name => ({ fileName: name, data: 'x' });

beforeEach(() => {
  documentsApi.list.mockResolvedValue({ items: [], meta: { page: 1, limit: 20, total: 0, total_pages: 1 }, stats: {} });
});

describe('UploadNotifier', () => {
  it('shows progress while files are processed, then a result with a link to the document', async () => {
    const releases = [];
    documentsApi.upload.mockImplementation(
      ({ files }) =>
        new Promise(resolve =>
          releases.push(() => resolve({ documents: [{ uuid: 'u-1', file_name: files[0].fileName }], errors: [], cachedCount: 0, productName: 'OCR' })),
        ),
    );
    const store = setup();

    let pending;
    await act(async () => {
      pending = store.dispatch(uploadDocuments({ productKey: 'ocr', files: [file('scan.png')] }));
    });
    expect(await screen.findByText('Processing 1 file')).toBeInTheDocument();
    expect(screen.getByText(/keep working/i)).toBeInTheDocument();

    await act(async () => {
      releases[0]();
      await pending;
    });

    expect(await screen.findByText('1 document is ready')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /open document/i });
    expect(link).toHaveAttribute('href', '/app/documents/u-1');
  });

  it('links to the list when several documents are ready, and reports the ones that failed', async () => {
    documentsApi.upload.mockImplementation(async ({ files: [f] }) => {
      if (f.fileName === 'bad.pdf') throw { response: { status: 400, data: { error: 'unsupported file format' } } };
      return { documents: [{ uuid: `u-${f.fileName}`, file_name: f.fileName }], errors: [], cachedCount: 0, productName: null };
    });
    const store = setup();

    await act(async () => {
      await store.dispatch(uploadDocuments({ productKey: 'ocr', files: [file('a.pdf'), file('bad.pdf'), file('c.pdf')] }));
    });

    expect(await screen.findByText('2 documents are ready')).toBeInTheDocument();
    expect(screen.getByText(/1 file failed/)).toHaveTextContent('bad.pdf — unsupported file format');
    expect(screen.getByRole('link', { name: /view documents/i })).toHaveAttribute('href', '/app/documents');
  });

  it('does not call a document ready when its processing failed, but still links to it', async () => {
    documentsApi.upload.mockResolvedValue({
      documents: [{ uuid: 'u-1', file_name: 'broken.pdf', status: 'failed' }],
      errors: [],
      cachedCount: 0,
      productName: null,
    });
    const store = setup();

    await act(async () => {
      await store.dispatch(uploadDocuments({ productKey: 'cv_parser', files: [file('broken.pdf')] }));
    });

    expect(await screen.findByText('Nothing was processed')).toBeInTheDocument();
    expect(screen.queryByText(/documents? (is|are) ready/)).toBeNull();
    expect(screen.getByText(/1 file failed/)).toHaveTextContent('broken.pdf — processing failed');
    expect(screen.getByRole('link', { name: /open document/i })).toHaveAttribute('href', '/app/documents/u-1');
  });

  it('counts only the processed documents as ready when some failed', async () => {
    documentsApi.upload.mockImplementation(async ({ files: [f] }) => ({
      documents: [{ uuid: `u-${f.fileName}`, file_name: f.fileName, status: f.fileName === 'broken.pdf' ? 'failed' : 'completed' }],
      errors: [],
      cachedCount: 0,
      productName: null,
    }));
    const store = setup();

    await act(async () => {
      await store.dispatch(uploadDocuments({ productKey: 'cv_parser', files: [file('cv.pdf'), file('broken.pdf')] }));
    });

    expect(await screen.findByText('1 document is ready')).toBeInTheDocument();
    expect(screen.getByText(/1 file failed/)).toHaveTextContent('broken.pdf — processing failed');
    expect(screen.getByRole('link', { name: /view documents/i })).toHaveAttribute('href', '/app/documents');
  });
});
