import React from 'react';
import Link from 'next/link';

/** "← Documents": the way back to the list a detail page came from. */
export const BackLink = ({ to, children }) => (
  <Link href={to} className="BackLink">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
    <span>{children}</span>
  </Link>
);
