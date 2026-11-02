'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';

import { cancelPayment, checkPayment, resetBasket, restoreBasket } from '@dashboard/features/checkout/checkoutSlice';
import { clearPendingPayment, readPendingPayment, readResumeUrl } from '@dashboard/features/checkout/pendingPayment';
import { fetchCreditBalance } from '@dashboard/features/credits/creditsSlice';
import { fetchProducts, selectProducts } from '@dashboard/features/products/productsSlice';
import { ProductIcon } from '@dashboard/components/elements/ProductIcon';
import { ROUTE_PATHS } from '@dashboard/data/paths';

// Stripe can return before the backend has recorded the payment. Keep asking
// for about half a minute before calling it "still processing".
const POLL_INTERVAL_MS = 3000;
const POLL_ATTEMPTS = 10;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Amount with its currency when the API named one (checkout says "TRY"). */
const formatAmount = (amount, currency) => {
  if (amount === null || amount === undefined) return null;
  try {
    if (currency) return Number(amount).toLocaleString(undefined, { style: 'currency', currency });
  } catch {
    /* unknown currency code — fall through to the plain number */
  }
  return Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Where Stripe sends the user back — `outcome` is "success" or "cancel",
 * depending on which return URL it used.
 *
 * Neither URL is trusted to tell the whole story. The session is looked up
 * from the query (`session_id`, Stripe's `{CHECKOUT_SESSION_ID}` placeholder)
 * or, failing that, from the copy stored before the redirect, and its state is
 * asked of the API either way:
 *
 *  - paid      -> done. Credits are re-read, the basket and stored copy cleared.
 *  - open      -> the Stripe session exists but nobody paid. Not waited on: the
 *                 user is told, and can go back to Stripe to finish it, or drop it.
 *  - pending   -> on the success URL, asked again for a while; the payment may
 *                 simply not be recorded yet. After that, the user can retry.
 *  - expired / cancelled -> the basket is put back so nothing has to be
 *                 re-entered, and the cancel is reported to the API.
 *
 * Asking is also what settles the purchase: the API has no webhook route, so
 * GET /checkout/success is very likely where it grants the credits.
 */
export const PaymentResult = ({ outcome = 'success' }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read once: the stored copy is cleared as soon as the payment settles.
  const pending = useMemo(() => readPendingPayment(), []);
  const sessionId =
    searchParams.get('session_id') || searchParams.get('sessionId') || searchParams.get('session') || pending?.sessionId;
  // The cancel URL carries the basket too (see checkoutApi's returnUrls).
  const basketId = searchParams.get('basket_id') || pending?.basketId;

  const [view, setView] = useState('checking'); // checking | paid | unpaid | processing | cancelled | expired | missing | error
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const startedRef = useRef(false);
  const aliveRef = useRef(true);

  const amount = formatAmount(pending?.amount, pending?.currency);

  // What was being bought, from the copy stored before the redirect.
  const products = useSelector(selectProducts);
  const orderLines = useMemo(
    () =>
      Object.entries(pending?.lines ?? {}).map(([productId, count]) => ({
        productId: Number(productId),
        count: Number(count),
      })),
    [pending],
  );
  useEffect(() => {
    if (orderLines.length > 0) dispatch(fetchProducts());
  }, [dispatch, orderLines.length]);

  /** Puts the basket the user left with back in place. */
  const giveBasketBack = useCallback(() => {
    if (pending?.lines && Object.keys(pending.lines).length > 0) {
      dispatch(restoreBasket({ lines: pending.lines, basketId: pending.basketId }));
    }
    clearPendingPayment();
  }, [dispatch, pending]);

  const settlePaid = useCallback(() => {
    clearPendingPayment();
    dispatch(resetBasket());
    dispatch(fetchCreditBalance());
    setView('paid');
  }, [dispatch]);

  /** One round of asking, repeated while the success URL reports "pending". */
  const run = useCallback(async () => {
    setView('checking');
    setError(null);

    const attempts = outcome === 'success' ? POLL_ATTEMPTS : 1;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      setAttempt(attempt);
      const result = await dispatch(checkPayment({ sessionId }));
      if (!aliveRef.current) return;

      if (checkPayment.rejected.match(result)) {
        // On the cancel URL the answer only matters if the user had paid after
        // all; failing to ask does not change that they backed out.
        if (outcome === 'cancel') break;
        setError(result.payload?.message ?? 'Could not check this payment.');
        setView('error');
        return;
      }

      const { state } = result.payload;

      if (state === 'paid') {
        settlePaid();
        return;
      }

      if (state === 'expired') {
        giveBasketBack();
        setView('expired');
        return;
      }

      // Back on the success URL with a session still open: the payment was
      // never made, so there is nothing to wait for.
      if (state === 'open' && outcome === 'success') {
        setView('unpaid');
        return;
      }

      if (attempt < attempts) await wait(POLL_INTERVAL_MS);
      if (!aliveRef.current) return;
    }

    if (outcome === 'cancel') {
      dispatch(cancelPayment({ sessionId, basketId }));
      giveBasketBack();
      setView('cancelled');
      return;
    }

    setView('processing');
  }, [basketId, dispatch, giveBasketBack, outcome, sessionId, settlePaid]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    // StrictMode runs effects twice in development; one round is enough.
    if (startedRef.current) return;
    startedRef.current = true;

    if (sessionId) {
      run();
      return;
    }

    // Nothing to look up. A cancel still means "back to the basket"; a success
    // with no session cannot be confirmed, so it is not claimed.
    if (outcome === 'cancel') {
      dispatch(cancelPayment({ basketId }));
      giveBasketBack();
      setView('cancelled');
    } else {
      setView('missing');
    }
  }, [basketId, dispatch, giveBasketBack, outcome, run, sessionId]);

  const toBasket = () => router.push(ROUTE_PATHS.PRODUCTS);

  // Only the session this page just checked can be resumed, not another stored one.
  const resumeUrl = pending?.sessionId === sessionId ? readResumeUrl(pending) : null;

  const discardPayment = () => {
    giveBasketBack();
    router.push(ROUTE_PATHS.PRODUCTS);
  };

  const screen = {
    checking: {
      tone: 'busy',
      title: 'Checking your payment',
      text:
        attempt > 1
          ? 'Stripe has not reported it yet. Still looking — this can take a few seconds.'
          : 'This takes a few seconds. Please keep this page open.',
    },
    paid: {
      tone: 'ok',
      title: 'Payment complete',
      text: `${amount ? `${amount} paid. ` : ''}Your credits are on their way to your balance.`,
      actions: (
        <>
          <Button variant="contained" onClick={() => router.push(ROUTE_PATHS.CREDIT_HISTORY)}>
            View credit history
          </Button>
          <Button variant="outlined" onClick={() => router.push(ROUTE_PATHS.DASHBOARD)}>
            Go to dashboard
          </Button>
        </>
      ),
    },
    unpaid: {
      tone: 'info',
      title: 'This payment was not completed',
      text: `You started a payment on Stripe but did not finish it, so you have not been charged.${
        resumeUrl ? ' You can pick it up where you left off.' : ''
      }`,
      actions: (
        <>
          {resumeUrl && (
            <Button variant="contained" onClick={() => window.location.assign(resumeUrl)}>
              Continue to payment
            </Button>
          )}
          <Button variant={resumeUrl ? 'outlined' : 'contained'} onClick={run}>
            Check again
          </Button>
          <Button onClick={discardPayment}>Discard this payment</Button>
        </>
      ),
    },
    processing: {
      tone: 'info',
      title: 'Payment still processing',
      text: 'Stripe has not confirmed this payment yet. If you completed it, your credits will appear shortly. You will not be charged twice by checking again.',
      actions: (
        <>
          <Button variant="contained" onClick={run}>
            Check again
          </Button>
          <Button variant="outlined" onClick={toBasket}>
            Back to basket
          </Button>
        </>
      ),
    },
    cancelled: {
      tone: 'neutral',
      title: 'Payment cancelled',
      text: 'You were not charged. Your basket is still here if you want to try again.',
      actions: (
        <Button variant="contained" onClick={toBasket}>
          Back to basket
        </Button>
      ),
    },
    expired: {
      tone: 'neutral',
      title: 'Payment session expired',
      text: 'This payment was not completed and can no longer be paid. Your basket is kept.',
      actions: (
        <Button variant="contained" onClick={toBasket}>
          Back to basket
        </Button>
      ),
    },
    missing: {
      tone: 'neutral',
      title: 'No payment to check',
      text: 'This link does not say which payment it belongs to. If you just paid, your credits will show on the dashboard once the payment is recorded.',
      actions: (
        <>
          <Button variant="contained" onClick={() => router.push(ROUTE_PATHS.CREDIT_HISTORY)}>
            View credit history
          </Button>
          <Button variant="outlined" onClick={toBasket}>
            Back to basket
          </Button>
        </>
      ),
    },
    error: {
      tone: 'danger',
      title: 'Could not check your payment',
      text: error,
      actions: (
        <>
          <Button variant="contained" onClick={run}>
            Try again
          </Button>
          <Button variant="outlined" onClick={toBasket}>
            Back to basket
          </Button>
        </>
      ),
    },
  }[view];

  const showOrder = orderLines.length > 0 && view !== 'checking' && view !== 'missing';

  return (
    <div className="Page Page-PaymentResult">
      <section className={`ResultCard ResultCard--${screen.tone}`} aria-live="polite" aria-busy={view === 'checking'}>
        <div className="ResultCard-Icon" aria-hidden="true">
          <ResultIcon tone={screen.tone} />
        </div>

        <h1 className="ResultCard-Title">{screen.title}</h1>
        <p className="ResultCard-Text">{screen.text}</p>

        {showOrder && (
          <div className="ResultOrder">
            <div className="ResultOrder-Head">Order</div>
            <ul className="ResultOrder-Lines">
              {orderLines.map(line => {
                const product = products.find(p => p.id === line.productId);
                return (
                  <li className="ResultOrder-Line" key={line.productId}>
                    <ProductIcon product={product} size={28} />
                    <span className="ResultOrder-Name">{product?.product_name ?? `Product #${line.productId}`}</span>
                    <span className="ResultOrder-Count">{line.count.toLocaleString()} credits</span>
                  </li>
                );
              })}
            </ul>
            {amount && (
              <div className="ResultOrder-Total">
                <span>{view === 'paid' ? 'Paid' : 'Total'}</span>
                <span className="ResultOrder-TotalValue">{amount}</span>
              </div>
            )}
          </div>
        )}

        {screen.actions && <div className="ResultCard-Actions">{screen.actions}</div>}

        {sessionId && (
          <p className="ResultCard-Ref">
            Reference <code>{shortRef(sessionId)}</code>
          </p>
        )}
      </section>
    </div>
  );
};

/** `cs_test_a1B2…xyz789` — enough to quote to support without the whole id. */
const shortRef = id => (id.length > 20 ? `${id.slice(0, 11)}…${id.slice(-6)}` : id);

const ResultIcon = ({ tone }) => {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (tone === 'busy') return <span className="ResultCard-Spinner" />;
  if (tone === 'ok')
    return (
      <svg {...common}>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    );
  if (tone === 'danger')
    return (
      <svg {...common}>
        <path d="M12 8v5M12 16.5v.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  if (tone === 'info')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
};
