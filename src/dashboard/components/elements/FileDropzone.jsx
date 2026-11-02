import React, { useRef, useState } from 'react';
import { formatBytes } from '@dashboard/libs/files';

const extensionOf = name => {
  const dot = String(name).lastIndexOf('.');
  return dot === -1 ? '' : String(name).slice(dot + 1).toUpperCase();
};

/**
 * A drop target that also opens the file picker, plus the list of what has
 * been chosen. It only collects files: `onAdd` gets every file that was picked
 * or dropped (the page decides what is acceptable), `onRemove` / `onClear`
 * edit the chosen list, which the page owns.
 *
 * The whole zone is one button for the keyboard (Enter or Space browses), and
 * a drag over it only highlights while files are actually being dragged.
 */
export const FileDropzone = ({
  files,
  onAdd,
  onRemove,
  onClear,
  accept,
  hint,
  disabled = false,
  multiple = true,
  id = 'file-dropzone',
}) => {
  const inputRef = useRef(null);
  const depth = useRef(0); // dragenter/leave also fire for children; count them
  const [dragging, setDragging] = useState(false);

  const browse = () => {
    if (!disabled) inputRef.current?.click();
  };

  const takeFiles = list => {
    const picked = Array.from(list ?? []);
    if (picked.length > 0) onAdd(multiple ? picked : picked.slice(0, 1));
  };

  const hasFiles = event => Array.from(event.dataTransfer?.types ?? []).includes('Files');

  const onDragEnter = event => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    depth.current += 1;
    setDragging(true);
  };

  const onDragOver = event => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault(); // required, or the browser refuses the drop
    event.dataTransfer.dropEffect = 'copy';
  };

  const onDragLeave = event => {
    if (disabled || !hasFiles(event)) return;
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDragging(false);
  };

  const onDrop = event => {
    if (disabled) return;
    event.preventDefault();
    depth.current = 0;
    setDragging(false);
    takeFiles(event.dataTransfer?.files);
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="FileDropzone">
      <div
        className={`FileDropzone-Zone ${dragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-describedby={`${id}-hint`}
        onClick={browse}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            browse();
          }
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className="FileDropzone-Icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V5" />
            <path d="m7.5 9.5 4.5-4.5 4.5 4.5" />
            <path d="M5 15v2.5A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V15" />
          </svg>
        </span>
        <span className="FileDropzone-Title">
          {dragging ? 'Drop to add' : <>Drag and drop {multiple ? 'files' : 'a file'} here, or <span className="FileDropzone-Browse">browse</span></>}
        </span>
        <span className="FileDropzone-Hint" id={`${id}-hint`}>
          {hint}
        </span>
        <input
          ref={inputRef}
          id={id}
          className="FileDropzone-Input"
          type="file"
          multiple={multiple}
          accept={accept}
          tabIndex={-1}
          disabled={disabled}
          onClick={event => event.stopPropagation()}
          onChange={event => {
            takeFiles(event.target.files);
            event.target.value = ''; // the same file can be picked again
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="FileDropzone-List">
          <div className="FileDropzone-ListHead">
            <span>
              {files.length === 1 ? '1 file' : `${files.length} files`} · {formatBytes(totalSize)}
            </span>
            {!disabled && (
              <button type="button" className="FileDropzone-Clear" onClick={onClear}>
                Clear all
              </button>
            )}
          </div>
          <ul>
            {files.map((file, index) => (
              <li className="FileDropzone-File" key={`${file.name}:${file.size}:${file.lastModified}`}>
                <span className="FileDropzone-Type" aria-hidden="true">
                  {extensionOf(file.name).slice(0, 4) || 'FILE'}
                </span>
                <span className="FileDropzone-FileName" title={file.name}>
                  {file.name}
                </span>
                <span className="FileDropzone-FileSize">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  className="FileDropzone-Remove"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(index)}
                  disabled={disabled}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
