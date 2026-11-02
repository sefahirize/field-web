import React, { useEffect, useState } from 'react';
import { Logo } from '@dashboard/components/elements/Logo';
import cvParser from '@dashboard/assets/product-icons/cv-parser.png';
import invoiceParser from '@dashboard/assets/product-icons/invoice-parser.png';

/**
 * A product's icon.
 *
 * GET /products answers `icon` as a path ("/icons/cv-parser.png"), but the API
 * host does not serve it (404), so a path is matched by file name against the
 * icons bundled in `assets/product-icons/` — copied from the Hirize dashboard.
 * A full https URL, if the API ever sends one, is used as it is. A product with
 * no icon, or whose file is not there, gets the Field mark instead.
 */
const BUNDLED = {
  'cv-parser.png': cvParser.src,
  'invoice-parser.png': invoiceParser.src,
};

const resolveSrc = icon => {
  if (/^https?:\/\//i.test(icon)) return icon;
  return BUNDLED[icon.split('/').pop()] ?? null;
};

export const ProductIcon = ({ product, size = 24, className = '' }) => {
  const src = typeof product?.icon === 'string' && product.icon.trim() ? resolveSrc(product.icon.trim()) : null;
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const style = { width: size, height: size };

  if (!src || failed) {
    return (
      <span className={`ProductIcon ProductIcon--fallback ${className}`} style={style} aria-hidden="true">
        <Logo size={Math.round(size * 0.58)} />
      </span>
    );
  }

  // A plain <img>: the source can be the API's own URL, and the fallback on error matters more than resizing.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`ProductIcon ${className}`}
      style={style}
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};
