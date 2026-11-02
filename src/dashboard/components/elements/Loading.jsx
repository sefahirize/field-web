import React from 'react';
import { CircularProgress } from '@mui/material';

/**
 * A full-page spinner, shown only when a page asks for it with `loading`.
 *
 * It used to follow the global request flag as well (`ui.isLoading`, switched on
 * by every request in libs/axios), which dimmed the whole page for every
 * background fetch — a popup refreshing its numbers, the document list updating
 * itself. Pages and panels show their own loading state now.
 */
export const Loading = ({ loading = false }) => {
  if (!loading) return null;

  return (
    <div className="PageLoading" role="status" aria-label="Loading">
      <CircularProgress />
    </div>
  );
};
