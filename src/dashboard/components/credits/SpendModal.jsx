import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Modal } from '@dashboard/components/elements/Modal';
import { ProductSelect } from '@dashboard/components/elements/ProductSelect';
import { fetchAllCredits, spendCredits } from '@dashboard/features/credits/creditsSlice';
import { fetchProducts, selectListedProducts } from '@dashboard/features/products/productsSlice';

/**
 * POST /credits/use — spending credits directly, as an API consumer would.
 * Listed in both collections but not on the server yet (404), so this mostly
 * shows that; it will work as soon as the route is deployed.
 */
export const SpendModal = ({ onSpent, onClose }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectListedProducts);
  const spend = useSelector(state => state.credits.spend);
  const [form, setForm] = useState({ productKey: '', units: '1', referenceKey: '' });
  const loading = spend.status === 'loading';

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!form.productKey && products.length > 0) setForm(prev => ({ ...prev, productKey: products[0].key }));
  }, [form.productKey, products]);

  const submit = async event => {
    event.preventDefault();
    const result = await dispatch(
      spendCredits({ productKey: form.productKey, units: form.units, referenceKey: form.referenceKey.trim() }),
    );
    if (!result.error) {
      onSpent();
      dispatch(fetchAllCredits());
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      locked={loading}
      busy={loading}
      title="Use credits"
      description="POST /credits/use takes credits off a product directly. The server does not have this route yet, so it answers “not available” for now."
      footer={
        <>
          <Button variant="outlined" size="large" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="contained"
            size="large"
            type="submit"
            form="spend-form"
            disabled={loading || !form.productKey || !(Number(form.units) > 0)}
          >
            {loading ? 'Sending…' : 'Use credits'}
          </Button>
        </>
      }
    >
      <form id="spend-form" className="KeyForm" onSubmit={submit}>
        <div className="FormField">
          <label className="FormField-Label" htmlFor="spend-product">
            Product
          </label>
          <ProductSelect
            id="spend-product"
            products={products}
            value={form.productKey}
            onChange={productKey => setForm(prev => ({ ...prev, productKey }))}
            disabled={loading}
          />
        </div>

        <div className="FormField">
          <label className="FormField-Label" htmlFor="spend-units">
            Units
          </label>
          <input
            id="spend-units"
            className="FormField-Input"
            type="number"
            min={0.01}
            step="any"
            value={form.units}
            onChange={event => setForm(prev => ({ ...prev, units: event.target.value }))}
            disabled={loading}
            required
          />
        </div>

        <div className="FormField">
          <label className="FormField-Label" htmlFor="spend-reference">
            Reference
          </label>
          <input
            id="spend-reference"
            className="FormField-Input"
            value={form.referenceKey}
            onChange={event => setForm(prev => ({ ...prev, referenceKey: event.target.value }))}
            placeholder="Optional, e.g. req_test_01"
            disabled={loading}
          />
        </div>

        {spend.error && (
          <div className="auth-error" role="alert">
            {spend.error}
          </div>
        )}
        {spend.status === 'done' && (
          <div className="auth-notice" role="status">
            Credits used.
          </div>
        )}
      </form>
    </Modal>
  );
};
