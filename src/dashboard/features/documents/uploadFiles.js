import { DOCUMENT_ACCEPT } from './documentsApi';
import { MAX_FILE_SIZE } from '@dashboard/data';
import { formatBytes } from '@dashboard/libs/files';

export const ACCEPTED_EXTENSIONS = DOCUMENT_ACCEPT.split(',');

export const fileKey = file => `${file.name}:${file.size}:${file.lastModified}`;

export const extensionOf = name => {
  const dot = String(name).lastIndexOf('.');
  return dot === -1 ? '' : String(name).slice(dot).toLowerCase();
};

/**
 * Sorts picked or dropped files into the ones that can be uploaded and the
 * reasons the others cannot. A bad file never takes the good ones down with it.
 */
export const validateFiles = picked => {
  const accepted = [];
  const problems = [];

  picked.forEach(file => {
    if (!ACCEPTED_EXTENSIONS.includes(extensionOf(file.name))) {
      problems.push(`${file.name}: choose a PDF, JPG, PNG, DOC or DOCX file.`);
    } else if (file.size > MAX_FILE_SIZE) {
      problems.push(`${file.name} is over ${formatBytes(MAX_FILE_SIZE)}. Choose a smaller file.`);
    } else {
      accepted.push(file);
    }
  });

  return { accepted, problems };
};

/** `current` plus `added`, without a file that is already in the list. */
export const mergeFiles = (current, added) => {
  const seen = new Set(current.map(fileKey));
  return [...current, ...added.filter(file => !seen.has(fileKey(file)))];
};
