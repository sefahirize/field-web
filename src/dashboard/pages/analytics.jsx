'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAnalytics, setAnalyticsProduct, setPeriod } from '@dashboard/features/analytics/analyticsSlice';
import { ANALYTICS_PERIODS } from '@dashboard/features/analytics/analyticsApi';
import { fetchProducts, selectListedProducts } from '@dashboard/features/products/productsSlice';
import { ProductSelect } from '@dashboard/components/elements/ProductSelect';
import { ProductIcon } from '@dashboard/components/elements/ProductIcon';

/** The API prices in plain numbers and names no currency, so neither does this. */
const money = value =>
  Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Every time_series point carries all three, so the chart can plot any of them. */
const METRICS = [
  { key: 'total_credits', label: 'Credits', title: 'Credits over time', format: v => (v ?? 0).toLocaleString() },
  { key: 'total_cost', label: 'Spend', title: 'Spend over time', format: money },
  { key: 'document_count', label: 'Documents', title: 'Documents over time', format: v => (v ?? 0).toLocaleString() },
];

export const Analytics = () => {
  const dispatch = useDispatch();
  const { data, period, productKey, status, error } = useSelector(state => state.analytics);
  const products = useSelector(selectListedProducts);
  const [metricKey, setMetricKey] = useState(METRICS[0].key);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAnalytics({ period, productKey }));
  }, [dispatch, period, productKey]);

  const summary = data?.summary;
  const series = data?.time_series ?? [];
  const breakdown = data?.product_breakdown ?? [];
  const metric = METRICS.find(m => m.key === metricKey);

  // One shared scale for the bars; guard against an all-zero series so an empty
  // account renders a flat axis rather than dividing by zero.
  const peak = Math.max(...series.map(p => p[metric.key] ?? 0), 0);
  const usedProducts = breakdown.filter(p => (p.total_credits_used ?? 0) > 0);

  return (
    <div className="Page Page-Analytics">
      <div className="PageHeading">
        <h1 className="PageHeading-Title">Analytics</h1>
        <p className="PageHeading-Desc">
          {data ? `${formatDate(data.start_date)} — ${formatDate(data.end_date)}` : 'API usage for your account.'}
        </p>
      </div>

      <div className="Toolbar">
        <div className="Toolbar-Filters">
          {ANALYTICS_PERIODS.map(p => (
            <button
              key={p}
              type="button"
              className={`Chip ${period === p ? 'is-active' : ''}`}
              onClick={() => dispatch(setPeriod(p))}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="Toolbar-Select">
          <ProductSelect
            id="analytics-product"
            products={products}
            allLabel="All products"
            value={productKey ?? ''}
            onChange={key => dispatch(setAnalyticsProduct(key))}
          />
        </div>
      </div>

      {status === 'loading' && <p className="Muted">Loading…</p>}
      {error && <div className="auth-error">{error}</div>}

      {summary && (
        <div className="StatRow">
          <StatTile label="Credits used" value={summary.total_credits_used} />
          <StatTile label="Spend" value={money(summary.total_cost)} />
          <StatTile label="Documents" value={summary.total_documents} />
          <StatTile label="Transactions" value={summary.total_transactions} />
          <StatTile label="Active products" value={summary.active_products} />
          <StatTile label="Growth" value={growth(summary.growth_percentage)} />
        </div>
      )}

      {series.length > 0 && (
        <div className="Panel">
          <div className="Panel-Head">
            <h2 className="Panel-Title">{metric.title}</h2>
            <div className="Toolbar-Filters">
              {METRICS.map(m => (
                <button
                  key={m.key}
                  type="button"
                  className={`Chip ${metricKey === m.key ? 'is-active' : ''}`}
                  onClick={() => setMetricKey(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {peak === 0 ? (
            <p className="Muted">Nothing recorded in this period.</p>
          ) : (
            <div className="Chart">
              {series.map(point => (
                <div className="Chart-Col" key={point.date ?? point.label} title={pointTitle(point)}>
                  <div className="Chart-Bar" style={{ height: `${((point[metric.key] ?? 0) / peak) * 100}%` }} />
                  <span className="Chart-Label">{point.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {breakdown.length > 0 && (
        <div className="Panel">
          <div className="Panel-Head">
            <h2 className="Panel-Title">By product</h2>
            <span className="Muted">
              {usedProducts.length > 0 ? `${usedProducts.length} in use` : 'none used yet'}
            </span>
          </div>

          <div className="Breakdown">
            {breakdown.map(item => (
              <div className="Breakdown-Row" key={item.product_id}>
                <span className="Breakdown-Name">
                  <ProductIcon product={products.find(p => p.id === item.product_id)} size={32} />
                  <div>
                    <div>{item.product_name}</div>
                    <div className="FormField-Help">
                      {money(item.total_cost)} spend · {(item.transaction_count ?? 0).toLocaleString()} transactions ·{' '}
                      {(item.document_count ?? 0).toLocaleString()} documents
                    </div>
                  </div>
                </span>
                <div className="Breakdown-Meter">
                  <div style={{ width: `${Math.min(item.usage_percentage ?? 0, 100)}%` }} />
                </div>
                <span className="Breakdown-Value">{(item.total_credits_used ?? 0).toLocaleString()}</span>
                <span className="Breakdown-Pct Muted">{Math.round(item.usage_percentage ?? 0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatTile = ({ label, value }) => (
  <div className="StatTile">
    <span className="StatTile-Label">{label}</span>
    <span className="StatTile-Value">{typeof value === 'string' ? value : (value ?? 0).toLocaleString()}</span>
  </div>
);

/**
 * `growth_percentage` — presumably against the previous period of the same
 * length; unverified, since it reads 0 on an account with no usage.
 */
const growth = value => {
  const n = Number(value ?? 0);
  const rounded = Math.round(n * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded.toLocaleString()}%`;
};

/**
 * Weekly labels are day names and repeat ("Mon" opens and closes the 8-point
 * series), so the tooltip leads with the date rather than the label.
 */
const pointTitle = point =>
  `${point.date ?? point.label} — ${(point.total_credits ?? 0).toLocaleString()} credits · ${money(
    point.total_cost,
  )} spend · ${(point.document_count ?? 0).toLocaleString()} documents`;

const formatDate = value => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};
