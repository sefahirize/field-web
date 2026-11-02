import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Modal } from '@dashboard/components/elements/Modal';
import { ProductSelect } from '@dashboard/components/elements/ProductSelect';
import { FileDropzone } from '@dashboard/components/elements/FileDropzone';
import { CodeBlock } from '@dashboard/components/elements/CodeBlock';
import { runProcess } from '@dashboard/features/apiCredentials/apiCredentialsSlice';
import { DOCUMENT_ACCEPT } from '@dashboard/features/documents/documentsApi';
import { fetchProducts, selectListedProducts } from '@dashboard/features/products/productsSlice';
import { MAX_FILE_SIZE } from '@dashboard/data';
import { formatBytes, toBareBase64 } from '@dashboard/libs/files';

/**
 * POST /process with a key, the way an API consumer calls it — X-API-Key, not
 * the dashboard session. Shows the status and body whatever they are, since
 * the point is to see how the endpoint treats this key. A secret is only shown
 * once, so the field starts with the one just created or regenerated.
 */
export const TestKeyModal = ({ initialKey, onClose }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectListedProducts);
  const { status, result, error } = useSelector(state => state.apiCredentials.process);

  const [apiKey, setApiKey] = useState(initialKey ?? '');
  const [productKey, setProductKey] = useState('');
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!productKey && products.length > 0) setProductKey(products[0].key);
  }, [productKey, products]);

  const running = status === 'running';
  const resultRef = useRef(null);

  // The answer can land while the body is scrolled to the form; bring it in view.
  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [result]);

  const pick = ([picked]) => {
    setLocalError(null);
    if (picked && picked.size > MAX_FILE_SIZE) {
      setLocalError(`${picked.name} is over ${formatBytes(MAX_FILE_SIZE)}. Choose a smaller file.`);
      return;
    }
    setFile(picked ?? null);
  };

  const send = async event => {
    event.preventDefault();
    setLocalError(null);

    let data;
    try {
      data = await toBareBase64(file);
    } catch {
      setLocalError('Could not read that file.');
      return;
    }
    dispatch(runProcess({ apiKey: apiKey.trim(), productKey, fileName: file.name, data }));
  };

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      // A stray click must not drop a request that is in flight; the request
      // itself lives in the store, so it finishes and shows its answer here.
      locked={running}
      busy={running}
      title="Test an API key"
      description="Sends one file to POST /process with the key in an X-API-Key header, as your own code would. It spends credits like an upload, and the document shows up under Documents."
      footer={
        <>
          <Button variant="outlined" size="large" onClick={onClose} disabled={running}>
            Close
          </Button>
          <Button
            variant="contained"
            size="large"
            type="submit"
            form="test-key-form"
            disabled={running || !apiKey.trim() || !productKey || !file}
          >
            {running ? (
              <>
                <span className="BtnSpinner" aria-hidden="true" />
                Sending…
              </>
            ) : (
              'Send request'
            )}
          </Button>
        </>
      }
    >
      <form id="test-key-form" className="KeyForm" onSubmit={send}>
        <div className="FormField">
          <label className="FormField-Label" htmlFor="test-key">
            API key
          </label>
          <input
            id="test-key"
            className="FormField-Input"
            value={apiKey}
            onChange={event => setApiKey(event.target.value)}
            disabled={running}
            placeholder="Paste a secret key"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="FormField">
          <label className="FormField-Label" htmlFor="process-product">
            Product
          </label>
          <ProductSelect
            id="process-product"
            products={products}
            value={productKey}
            onChange={setProductKey}
            disabled={running}
          />
        </div>

        <div className="FormField">
          <span className="FormField-Label">File</span>
          <FileDropzone
            id="test-key-file"
            multiple={false}
            files={file ? [file] : []}
            onAdd={pick}
            onRemove={() => setFile(null)}
            onClear={() => setFile(null)}
            accept={DOCUMENT_ACCEPT}
            hint={`PDF, JPG, PNG, DOC or DOCX · up to ${formatBytes(MAX_FILE_SIZE)}`}
            disabled={running}
          />
        </div>

        {running && (
          <div className="RunStatus" role="status">
            <span className="RunStatus-Dot" aria-hidden="true" />
            <span>
              Sending your file to /process. The server processes it before it answers, so this can take a few seconds
              per file — you can leave this window open.
            </span>
          </div>
        )}

        {(localError || error) && (
          <div className="auth-error" role="alert">
            {localError || error}
          </div>
        )}

        {result && (
          <div className="TestResult" ref={resultRef}>
            <div className={`TestResult-Status ${result.ok ? 'is-ok' : 'is-fail'}`}>
              <span className="TestResult-Code">HTTP {result.status}</span>
              {result.body?.message && <span>{result.body.message}</span>}
            </div>
            <CodeBlock text={JSON.stringify(result.body, null, 2)} label="Copy response" />
          </div>
        )}
      </form>
    </Modal>
  );
};
