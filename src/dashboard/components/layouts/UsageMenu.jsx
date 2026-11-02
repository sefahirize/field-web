import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, Tooltip } from '@mui/material';
import { fetchCreditBalance, selectCredits } from '@dashboard/features/credits/creditsSlice';
import { fundedProducts, usageLevel, usedShare } from '@dashboard/features/credits/usage';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { ProductLabel } from '@dashboard/components/elements/ProductLabel';

/**
 * The header's usage button: a gauge that opens a small panel with how much of
 * each active product's credits has been used. "Active" means the products that
 * have received credits. A dot on the icon says when one is running low or out.
 * Per product only; nothing here adds credits of different products together.
 */
export const UsageMenu = () => {
  const dispatch = useDispatch();
  const credits = useSelector(selectCredits);
  const status = useSelector(state => state.credits.balanceStatus);
  const [anchor, setAnchor] = useState(null);

  const funded = fundedProducts(credits);
  const out = funded.filter(row => usageLevel(row) === 'out').length;
  const low = funded.filter(row => usageLevel(row) === 'low').length;
  const attention = out > 0 ? 'out' : low > 0 ? 'low' : null;
  const open = Boolean(anchor);

  const summary =
    attention === null
      ? 'Usage'
      : `Usage: ${[low > 0 && `${low} running low`, out > 0 && `${out} out of credits`].filter(Boolean).join(', ')}`;

  const close = () => setAnchor(null);

  return (
    <>
      <Tooltip title={open ? '' : summary} arrow placement="bottom" enterDelay={300} classes={{ tooltip: 'AppTooltip', arrow: 'AppTooltip-Arrow' }}>
        <button
          type="button"
          className={`UsageToggle ${attention ? `has-${attention}` : ''}`}
          aria-label={summary}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={event => {
            setAnchor(event.currentTarget);
            dispatch(fetchCreditBalance()); // fresh numbers every time it is opened
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 17a8 8 0 1 1 16 0" />
            <path d="M12 17l4-5" />
            <circle cx="12" cy="17" r="1.2" fill="currentColor" />
          </svg>
          <span className="UsageToggle-Label" aria-hidden="true">
            Usage
          </span>
          {attention && <span className="UsageToggle-Dot" aria-hidden="true" />}
        </button>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { className: 'UsageMenu', role: 'dialog', 'aria-label': 'Credit usage' } }}
      >
        <div className="UsageMenu-Head">
          <strong>Usage</strong>
          {/* The numbers shown stay put while they refresh; only this corner says so. */}
          {status === 'loading' && funded.length > 0 ? (
            <span className="UsageMenu-Updating" role="status">
              <span className="UsageMenu-Spin" aria-hidden="true" />
              Updating…
            </span>
          ) : (
            <span>{funded.length === 0 ? 'No active products' : `${funded.length} active ${funded.length === 1 ? 'product' : 'products'}`}</span>
          )}
        </div>

        {status === 'loading' && funded.length === 0 && (
          <div className="UsageMenu-List" aria-busy="true">
            {[0, 1, 2].map(i => (
              <div className="UsageMenu-Row" key={i}>
                <span className="Skeleton" />
              </div>
            ))}
          </div>
        )}

        {funded.length > 0 && (
          <ul className="UsageMenu-List">
            {funded.map(row => {
              const percent = usedShare(row);
              const level = usageLevel(row);
              const name = row.product_name ?? row.product_key;
              return (
                <li className="UsageMenu-Row" key={row.product_id ?? row.product_key}>
                  <div className="UsageMenu-Line">
                    <ProductLabel productId={row.product_id} productKey={row.product_key} name={row.product_name} size={20} className="UsageMenu-Product" />
                    <span className={`UsageMenu-Left ${level !== 'ok' ? `is-${level}` : ''}`}>
                      {level === 'out' ? 'Out of credits' : `${(row.remaining_credits ?? 0).toLocaleString()} left`}
                    </span>
                  </div>
                  <span
                    className={`UsageMenu-Bar UsageMenu-Bar--${level}`}
                    role="progressbar"
                    aria-label={`${name}: ${percent}% of credits used`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                  >
                    <span style={{ width: `${percent}%` }} />
                  </span>
                  <span className="UsageMenu-Sub">
                    {percent}% used · {(row.used_credits ?? 0).toLocaleString()} of {(row.total_credits ?? 0).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {status !== 'loading' && funded.length === 0 && (
          <p className="UsageMenu-Empty">Credits you buy appear here, product by product.</p>
        )}

        <div className="UsageMenu-Foot">
          <Link href={ROUTE_PATHS.CREDIT_HISTORY} onClick={close}>
            Credit history
          </Link>
          <Link href={ROUTE_PATHS.PRODUCTS} onClick={close} className="UsageMenu-Buy">
            Buy credits
          </Link>
        </div>
      </Popover>
    </>
  );
};
