import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts } from '@dashboard/features/products/productsSlice';
import { ProductIcon } from '@dashboard/components/elements/ProductIcon';

/**
 * A product's icon and name, for the places that only hold a reference to it —
 * a document's `product_key`, a credit row's `product_id`, a history entry's
 * embedded `product`. The icon comes from the product itself when it carries
 * one, otherwise from the catalogue (loaded once, shared by every page).
 */
export const ProductLabel = ({ product, productId, productKey, name, size = 22, className = '' }) => {
  const dispatch = useDispatch();
  const catalogue = useSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const resolved = useMemo(() => {
    if (product?.icon) return product;
    const match = catalogue.find(
      p => (productId !== undefined && productId !== null && p.id === productId) || (productKey && p.key === productKey),
    );
    return match ?? product ?? null;
  }, [catalogue, product, productId, productKey]);

  const label = name ?? resolved?.product_name ?? productKey ?? '—';

  return (
    <span className={`ProductLabel ${className}`}>
      <ProductIcon product={resolved} size={size} />
      <span className="ProductLabel-Name">{label}</span>
    </span>
  );
};
