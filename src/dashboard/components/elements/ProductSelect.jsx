import React, { useMemo } from 'react';
import { SearchSelect } from '@dashboard/components/elements/SearchSelect';
import { ProductIcon } from '@dashboard/components/elements/ProductIcon';

/**
 * The product picker used across the app: a searchable select over the product
 * catalogue, each option with its icon. Values are product *keys*
 * ("cv_parser"), which is what the filters and uploads send. Pass `allLabel`
 * to add an option with an empty value that means "no filter".
 */
export const ProductSelect = ({ products, value, onChange, allLabel, ...rest }) => {
  const options = useMemo(
    () => [
      ...(allLabel ? [{ value: '', label: allLabel }] : []),
      ...products.map(product => ({
        value: product.key,
        label: product.product_name,
        hint: product.description,
        icon: <ProductIcon product={product} size={24} />,
      })),
    ],
    [products, allLabel],
  );

  return (
    <SearchSelect
      options={options}
      value={value ?? ''}
      onChange={onChange}
      placeholder="Select a product"
      searchPlaceholder="Search products…"
      emptyText="No product"
      {...rest}
    />
  );
};
