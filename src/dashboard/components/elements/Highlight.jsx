import React from 'react';
import { highlightRanges } from '@dashboard/features/search/search';

/** `text` with the parts that matched the search words wrapped in <mark>. */
export const Highlight = ({ text, tokens }) => {
  const ranges = highlightRanges(text, tokens);
  if (ranges.length === 0) return <>{text}</>;

  const chars = Array.from(String(text));
  const parts = [];
  let cursor = 0;
  ranges.forEach(([start, end], index) => {
    if (start > cursor) parts.push(chars.slice(cursor, start).join(''));
    parts.push(<mark key={index}>{chars.slice(start, end).join('')}</mark>);
    cursor = end;
  });
  if (cursor < chars.length) parts.push(chars.slice(cursor).join(''));

  return <>{parts}</>;
};
