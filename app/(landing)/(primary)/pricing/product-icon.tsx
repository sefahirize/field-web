"use client"

import { useState } from "react";

/**
 * GET products answers `icon` as a path ("/icons/cv-parser.png") that the API
 * host does not serve, so the file name is matched against the icons in
 * public/assets/icons/products/. A full https URL, if the API ever sends one,
 * is used as it is. Anything else, or a file that fails to load, gets the
 * Field mark on a grey disc, as Buy credits in the dashboard does.
 */
const BUNDLED: Record<string, string> = {
    "cv-parser.png": "/assets/icons/products/cv-parser.png",
    "invoice-parser.png": "/assets/icons/products/invoice-parser.png",
};

export const productIconSrc = (icon?: string | null): string | null => {
    const path = icon?.trim();
    if (!path) return null;
    if (/^https:\/\//i.test(path)) return path;
    return BUNDLED[path.split("/").pop() ?? ""] ?? null;
};

const FieldMark = () => (
    <span className="flex w-5 h-5 items-center justify-center rounded-full bg-[#f1f1f1] text-[#0E0E0C]" aria-hidden="true">
        <svg width="12" height="12" viewBox="175 129 318 318" focusable="false">
            <rect x="175" y="130.64" width="70.1231" height="316.361" fill="currentColor" />
            <rect x="178.262" y="199.484" width="70.4845" height="314.738" transform="rotate(-90 178.262 199.484)" fill="currentColor" />
            <rect x="259.801" y="317.505" width="62.2886" height="159.815" transform="rotate(-90 259.801 317.505)" fill="currentColor" />
            <rect x="422.877" y="447" width="67.2062" height="66.8615" transform="rotate(-90 422.877 447)" fill="currentColor" />
        </svg>
    </span>
);

const ProductIcon = ({ src }: { src: string | null }) => {
    const [failed, setFailed] = useState(false);
    if (!src || failed) return <FieldMark />;
    return <img src={src} alt="" className="w-5 h-5 rounded-full object-cover" onError={() => setFailed(true)} />;
};

export default ProductIcon;
