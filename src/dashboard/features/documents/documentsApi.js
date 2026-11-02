import axios from 'axios';
import { unwrap } from '@dashboard/libs/apiError';
import { fileNameFromDisposition } from '@dashboard/libs/files';

/** The four the API's status filter and its status write-back both accept ("oneof"). */
export const DOCUMENT_STATUSES = ['pending', 'processing', 'completed', 'failed'];

/**
 * What /documents/upload takes, by extension. The server sniffs the content
 * rather than trusting the name, and answers per file:
 * "unsupported file format. Allowed formats: pdf, jpg, jpeg, png, doc, docx".
 * WebP is not among them, unlike the avatar upload.
 */
export const DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

/**
 * /documents/upload answers in two shapes, picked by the server rather than
 * by the request, so both are folded into one here:
 *
 *  - one file that went through:
 *      { success, product_key, product_name, is_cached, status, data: {document} }
 *  - several files, or one that failed (still HTTP 200, `success: false`):
 *      { success, total_files, uploaded_count, cached_count, failed_count,
 *        product_name, documents: [...] | null, errors: [{ file_name, error }] }
 *
 * Verified 2026-10-08.
 */
const toUploadResult = payload => {
  if (payload?.data && !Array.isArray(payload.data)) {
    const doc = payload.data;
    return {
      documents: [doc],
      errors: [],
      cachedCount: doc.is_cached ? 1 : 0,
      productName: payload.product_name ?? null,
      raw: payload,
    };
  }

  const documents = Array.isArray(payload?.documents) ? payload.documents : [];
  const errors = (Array.isArray(payload?.errors) ? payload.errors : []).map(e => ({
    fileName: e.file_name ?? e.fileName ?? '',
    message: e.error ?? e.message ?? 'Could not upload this file.',
  }));

  return {
    documents,
    errors,
    cachedCount: payload?.cached_count ?? documents.filter(d => d.is_cached).length,
    productName: payload?.product_name ?? null,
    raw: payload,
  };
};

/**
 * A failed `responseType: 'blob'` request carries its JSON error as a Blob,
 * which neither the interceptor nor toApiError can read. Turn it back into an
 * object so the 404 says "Document not found" instead of a generic sentence.
 */
const readBlobError = async error => {
  const body = error?.response?.data;
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    try {
      error.response.data = JSON.parse(await body.text());
    } catch {
      /* not JSON — leave it for the status-based message */
    }
  }
  return error;
};

export const documentsApi = {
  /**
   * GET /documents -> { data: [], meta: {page, limit, total, total_pages}, stats: {...} }
   *
   * Verified 2026-10-08 on an account with documents: `page`, `limit`,
   * `status`, `product_key` and `search` (file name) all filter. `stats`
   * counts the whole account and ignores the filters.
   */
  async list({ page = 1, limit = 20, status, search, product_key } = {}) {
    const params = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    if (product_key) params.product_key = product_key;

    const { data } = await axios.get('documents', { params });
    return {
      items: data?.data ?? [],
      meta: data?.meta ?? { page, limit, total: 0, total_pages: 1 },
      stats: data?.stats ?? { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 },
    };
  },

  /**
   * POST /documents/upload — JSON, not multipart:
   *   { product_key, files: [{ file_name, data: <bare base64> }] }
   *
   * Processing happens inside the request: a new file answers `completed`
   * with its parse result in `raw_json` after several seconds. A file whose
   * SHA-256 the server has seen before is answered from cache at once
   * (`is_cached: true`) — and is charged all the same.
   *
   * Every file spends credits of `product_key`. With none left, the server
   * converts another product's credits at its exchange rate (a `cross_usage`
   * entry in /credits/history) rather than refusing.
   *
   * Unknown product -> 400 `invalid_product`. An empty `files` list -> 500.
   */
  async upload({ productKey, files }) {
    const { data } = await axios.post('documents/upload', {
      product_key: productKey,
      files: files.map(f => ({ file_name: f.fileName, data: f.data })),
    });
    return toUploadResult(data);
  },

  /**
   * GET /documents/:uuid -> { data: { ...listRow, logs: [...] } }
   *
   * Adds `logs` — `{ status, event_type, message, raw_payload?, created_at }`,
   * oldest first — to what the list carries. `raw_json` is the parser's
   * result as a JSON *string*.
   */
  async get(uuid) {
    const { data } = await axios.get(`documents/${uuid}`);
    return unwrap(data, null);
  },

  /**
   * GET /documents/:uuid/download -> the original file, with
   * `Content-Disposition: attachment; filename="…"`. Needs the JWT, so it is
   * fetched as a Blob rather than linked to.
   */
  async download(uuid, fallbackName) {
    try {
      const response = await axios.get(`documents/${uuid}/download`, { responseType: 'blob' });
      return {
        blob: response.data,
        fileName: fileNameFromDisposition(response.headers?.['content-disposition']) || fallbackName || uuid,
      };
    } catch (error) {
      throw await readBlobError(error);
    }
  },

  /** DELETE /documents/:uuid -> { message: "Document deleted successfully", success } */
  async remove(uuid) {
    const { data } = await axios.delete(`documents/${uuid}`);
    return data;
  },

  /**
   * PUT /documents/:uuid/status { status, raw_json, log_message } -> { data: document }
   *
   * The parser's write-back, exposed to the user's JWT. It replaces the
   * status and `raw_json`, and appends `log_message` to the logs as a
   * `status_<status>` event. Only `status` is required; it must be one of
   * DOCUMENT_STATUSES.
   */
  async updateStatus(uuid, { status, rawJson, logMessage }) {
    const body = { status };
    if (rawJson !== undefined && rawJson !== '') body.raw_json = rawJson;
    if (logMessage) body.log_message = logMessage;

    const { data } = await axios.put(`documents/${uuid}/status`, body);
    return unwrap(data, null);
  },
};
