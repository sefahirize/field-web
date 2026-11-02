'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Button } from '@mui/material';

import { selectAuthUser } from '@dashboard/features/auth/authSlice';
import { PROFILE_EDIT_PATH } from '@dashboard/data/profile';
import { CopyButton } from '@dashboard/components/elements/CopyButton';
import { ProfileAvatar } from '@dashboard/components/profile/ProfileAvatar';
import { ChangePasswordModal } from '@dashboard/components/profile/ChangePasswordModal';

const formatDate = value => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * The profile: who the account belongs to, at a glance. Reading only — editing
 * the details and the photo is its own screen (/profile/edit), and changing the
 * password is a small window opened from the security card.
 */
export const Profile = () => {
  const user = useSelector(selectAuthUser);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const surname = user?.surname ?? user?.lastname ?? '';
  const displayName = [user?.name, surname].filter(Boolean).join(' ') || user?.email || '';

  if (!user) {
    return (
      <div className="Page Page-Profile" aria-busy="true">
        <div className="ProfileHero ProfileHero--loading">
          <span className="Skeleton Skeleton--avatar" />
          <div className="ProfileHero-Text">
            <span className="Skeleton" style={{ width: 220, height: 24 }} />
            <span className="Skeleton" style={{ width: 160, height: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Page Page-Profile">
      <section className="ProfileHero" aria-label="Profile">
        <ProfileAvatar user={user} size={88} />
        <div className="ProfileHero-Text">
          <h1 className="ProfileHero-Name">{displayName}</h1>
          <p className="ProfileHero-Email">{user.email}</p>
          <div className="ProfileHero-Badges">
            {user.is_verified ? (
              <span className="ProfileBadge ProfileBadge--ok">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                Email verified
              </span>
            ) : (
              <span className="ProfileBadge ProfileBadge--warn">Email not verified</span>
            )}
            {user.role && <span className="ProfileBadge">{user.role}</span>}
            {user.company && <span className="ProfileBadge">{user.company}</span>}
          </div>
        </div>
        <Button component={Link} href={PROFILE_EDIT_PATH} variant="contained" className="ProfileHero-Edit">
          Edit profile
        </Button>
      </section>

      <div className="ProfileGrid">
        <section className="ProfileCard" aria-labelledby="profile-about">
          <h2 className="ProfileCard-Title" id="profile-about">
            About
          </h2>
          <dl className="DetailList">
            <Detail label="First name" value={user.name} />
            <Detail label="Last name" value={surname} />
            <Detail label="Email" value={user.email} />
            <Detail label="Company" value={user.company} empty="Not set" />
            <Detail label="Member since" value={formatDate(user.created_at)} />
            <Detail label="Last updated" value={formatDate(user.updated_at)} />
            <Detail
              label="Account ID"
              value={
                user.id != null ? (
                  <span className="DetailList-Id">
                    <code>{String(user.id)}</code>
                    <CopyButton text={String(user.id)} label="Copy account ID" />
                  </span>
                ) : (
                  ''
                )
              }
            />
          </dl>
        </section>

        <div className="ProfileSide">
          <section className="ProfileCard" aria-labelledby="profile-security">
            <h2 className="ProfileCard-Title" id="profile-security">
              Security
            </h2>
            <div className="SecurityRow">
              <div>
                <span className="SecurityRow-Label">Password</span>
                <span className="SecurityRow-Value" aria-hidden="true">
                  ••••••••••
                </span>
              </div>
              <Button variant="outlined" size="small" onClick={() => setPasswordOpen(true)}>
                Change
              </Button>
            </div>
            <p className="ProfileCard-Note">Choose a password you do not use anywhere else.</p>
          </section>

          <section className="ProfileCard" aria-labelledby="profile-status">
            <h2 className="ProfileCard-Title" id="profile-status">
              Account status
            </h2>
            <dl className="DetailList DetailList--compact">
              <Detail
                label="Email"
                value={
                  user.is_verified ? (
                    <span className="ProfileBadge ProfileBadge--ok">Verified</span>
                  ) : (
                    <span className="ProfileBadge ProfileBadge--warn">Not verified</span>
                  )
                }
              />
              {user.is_verified && user.verified_at && <Detail label="Verified on" value={formatDate(user.verified_at)} />}
              <Detail label="Role" value={user.role} />
            </dl>
          </section>
        </div>
      </div>

      {passwordOpen && <ChangePasswordModal onClose={() => setPasswordOpen(false)} />}
    </div>
  );
};

const Detail = ({ label, value, empty = '—' }) => (
  <div className="DetailList-Row">
    <dt>{label}</dt>
    <dd>{value || <span className="Muted">{empty}</span>}</dd>
  </div>
);
