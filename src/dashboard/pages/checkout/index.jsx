'use client';

import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

import { claimBasket, quoteBasket, restoreBasket } from '@dashboard/features/checkout/checkoutSlice';
import { ROUTE_PATHS } from '@dashboard/data/paths';

/**
 * Parses the pricing page's handoff format: `?plan=<productId>:<count>,…` —
 * the same one the old Hirize dashboard took, which the landing page still
 * sends. Malformed pairs are dropped rather than failing the whole plan.
 */
const parsePlanParam = planParam =>
  String(planParam || '')
    .split(',')
    .map(pair => pair.split(':').map(Number))
    .filter(([productId, count]) => Number.isInteger(productId) && Number.isInteger(count) && count > 0)
    .reduce((lines, [productId, count]) => ({ ...lines, [productId]: count }), {});

/**
 * /checkout — where a basket built outside this app arrives.
 *
 * Takes either of two handoffs and turns it into the current basket, then moves
 * on to Buy credits, where it is priced and paid like any other:
 *
 *  - `?basket_id=` — a basket already priced, most likely as a guest. It has
 *    no owner yet, so it is claimed with POST /products/assign-basket; that is
 *    the flow POST /checkout's 401 `auth_required` (which echoes `basket_id`)
 *    points at.
 *  - `?plan=` — product ids and counts. Loaded as lines and priced afresh, so
 *    the price shown is always the server's.
 *
 * It sits behind the auth gate, so a signed-out visitor goes through login
 * first and comes back here with the query intact.
 *
 * `billing` and `pp` from the landing page are ignored: there are no
 * subscriptions on this API, and `pp` names Hirize purchase plans.
 */
export const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    // StrictMode runs effects twice in development; a claim or quote must not.
    if (handledRef.current) return;
    handledRef.current = true;

    const basketId = searchParams.get('basket_id');
    const lines = parsePlanParam(searchParams.get('plan'));

    const handOff = async () => {
      if (basketId) {
        await dispatch(claimBasket({ basketId }));
      } else if (Object.keys(lines).length > 0) {
        dispatch(restoreBasket({ lines }));
        await dispatch(quoteBasket());
      }

      // Errors are shown on Buy credits, next to the basket they belong to.
      router.replace(ROUTE_PATHS.PRODUCTS);
    };

    handOff();
  }, [dispatch, router, searchParams]);

  return (
    <div className="Page Page-Checkout">
      <p className="Muted">Loading your basket…</p>
    </div>
  );
};
