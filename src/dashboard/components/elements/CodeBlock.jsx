import React from 'react';
import { CopyButton } from '@dashboard/components/elements/CopyButton';

/** A block of code or JSON with a copy button in its corner. */
export const CodeBlock = ({ text, label = 'Copy' }) => (
  <div className="CodeBlockWrap">
    <CopyButton text={text} label={label} className="CodeBlockWrap-Copy" />
    <pre className="CodeBlock">{text}</pre>
  </div>
);
