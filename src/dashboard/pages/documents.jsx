'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Button } from '@mui/material';

import { useDebouncedCallback } from '@dashboard/libs/useDebouncedCallback';

import { DOCUMENT_STATUSES as STATUSES } from '@dashboard/features/documents/documentsApi';
import { fetchDocuments, setQuery } from '@dashboard/features/documents/documentsSlice';
import { extensionOf } from '@dashboard/features/documents/uploadFiles';
import { fetchProducts, selectListedProducts } from '@dashboard/features/products/productsSlice';
import { ROUTE_PATHS, documentPath } from '@dashboard/data/paths';
import { formatBytes } from '@dashboard/libs/files';
import { fullDate, timeAgo } from '@dashboard/libs/time';
import { ProductSelect } from '@dashboard/components/elements/ProductSelect';
import { ProductLabel } from '@dashboard/components/elements/ProductLabel';
import { TruncatedText } from '@dashboard/components/elements/TruncatedText';
import { UploadSheet } from '@dashboard/components/documents/UploadSheet';

const POLL_MS = 6000;

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 16V5" />
    <path d="m7.5 9.5 4.5-4.5 4.5 4.5" />
    <path d="M5 15v2.5A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V15" />
  </svg>
);

/**
 * The document library: every file the account has sent, with the status
 * counts as tabs, a search and a product filter, and an upload sheet that slides
 * in from the side. Dropping files anywhere on the page opens that sheet with
 * them already added. A list with documents still being processed refreshes
 * itself every few seconds.
 */
