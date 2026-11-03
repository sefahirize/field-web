'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { fetchProducts, selectListedProducts } from '@dashboard/features/products/productsSlice';
import { quoteBasket, resetBasket, restoreBasket, submitOrder } from '@dashboard/features/checkout/checkoutSlice';
import { readPendingPayment } from '@dashboard/features/checkout/pendingPayment';
import { fetchCreditBalance, selectCredits } from '@dashboard/features/credits/creditsSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';
import { SearchSelect } from '@dashboard/components/elements/SearchSelect';
import { ProductIcon } from '@dashboard/components/elements/ProductIcon';
import { money } from '@dashboard/libs/money';

const QUICK_AMOUNTS = [1000, 5000, 10000];
const MAX_DIGITS = 10;
const QUOTE_DELAY_MS = 450;

let rowSeed = 0;
const newRow = (productId = '', count = '') => ({ key: `row-${++rowSeed}`, productId, count: String(count) });

/** The basket's `{ [productId]: usageCount }` back into editable rows. */
const rowsFromLines = lines => {
  const rows = Object.entries(lines).map(([productId, count]) => newRow(Number(productId), count));
  return rows.length > 0 ? rows : [newRow()];
};

const digitsOnly = value => String(value).replace(/\D/g, '').slice(0, MAX_DIGITS);

/** A row counts toward the basket once it has a product and a positive whole quantity. */
const rowsToLines = rows =>
  rows.reduce((lines, { productId, count }) => {
    const quantity = Number(count);
    if (productId && Number.isInteger(quantity) && quantity > 0) lines[productId] = quantity;
    return lines;
  }, {});

const sameLines = (a, b) => {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => Number(a[key]) === Number(b[key]));
};

