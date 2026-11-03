'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { fetchProducts, selectListedProducts } from '@dashboard/features/products/productsSlice';
import { fetchCreditBalance, selectCredits } from '@dashboard/features/credits/creditsSlice';
import { fetchAnalyticsOverview } from '@dashboard/features/analytics/analyticsSlice';
import { fetchDocuments } from '@dashboard/features/documents/documentsSlice';
import { selectAuthUser } from '@dashboard/features/auth/authSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { ProductIcon } from '@dashboard/components/elements/ProductIcon';
import { fullDate, timeAgo } from '@dashboard/libs/time';
import { money } from '@dashboard/libs/money';

/** Rolling windows ending now, as the API computes them — not calendar weeks or months. */
const SUMMARY_PERIODS = [
  { key: 'weekly', label: '7 days', title: 'Last 7 days' },
  { key: 'monthly', label: '30 days', title: 'Last 30 days' },
  { key: 'yearly', label: '12 months', title: 'Last 12 months' },
];

const formatDate = value => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};

export const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const products = useSelector(selectListedProducts);
  const credits = useSelector(selectCredits);
  const productsStatus = useSelector(state => state.products.status);
  const productsError = useSelector(state => state.products.error);
  const stats = useSelector(state => state.documents.stats);
  const { overview, overviewStatus, overviewError } = useSelector(state => state.analytics);

  // Everything the page shows that can change while it is open: the balances, the
  // usage summary and the document counts. The product catalogue is static.
  const loadAll = () =>
    Promise.all([
      dispatch(fetchCreditBalance()),
      dispatch(fetchAnalyticsOverview()),
      dispatch(fetchDocuments({ page: 1, limit: 1 })),
    ]);

  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [, tick] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    loadAll().then(() => setUpdatedAt(Date.now()));
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await loadAll();
    setUpdatedAt(Date.now());
    setRefreshing(false);
  };

  // "Updated 2 minutes ago" keeps counting without a request.
  useEffect(() => {
    const timer = setInterval(() => tick(n => n + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // GET /analytics/summary answers all three periods at once, so switching is
  // just reading a different key — no request.
  const [periodKey, setPeriodKey] = useState('monthly');
  const summaryWindow = overview?.[periodKey];
  const summaryUsed = summaryWindow?.total_credits ?? 0;

  // The ledger carries a row per product, including the ones with no allowance.
  const creditsByKey = credits.reduce((acc, c) => ({ ...acc, [c.product_key]: c }), {});
  const withAllowance = credits.filter(c => (c.total_credits ?? 0) > 0);

  return (
    <div className="Page Page-Dashboard">
      <div className="PageHeading PageHeading--split">
        <div>
          <h1 className="PageHeading-Title">Welcome back, {user?.name || 'there'}</h1>
          <p className="PageHeading-Desc">
            {withAllowance.length > 0
              ? `${withAllowance.length} ${withAllowance.length === 1 ? 'product has' : 'products have'} credits.`
              : 'No credits allocated to your account yet.'}
          </p>
        </div>
        <div className="RefreshControl">
          {updatedAt && !refreshing && (
            <span className="RefreshControl-Time" title={fullDate(updatedAt)}>
              Updated {timeAgo(updatedAt)}
            </span>
          )}
          {refreshing && <span className="RefreshControl-Time">Updating…</span>}
          <button
            type="button"
            className={`RefreshButton ${refreshing ? 'is-spinning' : ''}`}
            onClick={refresh}
            disabled={refreshing}
            aria-label={refreshing ? 'Updating' : 'Update data'}
            title="Update data"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.6-5.9" />
              <path d="M20 4v5h-5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="StatRow">
        {/* Counted, not summed: credits of different products are not one unit. */}
        <StatTile label="Products with credits" value={withAllowance.length.toLocaleString()} />
        <StatTile label="Documents" value={(stats?.total ?? 0).toLocaleString()} />
        <StatTile label="Processing" value={(stats?.processing ?? 0).toLocaleString()} />
        <StatTile label="Failed" value={(stats?.failed ?? 0).toLocaleString()} />
      </div>

      <div className="SectionHeading">
        <h2 className="SectionHeading-Title">{SUMMARY_PERIODS.find(p => p.key === periodKey).title}</h2>
        <div className="Toolbar-Filters">
          {SUMMARY_PERIODS.map(p => (
            <button
              key={p.key}
              type="button"
              className={`Chip ${periodKey === p.key ? 'is-active' : ''}`}
              onClick={() => setPeriodKey(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {overviewStatus === 'loading' && !summaryWindow && <p className="Muted">Loading usage…</p>}
      {overviewStatus === 'error' && <div className="auth-error">{overviewError}</div>}

      {/* A failed refresh must not leave the previous visit's numbers under the error. */}
      {summaryWindow && overviewStatus !== 'error' && (
        <>
          <p className="Muted">
            {formatDate(summaryWindow.start_date)} — {formatDate(summaryWindow.end_date)}
          </p>
          <div className="StatRow">
            <StatTile label="Credits used" value={summaryUsed.toLocaleString()} />
            <StatTile label="Spend" value={money(summaryWindow.total_cost)} />
            <StatTile label="Documents" value={(summaryWindow.total_documents ?? 0).toLocaleString()} />
            {/* Named even with zero usage, so only shown once something was used. */}
            <StatTile label="Top product" value={summaryUsed > 0 ? summaryWindow.top_product || '—' : '—'} />
          </div>
        </>
      )}

      <div className="SectionHeading">
        <h2 className="SectionHeading-Title">Products</h2>
        <Link href={ROUTE_PATHS.ANALYTICS}>View analytics</Link>
      </div>

      {productsStatus === 'loading' && <p className="Muted">Loading products…</p>}
      {productsStatus === 'error' && <div className="auth-error">{productsError}</div>}

      {productsStatus === 'ready' && (
        <div className="ProductGrid">
          {products.map(product => {
            const credit = creditsByKey[product.key];
            const remaining = credit?.remaining_credits ?? 0;
            const total = credit?.total_credits ?? 0;
            const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;

            return (
              <div className="ProductCard" key={product.id}>
                <div className="ProductCard-Head">
                  <ProductIcon product={product} size={32} />
                  <span className="ProductCard-Name">{product.product_name}</span>
                </div>
                <p className="ProductCard-Desc">{product.description}</p>
                <div className="ProductCard-Foot">
                  {total > 0 ? (
                    <>
                      <div className="ProductCard-Meter">
                        <div style={{ width: `${pct}%` }} />
                      </div>
                      <span className="ProductCard-Credits">
                        {remaining.toLocaleString()} / {total.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="ProductCard-Credits Muted">No credits</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatTile = ({ label, value }) => (
  <div className="StatTile">
    <span className="StatTile-Label">{label}</span>
    <span className="StatTile-Value">{value}</span>
  </div>
);
