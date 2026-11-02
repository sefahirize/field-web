'use client';

import React from 'react';
import { assetUrl } from '@dashboard/libs/assetUrl';
import { stringAvatar } from '@dashboard/utils';

/** The user's photo, or their initials when there is none (or it cannot be loaded). */
export const ProfileAvatar = ({ user, size = 88, busy = false }) => {
  const [failed, setFailed] = React.useState(false);
  const src = assetUrl(user?.profile);
  const name = [user?.name, user?.surname ?? user?.lastname].filter(Boolean).join(' ');

  React.useEffect(() => setFailed(false), [src]);

  return (
    <span className={`ProfileAvatar ${busy ? 'is-busy' : ''}`} style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {src && !failed ? (
        // A plain <img>: the photo is an uploaded file served by the API, and the initials fallback on error matters more than resizing.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || 'Profile photo'} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{stringAvatar(name || user?.email || '')}</span>
      )}
      {busy && <span className="ProfileAvatar-Spinner" role="status" aria-label="Uploading" />}
    </span>
  );
};