export const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector(selectListedProducts);
  const productsStatus = useSelector(state => state.products.status);
  const productsError = useSelector(state => state.products.error);
  const credits = useSelector(selectCredits);
  const { lines, basketId, items, totalPrice, quoteStatus, quoteError, quoteErrorProductId, orderStatus, orderError } =
    useSelector(state => state.checkout);

  // A Stripe session opened earlier and never settled — the user closed the tab
  // on Stripe, or came back with the browser's back button instead of a
  // return URL. Read once; the result page is what clears it.
  const [unsettledPayment] = useState(() => readPendingPayment());

  // The rows are what the user is editing, including half-filled ones; the
  // store only ever holds the complete lines. A basket that arrives already
  // built (pricing-page handoff, cancelled payment) seeds the rows once.
  const [rows, setRows] = useState(() => rowsFromLines(lines));
  const [focusKey, setFocusKey] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCreditBalance());
  }, [dispatch]);

  // Rows -> store. Any change to the complete lines resets the quote.
  const nextLines = useMemo(() => rowsToLines(rows), [rows]);
  useEffect(() => {
    if (!sameLines(nextLines, lines)) dispatch(restoreBasket({ lines: nextLines, basketId }));
  }, [nextLines]); // eslint-disable-line react-hooks/exhaustive-deps

  // Store -> quote. Prices come from the server only, a beat after the last
  // keystroke; the store marks the quote idle whenever the lines change.
  const hasLines = Object.keys(lines).length > 0;
  useEffect(() => {
    if (!hasLines || quoteStatus !== 'idle') return undefined;
    const timer = setTimeout(() => dispatch(quoteBasket()), QUOTE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [dispatch, hasLines, quoteStatus, lines]);

  // Back from Stripe via the back button can restore this page from the
  // browser's cache exactly as it was left: mid-redirect, button disabled.
  // Re-open the basket so it can be paid (or changed) again.
  useEffect(() => {
    const onPageShow = event => {
      if (event.persisted) {
        dispatch(restoreBasket({ lines, basketId }));
        setRows(rowsFromLines(lines));
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [dispatch, lines, basketId]);

  const productById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);
  const creditsByKey = useMemo(() => credits.reduce((acc, c) => ({ ...acc, [c.product_key]: c }), {}), [credits]);
  const itemByProduct = useMemo(() => new Map(items.map(line => [line.productId, line])), [items]);
  const usedProductIds = rows.map(row => row.productId).filter(Boolean);

  // Everything in the catalogue is listed in every row; what another row already
  // holds is shown but cannot be picked, because a basket takes a product once.
  const productOptions = ownProductId =>
    products.map(p => ({
      value: p.id,
      label: p.product_name,
      hint: p.description,
      icon: <ProductIcon product={p} size={24} />,
      disabled: p.id !== ownProductId && usedProductIds.includes(p.id),
      note: 'Added',
    }));

  const updateRow = (key, patch) => setRows(current => current.map(row => (row.key === key ? { ...row, ...patch } : row)));
  const removeRow = key =>
    setRows(current => {
      const remaining = current.filter(row => row.key !== key);
      return remaining.length > 0 ? remaining : [newRow()];
    });
  const addRow = () => {
    const row = newRow();
    setRows(current => [...current, row]);
    setFocusKey(row.key); // the new row's select takes focus, so the keyboard flow continues
  };
  const clearAll = () => {
    setRows([newRow()]);
    dispatch(resetBasket());
  };

  const isPricing = hasLines && (quoteStatus === 'idle' || quoteStatus === 'loading');
  const isPriced = hasLines && quoteStatus === 'ready' && basketId;
  const isOrdering = orderStatus === 'loading' || orderStatus === 'redirecting';
  const canAddRow = products.length > rows.length;
  const anyInput = rows.some(row => row.productId || row.count);

  const handleCheckout = async () => {
    const result = await dispatch(submitOrder());
    if (!submitOrder.fulfilled.match(result)) return;

    // Checkout opens a Stripe session; paying happens on Stripe's page, and
    // Stripe sends the user back to /checkout/success or /checkout/cancel.
    if (result.payload.checkoutUrl) {
      window.location.assign(result.payload.checkoutUrl);
      return;
    }

    // No payment step: the order went through as it stood, and is only
    // visible once the balance is read back.
    dispatch(fetchCreditBalance());
    setRows([newRow()]);
  };

  const checkoutLabel = {
    loading: 'Opening payment…',
    redirecting: 'Redirecting to payment…',
  }[orderStatus];

  return (
    <div className="Page Page-Products">
      <div className="PageHeading">
        <h1 className="PageHeading-Title">Buy credits</h1>
        <p className="PageHeading-Desc">
          Pick a product, enter how many credits you need. The unit price falls as the quantity rises.
        </p>
      </div>

      {unsettledPayment && orderStatus === 'idle' && (
        <div className="Notice">
          <span>You have a payment that was started but not confirmed.</span>
          <button
            type="button"
            className="Notice-Action"
            onClick={() =>
              router.push(
                unsettledPayment.sessionId
                  ? `${ROUTE_PATHS.CHECKOUT_SUCCESS}?session_id=${encodeURIComponent(unsettledPayment.sessionId)}`
                  : ROUTE_PATHS.CHECKOUT_SUCCESS,
              )
            }
          >
            Check its status
          </button>
        </div>
      )}

      <div className="BuyCredits">
        <section className="Plan" aria-labelledby="plan-title">
          <div className="Plan-Head">
            <div>
              <h2 className="Plan-Title" id="plan-title">
                Your plan
              </h2>
              <p className="Plan-Sub">Add a row for each product you want to top up.</p>
            </div>
            {anyInput && (
              <button type="button" className="LinkButton" onClick={clearAll} disabled={isOrdering}>
                Clear all
              </button>
            )}
          </div>

          {productsStatus === 'loading' && (
            <div className="Plan-Rows" aria-busy="true" aria-label="Loading products">
              {[0, 1].map(i => (
                <div className="PlanRow PlanRow--skeleton" key={i}>
                  <span className="Skeleton" />
                  <span className="Skeleton" />
                </div>
              ))}
            </div>
          )}

          {productsStatus === 'error' && (
            <div className="Notice Notice--danger" role="alert">
              <span>{productsError}</span>
              <button type="button" className="Notice-Action" onClick={() => dispatch(fetchProducts())}>
                Try again
              </button>
            </div>
          )}

          {productsStatus === 'ready' && products.length === 0 && (
            <p className="Plan-Empty">No products are available to buy right now.</p>
          )}

          {productsStatus === 'ready' && products.length > 0 && (
            <>
              <div className="Plan-Rows">
                {rows.map((row, index) => {
                  const product = productById.get(row.productId);
                  const priced = row.productId ? itemByProduct.get(row.productId) : null;
                  const quantity = Number(row.count);
                  const invalidCount = row.count !== '' && !(Number.isInteger(quantity) && quantity > 0);
                  const needsProduct = row.count !== '' && !row.productId;
                  const serverError = quoteStatus === 'error' && quoteErrorProductId === row.productId ? quoteError : null;
                  const error =
                    serverError ||
                    (invalidCount && 'Enter a whole number above zero.') ||
                    (needsProduct && 'Choose a product for this quantity.') ||
                    null;
                  const remaining = product ? creditsByKey[product.key]?.remaining_credits ?? 0 : null;
                  const selectId = `plan-product-${row.key}`;
                  const countId = `plan-count-${row.key}`;
                  const errorId = `plan-error-${row.key}`;

                  return (
                    <div className="PlanRow" role="group" aria-label={`Product ${index + 1}`} key={row.key}>
                      <div className="PlanRow-Fields">
                        <div className="PlanRow-Field PlanRow-Field--product">
                          <label className="PlanRow-Label" htmlFor={selectId}>
                            Product
                          </label>
                          <SearchSelect
                            id={selectId}
                            value={row.productId}
                            options={productOptions(row.productId)}
                            onChange={productId => updateRow(row.key, { productId })}
                            placeholder="Select a product"
                            searchPlaceholder="Search products…"
                            emptyText="No product"
                            disabled={isOrdering}
                            invalid={Boolean(error)}
                            describedBy={error ? errorId : undefined}
                            inputRef={el => {
                              if (el && focusKey === row.key) {
                                el.focus();
                                setFocusKey(null);
                              }
                            }}
                          />
                        </div>

                        <div className="PlanRow-Field PlanRow-Field--count">
                          <label className="PlanRow-Label" htmlFor={countId}>
                            Credits
                          </label>
                          <input
                            id={countId}
                            className={`Input ${error ? 'is-invalid' : ''}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="e.g. 5,000"
                            value={row.count ? Number(row.count).toLocaleString() : ''}
                            onChange={e => updateRow(row.key, { count: digitsOnly(e.target.value) })}
                            disabled={isOrdering}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? errorId : undefined}
                          />
                        </div>

                        <div className="PlanRow-Price" aria-live="polite">
                          {priced ? (
                            <>
                              <span className="PlanRow-Total">{money(priced.totalPrice)}</span>
                              <span className="PlanRow-Unit">{money(priced.unitPrice)} each</span>
                            </>
                          ) : row.productId && !error && Number.isInteger(quantity) && quantity > 0 && isPricing ? (
                            <span className="Skeleton Skeleton--price" aria-label="Pricing" />
                          ) : (
                            <span className="PlanRow-Unit">—</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="IconButton"
                          aria-label={`Remove product ${index + 1}`}
                          onClick={() => removeRow(row.key)}
                          disabled={isOrdering || (rows.length === 1 && !row.productId && !row.count)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </div>

                      <div className="PlanRow-Meta">
                        {error ? (
                          <span className="PlanRow-Error" id={errorId} role="alert">
                            {error}
                          </span>
                        ) : product && !row.count ? (
                          <span className="QuickAmounts">
                            <span className="PlanRow-Hint">Quick amounts</span>
                            {QUICK_AMOUNTS.map(amount => (
                              <button
                                type="button"
                                className="Chip"
                                key={amount}
                                onClick={() => updateRow(row.key, { count: String(amount) })}
                                disabled={isOrdering}
                              >
                                {amount.toLocaleString()}
                              </button>
                            ))}
                          </span>
                        ) : product ? (
                          <span className="PlanRow-Hint">{remaining.toLocaleString()} credits on your account now</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="AddRow"
                onClick={addRow}
                disabled={!canAddRow || isOrdering}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>{canAddRow ? 'Add another product' : 'All products added'}</span>
              </button>
            </>
          )}
        </section>

        <aside className="Summary" aria-labelledby="summary-title">
          <h2 className="Summary-Title" id="summary-title">
            Summary
          </h2>

          <div className="Summary-Items">
            {!hasLines ? (
              <p className="Summary-Empty">Choose a product and a quantity to see your price.</p>
            ) : (
              <ul className="Summary-Lines">
                {Object.entries(lines).map(([productId, count]) => {
                  const product = productById.get(Number(productId));
                  const priced = itemByProduct.get(Number(productId));
                  return (
                    <li className="Summary-Line" key={productId}>
                      <ProductIcon product={product} size={28} />
                      <span className="Summary-LineName">
                        <span className="Summary-LineProduct">{product?.product_name ?? `#${productId}`}</span>
                        <span className="Summary-LineCount">{Number(count).toLocaleString()} credits</span>
                      </span>
                      <span className="Summary-LineTotal">{priced ? money(priced.totalPrice) : '—'}</span>
                    </li>
                  );
                })}
              </ul>
            )}

          </div>

          <div className="Summary-Checkout">
            <div className="Summary-Total">
              <span>Total</span>
              <span className="Summary-TotalValue" aria-live="polite">
                {isPriced ? money(totalPrice) : isPricing ? <span className="Skeleton Skeleton--total" aria-label="Pricing" /> : '—'}
              </span>
            </div>

            {quoteStatus === 'error' && quoteErrorProductId === null && (
              <div className="Notice Notice--danger" role="alert">
                <span>{quoteError}</span>
                <button type="button" className="Notice-Action" onClick={() => dispatch(quoteBasket())}>
                  Try again
                </button>
              </div>
            )}
            {quoteStatus === 'error' && quoteErrorProductId !== null && (
              <p className="Summary-Note Summary-Note--danger">Fix the highlighted row to see your price.</p>
            )}
            {orderError && (
              <div className="Notice Notice--danger" role="alert">
                <span>{orderError}</span>
              </div>
            )}

            <button
              type="button"
              className="PrimaryButton"
              onClick={handleCheckout}
              disabled={!isPriced || isOrdering}
            >
              {checkoutLabel ?? (isPriced ? `Check out · ${money(totalPrice)}` : 'Check out')}
            </button>
            <p className="Summary-Note">You will pay securely on Stripe. Credits are added once the payment is confirmed.</p>
          </div>
        </aside>
      </div>

      {orderStatus === 'placed' && (
        <div className="Notice Notice--ok">Order placed. Your credits appear on the dashboard once the account updates.</div>
      )}
    </div>
  );
};
