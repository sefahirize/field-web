'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Button } from '@mui/material';

import { fetchCreditBalance, fetchCreditHistory, selectCredits } from '@dashboard/features/credits/creditsSlice';
import {
  entryKind,
  entryTitle,
  formatDelta,
  formatTime,
  groupByDay,
  entryDelta,
} from '@dashboard/features/credits/ledger';
import { fundedProducts, usageLevel, usedShare } from '@dashboard/features/credits/usage';
import { TEST_TOOLS_ENABLED } from '@dashboard/data';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { ProductLabel } from '@dashboard/components/elements/ProductLabel';
import { SpendModal } from '@dashboard/components/credits/SpendModal';

const PAGE_SIZE = 20;

const KindIcon = ({ kind }) => {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (kind === 'add')
    return (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  if (kind === 'gift')
    return (
      <svg {...props}>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7M12 8c-1.5-3.5-5-3.5-5-1.2C7 8 8.5 8 12 8Zm0 0c1.5-3.5 5-3.5 5-1.2C17 8 15.5 8 12 8Z" />
      </svg>
    );
  if (kind === 'swap')
    return (
      <svg {...props}>
        <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
      </svg>
    );
  return (
    <svg {...props}>
      <path d="M7 7l10 10M17 9v8H9" />
    </svg>
  );
};

/**
 * Credit history: how much there is, where it sits, and everything that moved it.
 * A balance card on top, a card per product that has credits (the others folded
 * away), and the ledger as a timeline by day with "Load more".
 */
export const CreditHistory = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [spendOpen, setSpendOpen] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const credits = useSelector(selectCredits);
  const balanceStatus = useSelector(state => state.credits.balanceStatus);
  const { history, historyMeta: meta, historyStatus: status, historyError: error } = useSelector(state => state.credits);

  useEffect(() => {
    dispatch(fetchCreditBalance());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCreditHistory({ page, limit: PAGE_SIZE }));
  }, [dispatch, page]);

  // Only facts about each product's own balance are shown. Credits of different
  // products are not added up: the API converts between products at a rate (a
  // cross_usage entry), so a sum across them would not be in any one unit.
  const funded = fundedProducts(credits);
  const unfunded = credits.filter(c => (c.total_credits ?? 0) <= 0);
  const outCount = funded.filter(c => usageLevel(c) === 'out').length;
  const lowCount = funded.filter(c => usageLevel(c) === 'low').length;

  const groups = useMemo(() => groupByDay(history), [history]);
  const showRows = history.length > 0 && !(status === 'error' && page === 1);
  const loadingMore = status === 'loading' && page > 1;
  const hasMore = meta.page < meta.total_pages;

  return (
    <div className="Page Page-CreditHistory">
      <div className="PageHeading">
        <h1 className="PageHeading-Title">Credit history</h1>
        <p className="PageHeading-Desc">What you have, where it sits, and everything that moved it.</p>
      </div>

      <section className="BalanceHero" aria-label="Credits overview">
        <div className="BalanceHero-Main">
          <span className="BalanceHero-Label">Products with credits</span>
          <span className="BalanceHero-Value" aria-live="polite">
            {balanceStatus === 'loading' && credits.length === 0 ? (
              <span className="Skeleton Skeleton--hero" />
            ) : (
              <>
                {funded.length.toLocaleString()}
                {credits.length > 0 && <span className="BalanceHero-Of"> of {credits.length.toLocaleString()}</span>}
              </>
            )}
          </span>
          <span className="BalanceHero-Sub">
            {funded.length === 0
              ? 'No credits yet — buy some to get started.'
              : lowCount + outCount === 0
              ? 'None of them is running low.'
              : [lowCount > 0 && `${lowCount} running low`, outCount > 0 && `${outCount} out of credits`].filter(Boolean).join(' · ')}
          </span>
          <div className="BalanceHero-Actions">
            <Button component={Link} href={ROUTE_PATHS.PRODUCTS} variant="contained" className="BalanceHero-Buy">
              Buy credits
            </Button>
            {TEST_TOOLS_ENABLED && (
              <button type="button" className="BalanceHero-Ghost" onClick={() => setSpendOpen(true)}>
                Use credits (test)
              </button>
            )}
          </div>
        </div>
        <dl className="BalanceHero-Side">
          <div>
            <dt>Running low</dt>
            <dd>{lowCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Out of credits</dt>
            <dd>{outCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt>No credits yet</dt>
            <dd>{unfunded.length.toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      {funded.length > 0 && (
        <section aria-labelledby="by-product">
          <h2 className="CreditsSection" id="by-product">
            By product
          </h2>
          <ul className="UsageList">
            {funded.map(row => {
              const left = row.remaining_credits ?? 0;
              const used = row.used_credits ?? 0;
              const received = row.total_credits ?? 0;
              const percent = usedShare(row);
              // The bar shows what has been used; it warms up as the product runs low.
              const level = usageLevel(row);
              const name = row.product_name ?? row.product_key;
              return (
                <li className="UsageRow" key={row.product_id ?? row.product_key}>
                  <ProductLabel productId={row.product_id} productKey={row.product_key} name={row.product_name} size={24} className="UsageRow-Product" />
                  <span
                    className={`UsageRow-Bar UsageRow-Bar--${level}`}
                    role="progressbar"
                    aria-label={`${name}: ${percent}% of credits used`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                  >
                    <span style={{ width: `${percent}%` }} />
                  </span>
                  <span className="UsageRow-Numbers">
                    <span className="UsageRow-Left">{left.toLocaleString()} left</span>
                    <span className="UsageRow-Used">
                      {percent}% used · {used.toLocaleString()} of {received.toLocaleString()}
                    </span>
                  </span>
                  <Link className="UsageRow-Buy" href={ROUTE_PATHS.PRODUCTS} aria-label={`Buy more ${name} credits`}>
                    Buy more
                  </Link>
                </li>
              );
            })}
          </ul>

          {unfunded.length > 0 && (
            <div className="WalletEmpty">
              <button type="button" className="LinkButton" aria-expanded={showEmpty} onClick={() => setShowEmpty(v => !v)}>
                {showEmpty ? 'Hide' : 'Show'} {unfunded.length} {unfunded.length === 1 ? 'product' : 'products'} with no credits
              </button>
              {showEmpty && (
                <ul className="WalletEmpty-List">
                  {unfunded.map(row => (
                    <li key={row.product_id ?? row.product_key}>
                      <ProductLabel productId={row.product_id} productKey={row.product_key} name={row.product_name} size={22} />
                      <Link href={ROUTE_PATHS.PRODUCTS}>Buy</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="activity">
        <h2 className="CreditsSection" id="activity">
          Activity
        </h2>

        {error && (
          <div className="Notice Notice--danger" role="alert">
            <span>{error}</span>
            <button type="button" className="Notice-Action" onClick={() => dispatch(fetchCreditHistory({ page, limit: PAGE_SIZE }))}>
              Try again
            </button>
          </div>
        )}

        {status === 'loading' && history.length === 0 && (
          <div className="Timeline" aria-busy="true">
            {[0, 1, 2, 3].map(i => (
              <div className="TimelineRow TimelineRow--skeleton" key={i}>
                <span className="Skeleton Skeleton--bubble" />
                <span className="Skeleton" />
                <span className="Skeleton Skeleton--price" />
              </div>
            ))}
          </div>
        )}

        {status === 'ready' && history.length === 0 && (
          <div className="TimelineEmpty">
            <strong>No credit activity yet</strong>
            <span>Purchases and usage appear here as they happen.</span>
            <Button component={Link} href={ROUTE_PATHS.PRODUCTS} variant="outlined">
              Buy credits
            </Button>
          </div>
        )}

        {showRows &&
          groups.map(group => (
            <div className="TimelineDay" key={group.label}>
              <h3 className="TimelineDay-Label">{group.label}</h3>
              <ul className="Timeline">
                {group.entries.map(entry => {
                  const kind = entryKind(entry);
                  const { title, type } = entryTitle(entry);
                  const delta = entryDelta(entry);
                  return (
                    <li className="TimelineRow" key={entry.id}>
                      <span className={`TimelineRow-Icon TimelineRow-Icon--${kind}`}>
                        <KindIcon kind={kind} />
                      </span>
                      <span className="TimelineRow-Text">
                        <span className="TimelineRow-Title">{title}</span>
                        <span className="TimelineRow-Sub">
                          {entry.product && <ProductLabel product={entry.product} size={16} />}
                          {type && <span className="TimelineRow-Type">{type}</span>}
                          <span>{formatTime(entry.created_at)}</span>
                        </span>
                      </span>
                      <span className="TimelineRow-Amount">
                        <span className={`TimelineRow-Delta ${delta > 0 ? 'is-in' : ''}`}>{formatDelta(entry)}</span>
                        <span className="TimelineRow-Balance">balance {(entry.balance_after ?? 0).toLocaleString()}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

        {showRows && hasMore && (
          <div className="TimelineMore">
            <Button variant="outlined" onClick={() => setPage(p => p + 1)} disabled={loadingMore}>
              {loadingMore ? 'Loading…' : 'Load more'}
            </Button>
            <span className="Muted">
              {history.length.toLocaleString()} of {meta.total.toLocaleString()}
            </span>
          </div>
        )}
      </section>

      {spendOpen && (
        <SpendModal
          onSpent={() => {
            setPage(1);
            dispatch(fetchCreditHistory({ page: 1, limit: PAGE_SIZE }));
          }}
          onClose={() => setSpendOpen(false)}
        />
      )}
    </div>
  );
};