export const Documents = () => {
  const dispatch = useDispatch();
  const { items, meta, stats, query, status, error, upload } = useSelector(state => state.documents);
  const products = useSelector(selectListedProducts);

  const [searchText, setSearchText] = useState(query.search ?? '');
  const [sheet, setSheet] = useState(null); // null | { files: File[] }
  const [dragging, setDragging] = useState(false);
  const [fresh, setFresh] = useState(() => new Set());
  const dragDepth = useRef(0);

  const uploading = upload.status === 'uploading';
  // The files still being processed, shown as rows until their real ones arrive.
  const inFlight = uploading ? upload.names.slice(upload.done) : [];

  // Documents a batch just finished are marked for a few seconds. Only a batch
  // that ended just now: coming back to the page later must not flash old ones.
  useEffect(() => {
    if (upload.status !== 'done' || !upload.result || Date.now() - upload.finishedAt > 10000) return undefined;
    setFresh(new Set(upload.result.documents.map(doc => doc.uuid).filter(Boolean)));
    const timer = setTimeout(() => setFresh(new Set()), 8000);
    return () => clearTimeout(timer);
  }, [upload.id, upload.status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDocuments(query));
  }, [dispatch, query]);

  // Quietly refresh while something on the page is still being processed.
  const working = items.some(doc => doc.status === 'pending' || doc.status === 'processing');
  useEffect(() => {
    if (!working) return undefined;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') dispatch(fetchDocuments(query));
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, query, working]);

  // The list refetches on every query change, so typing must not fire per keystroke.
  const commitSearch = useDebouncedCallback(value => dispatch(setQuery({ search: value })), 350);
  const onSearch = value => {
    setSearchText(value);
    commitSearch(value);
  };

  // Files dropped anywhere open the upload sheet with them. While the sheet is
  // open its own drop zone takes them, but the page must still refuse the drop,
  // or the browser would navigate to the file.
  const sheetOpen = Boolean(sheet);
  useEffect(() => {
    const hasFiles = event => Array.from(event.dataTransfer?.types ?? []).includes('Files');

    const onEnter = event => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (sheetOpen) return;
      dragDepth.current += 1;
      setDragging(true);
    };
    const onOver = event => {
      if (hasFiles(event)) event.preventDefault();
    };
    const onLeave = event => {
      if (!hasFiles(event) || sheetOpen) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragging(false);
    };
    const onDrop = event => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      if (!sheetOpen) setSheet({ files: Array.from(event.dataTransfer.files) });
    };

    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, [sheetOpen]);

  const filtered = Boolean(query.search || query.status || query.product_key);
  const clearFilters = () => {
    setSearchText('');
    commitSearch.cancel();
    dispatch(setQuery({ search: '', status: null, product_key: null }));
  };

  const neverUploaded = status === 'ready' && !filtered && !uploading && (stats.total ?? 0) === 0 && items.length === 0;

  // A new upload starts from the whole list, so the files being processed (and the
  // ones that finish) are in view rather than behind a filter.
  const showEverything = () => {
    setSearchText('');
    commitSearch.cancel();
    dispatch(setQuery({ search: '', status: null, product_key: null, page: 1 }));
  };
  const tabs = [{ id: null, label: 'All', count: stats.total }, ...STATUSES.map(s => ({ id: s, label: s, count: stats[s] }))];

  const from = meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="Page Page-Documents">
      <div className="LibraryHead">
        <div>
          <h1 className="PageHeading-Title">Documents</h1>
          <p className="PageHeading-Desc">
            {uploading
              ? `Processing ${upload.done} of ${upload.total} — you can keep working.`
              : stats.total > 0
              ? `${stats.total.toLocaleString()} ${stats.total === 1 ? 'document' : 'documents'} sent through your account.`
              : 'Everything your account has sent through the API.'}
          </p>
        </div>
        <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setSheet({ files: [] })}>
          Upload
        </Button>
      </div>

      {neverUploaded ? (
        <section className="LibraryEmpty">
          <span className="LibraryEmpty-Icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M9 14h6M9 17h4" />
            </svg>
          </span>
          <h2 className="LibraryEmpty-Title">Upload your first document</h2>
          <p className="LibraryEmpty-Text">
            Drop a PDF, image or Word file anywhere on this page, or choose a file. Field processes it with the
            product you pick and keeps the result here.
          </p>
          <div className="LibraryEmpty-Actions">
            <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setSheet({ files: [] })}>
              Upload documents
            </Button>
            <Link className="LibraryEmpty-Link" href={ROUTE_PATHS.API_CREDENTIALS}>
              Or send them from your own code →
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div className="StatusTabs" role="tablist" aria-label="Filter by status">
            {tabs.map(tab => {
              const selected = (query.status ?? null) === tab.id;
              return (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="documents-list"
                  className={`StatusTab ${selected ? 'is-selected' : ''}`}
                  onClick={() => dispatch(setQuery({ status: tab.id }))}
                >
                  {tab.id && <span className={`StatusDot StatusDot--${tab.id}`} aria-hidden="true" />}
                  <span className="StatusTab-Label">{tab.label}</span>
                  <span className="StatusTab-Count">{(tab.count ?? 0).toLocaleString()}</span>
                </button>
              );
            })}
          </div>

          <div className="LibraryTools">
            <div className="LibrarySearch">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                className="LibrarySearch-Input"
                aria-label="Search documents by file name"
                placeholder="Search by file name"
                value={searchText}
                onChange={event => onSearch(event.target.value)}
              />
            </div>
            <div className="LibraryTools-Product">
              <ProductSelect
                id="documents-product-filter"
                products={products}
                allLabel="All products"
                value={query.product_key ?? ''}
                onChange={key => dispatch(setQuery({ product_key: key || null }))}
              />
            </div>
            {filtered && (
              <button type="button" className="LinkButton" onClick={clearFilters}>
                Clear filters
              </button>
            )}
            <span className="LibraryTools-Count" role="status">
              {working && <span className="LiveDot" title="Updating automatically" aria-label="Updating automatically" />}
              {meta.total > 0 ? `${from.toLocaleString()}–${to.toLocaleString()} of ${meta.total.toLocaleString()}` : ''}
            </span>
          </div>

          {error && (
            <div className="Notice Notice--danger" role="alert">
              <span>{error}</span>
              <button type="button" className="Notice-Action" onClick={() => dispatch(fetchDocuments(query))}>
                Try again
              </button>
            </div>
          )}

          <section className="DocList" id="documents-list" role="tabpanel" aria-busy={status === 'loading' && items.length === 0}>
            <div className="DocList-Head" aria-hidden="true">
              <span>Name</span>
              <span>Product</span>
              <span>Status</span>
              <span>Added</span>
              <span />
            </div>

            {status === 'loading' &&
              items.length === 0 &&
              [0, 1, 2, 3, 4].map(i => (
                <div className="DocRow DocRow--skeleton" key={i}>
                  <span className="Skeleton" />
                  <span className="Skeleton" />
                  <span className="Skeleton" />
                  <span className="Skeleton" />
                </div>
              ))}

            {inFlight.map((name, index) => (
              <UploadingRow key={`${upload.id}-${name}-${index}`} name={name} productKey={upload.productKey} active={index === 0} />
            ))}

            {status === 'ready' && items.length === 0 && inFlight.length === 0 && (
              <div className="DocList-Empty">
                <strong>No documents match</strong>
                <span>Try another search, status or product.</span>
                <button type="button" className="Button Button-Secondary" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}

            {items.map(doc => (
              <DocRow key={doc.id ?? doc.uuid ?? doc.file_name} doc={doc} isNew={fresh.has(doc.uuid)} />
            ))}
          </section>

          {meta.total_pages > 1 && (
            <div className="LibraryPager">
              <span className="Muted">
                Page {meta.page} of {meta.total_pages}
              </span>
              <div className="LibraryPager-Buttons">
                <Button
                  variant="outlined"
                  size="small"
                  disabled={meta.page <= 1}
                  onClick={() => dispatch(setQuery({ page: meta.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={meta.page >= meta.total_pages}
                  onClick={() => dispatch(setQuery({ page: meta.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {dragging && (
        <div className="DropOverlay" aria-hidden="true">
          <div className="DropOverlay-Card">
            <UploadIcon />
            <strong>Drop to upload</strong>
            <span>PDF, JPG, PNG, DOC or DOCX</span>
          </div>
        </div>
      )}

      {sheet && (
        <UploadSheet
          products={products}
          initialFiles={sheet.files}
          onSubmitted={showEverything}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
};

/** One document: a whole-row link to its page, with the file type, size, product, status and age. */
const DocRow = ({ doc, isNew = false }) => {
  const name = doc.file_name || 'Untitled';
  const type = extensionOf(name).slice(1).toUpperCase().slice(0, 4);
  const state = doc.status ?? 'unknown';

  const content = (
    <>
      <span className="DocRow-File">
        <span className="DocRow-Type" aria-hidden="true">
          {type || 'FILE'}
        </span>
        <span className="DocRow-Names">
          <TruncatedText className="DocRow-Name" text={name} />
          <span className="DocRow-Sub">
            {doc.file_size ? formatBytes(doc.file_size) : null}
            {doc.file_size && doc.is_cached ? ' · ' : null}
            {doc.is_cached ? 'answered from cache' : null}
          </span>
        </span>
      </span>
      <span className="DocRow-Product" data-label="Product">
        <ProductLabel productKey={doc.product_key} size={22} />
      </span>
      <span className="DocRow-Status" data-label="Status">
        <span className={`StatusBadge StatusBadge--${state}`}>
          <span className={`StatusDot StatusDot--${state}`} aria-hidden="true" />
          {state}
        </span>
      </span>
      <span className="DocRow-Added" data-label="Added" title={fullDate(doc.created_at)}>
        {timeAgo(doc.created_at)}
      </span>
      <span className="DocRow-Go" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </span>
    </>
  );

  return doc.uuid ? (
    <Link className={`DocRow ${isNew ? 'is-new' : ''}`} href={documentPath(doc.uuid)}>
      {content}
    </Link>
  ) : (
    <div className="DocRow">{content}</div>
  );
};

/** A file the server is still working on: no page to open yet, so no link. */
const UploadingRow = ({ name, productKey, active }) => {
  const type = extensionOf(name).slice(1).toUpperCase().slice(0, 4);
  return (
    <div className="DocRow DocRow--uploading" aria-busy="true">
      <span className="DocRow-File">
        <span className="DocRow-Type" aria-hidden="true">
          {type || 'FILE'}
        </span>
        <span className="DocRow-Names">
          <span className="DocRow-Name">{name}</span>
          <span className="DocRow-Sub">{active ? 'Processing now…' : 'Waiting its turn'}</span>
        </span>
      </span>
      <span className="DocRow-Product" data-label="Product">
        <ProductLabel productKey={productKey} size={22} />
      </span>
      <span className="DocRow-Status" data-label="Status">
        <span className="StatusBadge StatusBadge--processing">
          <span className="StatusDot StatusDot--processing" aria-hidden="true" />
          {active ? 'Processing' : 'Queued'}
        </span>
      </span>
      <span className="DocRow-Added" data-label="Added">
        now
      </span>
      <span className="DocRow-Go" aria-hidden="true" />
    </div>
  );
};
