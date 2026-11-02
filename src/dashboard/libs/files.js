/**
 * Reads a File as bare base64 — the form every upload on this API takes
 * (/profile/avatar, /documents/upload, /process).
 *
 * FileReader hands back a full data: URI; the prefix comes off here. The avatar
 * endpoint rejects it outright, and the document endpoints accept it, so one
 * shape for all three is the safe choice.
 */
export const toBareBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(',');
      resolve(comma === -1 ? result : result.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });

/**
 * `attachment; filename="cv.pdf"` -> `cv.pdf`. Handles the RFC 5987
 * `filename*=UTF-8''…` form too, which wins when both are present.
 */
export const fileNameFromDisposition = header => {
  if (!header) return null;
  const extended = /filename\*\s*=\s*[^']*''([^;]+)/i.exec(header);
  if (extended) {
    try {
      return decodeURIComponent(extended[1].trim());
    } catch {
      /* malformed escape — fall through to the plain form */
    }
  }
  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(header);
  return plain ? plain[1].trim() : null;
};

/** Hands a Blob to the browser as a download. */
export const saveBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'download';
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoked on the next tick: some browsers start the download asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/** 1536 -> "1.5 KB" */
export const formatBytes = bytes => {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return '—';
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB'];
  let size = value / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
};
