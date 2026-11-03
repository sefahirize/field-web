import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import documentsReducer, { clearUploadResult, uploadDocuments } from './documentsSlice';
import { documentsApi } from './documentsApi';

vi.mock('axios', () => ({}));
vi.mock('./documentsApi', () => ({
  documentsApi: { upload: vi.fn(), list: vi.fn() },
}));
vi.mock('@dashboard/features/credits/creditsSlice', () => ({ fetchCreditBalance: () => ({ type: 'credits/noop' }) }));

const makeStore = () =>
  configureStore({
    reducer: { documents: documentsReducer },
    middleware: getDefault => getDefault({ serializableCheck: false, immutableCheck: false }),
  });

const files = names => names.map(fileName => ({ fileName, data: 'x' }));
const doc = name => ({ uuid: `uuid-${name}`, file_name: name });

beforeEach(() => {
  vi.clearAllMocks();
  documentsApi.list.mockResolvedValue({ items: [], meta: { page: 1, limit: 20, total: 0, total_pages: 1 }, stats: {} });
});

describe('uploadDocuments', () => {
  it('sends the files one request each, in order, and folds the answers together', async () => {
    documentsApi.upload.mockImplementation(async ({ files: [file] }) => ({
      documents: [doc(file.fileName)],
      errors: [],
      cachedCount: file.fileName === 'b.pdf' ? 1 : 0,
      productName: 'CV Parser',
    }));
    const store = makeStore();

    const pending = store.dispatch(uploadDocuments({ productKey: 'cv_parser', files: files(['a.pdf', 'b.pdf', 'c.pdf']) }));
    expect(store.getState().documents.upload).toMatchObject({ status: 'uploading', total: 3, done: 0, names: ['a.pdf', 'b.pdf', 'c.pdf'] });
    await pending;

    expect(documentsApi.upload.mock.calls.map(([arg]) => arg.files.map(f => f.fileName))).toEqual([['a.pdf'], ['b.pdf'], ['c.pdf']]);
    const { upload } = store.getState().documents;
    expect(upload.status).toBe('done');
    expect(upload.done).toBe(3);
    expect(upload.result.documents.map(d => d.file_name)).toEqual(['a.pdf', 'b.pdf', 'c.pdf']);
    expect(upload.result.cachedCount).toBe(1);
  });

  it('lets one failed file fail alone', async () => {
    documentsApi.upload.mockImplementation(async ({ files: [file] }) => {
      if (file.fileName === 'bad.pdf') throw { response: { status: 400, data: { error: 'unsupported file format' } } };
      return { documents: [doc(file.fileName)], errors: [], cachedCount: 0, productName: null };
    });
    const store = makeStore();

    await store.dispatch(uploadDocuments({ productKey: 'ocr', files: files(['a.pdf', 'bad.pdf', 'c.pdf']) }));

    const { upload } = store.getState().documents;
    expect(upload.status).toBe('done');
    expect(upload.result.documents).toHaveLength(2);
    expect(upload.result.errors).toEqual([{ fileName: 'bad.pdf', message: 'unsupported file format' }]);
  });

  it('refuses a second batch while one is running, and keeps the running one intact', async () => {
    let release;
    documentsApi.upload.mockImplementation(
      () => new Promise(resolve => (release = () => resolve({ documents: [doc('a.pdf')], errors: [], cachedCount: 0, productName: null }))),
    );
    const store = makeStore();

    const first = store.dispatch(uploadDocuments({ productKey: 'ocr', files: files(['a.pdf']) }));
    const second = await store.dispatch(uploadDocuments({ productKey: 'ocr', files: files(['z.pdf']) }));
    expect(second.meta.condition).toBe(true);

    store.dispatch(clearUploadResult()); // must not orphan the running batch
    expect(store.getState().documents.upload.status).toBe('uploading');

    release();
    await first;
    expect(store.getState().documents.upload.status).toBe('done');
    expect(documentsApi.upload).toHaveBeenCalledTimes(1);
  });
});
