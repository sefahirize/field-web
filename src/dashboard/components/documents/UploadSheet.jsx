import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Sheet } from '@dashboard/components/elements/Sheet';
import { FileDropzone } from '@dashboard/components/elements/FileDropzone';
import { ProductSelect } from '@dashboard/components/elements/ProductSelect';
import { encodeFiles, uploadDocuments } from '@dashboard/features/documents/documentsSlice';
import { DOCUMENT_ACCEPT } from '@dashboard/features/documents/documentsApi';
import { mergeFiles, validateFiles } from '@dashboard/features/documents/uploadFiles';
import { fetchProductBalance } from '@dashboard/features/credits/creditsSlice';
import { MAX_FILE_SIZE } from '@dashboard/data';
import { formatBytes } from '@dashboard/libs/files';

/**
 * Starts an upload from a sheet beside the list. It only gathers the product and
 * the files: Upload hands them to the store and closes the sheet at once, so
 * nobody waits on it. How it goes is told by toasts (UploadNotifier) and by the
 * rows that appear in the list as each file finishes.
 *
 * `initialFiles` are files dropped on the page itself before the sheet opened.
 */
export const UploadSheet = ({ products, initialFiles = [], onSubmitted, onClose }) => {
  const dispatch = useDispatch();
  const upload = useSelector(state => state.documents.upload);
  const byProduct = useSelector(state => state.credits.byProduct);

  const [productKey, setProductKey] = useState('');
  const [files, setFiles] = useState([]);
  const [problems, setProblems] = useState(null);

  // One batch at a time: the next can start once the running one is done.
  const busyElsewhere = upload.status === 'uploading';

  const addFiles = picked => {
    const { accepted, problems: rejected } = validateFiles(picked);
    setProblems(rejected.length > 0 ? rejected : null);
    setFiles(current => mergeFiles(current, accepted));
  };

  // A fresh sheet takes whatever was dropped on the page.
  useEffect(() => {
    if (initialFiles.length > 0) addFiles(initialFiles);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Default to the first product once the catalogue arrives.
  useEffect(() => {
    if (!productKey && products.length > 0) setProductKey(products[0].key);
  }, [productKey, products]);

  // GET /credits/balance?product_key= — what the chosen product has left.
  useEffect(() => {
    if (productKey) dispatch(fetchProductBalance(productKey));
  }, [dispatch, productKey]);

  const submit = async () => {
    setProblems(null);
    let encoded;
    try {
      encoded = await encodeFiles(files);
    } catch {
      setProblems(['Could not read those files.']);
      return;
    }

    // Not awaited: the request runs on in the store after the sheet is gone.
    dispatch(uploadDocuments({ productKey, files: encoded }));
    onSubmitted?.();
    onClose();
  };

  const balance = byProduct[productKey];
  const productName = products.find(p => p.key === productKey)?.product_name ?? productKey;

  return (
    <Sheet
      open
      onClose={onClose}
      title="Upload documents"
      description="Choose the product that should process them, then add your files."
      footer={
        <>
          <Button variant="outlined" size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submit} disabled={busyElsewhere || !productKey || files.length === 0}>
            {files.length > 1 ? `Upload ${files.length} files` : 'Upload'}
          </Button>
        </>
      }
    >
      <div className="UploadSheetForm">
        {busyElsewhere && (
          <div className="RunStatus" role="status">
            <span className="RunStatus-Dot" aria-hidden="true" />
            <span>
              Another upload is still being processed ({upload.done} of {upload.total} done). You can add files now and
              upload them when it finishes.
            </span>
          </div>
        )}

        <div className="FormField">
          <label className="FormField-Label" htmlFor="upload-product">
            Product
          </label>
          <ProductSelect id="upload-product" products={products} value={productKey} onChange={setProductKey} />
          <span className="FormField-Help">
            {balance
              ? `${(balance.remaining_credits ?? 0).toLocaleString()} ${productName} credits left.`
              : 'Checking your credits…'}{' '}
            Each file spends credits; with none left, another product’s are converted.
          </span>
        </div>

        <div className="FormField">
          <span className="FormField-Label">Files</span>
          <FileDropzone
            id="upload-files"
            files={files}
            onAdd={addFiles}
            onRemove={index => setFiles(current => current.filter((_, i) => i !== index))}
            onClear={() => setFiles([])}
            accept={DOCUMENT_ACCEPT}
            hint={`PDF, JPG, PNG, DOC or DOCX · up to ${formatBytes(MAX_FILE_SIZE)} each`}
          />
        </div>

        {problems && (
          <div className="auth-error" role="alert">
            {problems.map(problem => (
              <div key={problem}>{problem}</div>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
};
