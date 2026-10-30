import { COLORS } from '@landing/constants/Colors';
import Image, { ImageProps } from 'next/image';
import React from 'react';

interface HirizeImageProps extends Omit<ImageProps, 'src'> {
    color?: string;
    alt: string;
    width: number;
    height: number;
    src: string;
}

export const HirizeImage: React.FC<HirizeImageProps> = ({
    color = COLORS.Primary_90,
    alt,
    width,
    height,
    src,
    ...props
}) => {
    return (
        <Image
            src={src}
            alt={alt}
            className="hirize-image"
            width={width}
            height={height}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(width, height, color))}`}
            {...props}
        />
    );
};

function ColorLuminance(hex: string, lum: number): string {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#';
    for (let i = 0; i < 3; i++) {
        let c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255));
        rgb += ('00' + c.toString(16)).substr(c.toString(16).length);
    }

    return rgb;
}

const convertImage = (
    w: number,
    h: number,
    color: string,
    radius: string = '16px'
): string => `
  <svg style="border-radius: ${radius}" width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="${color}" offset="20%" />
        <stop stop-color="${ColorLuminance(color, 0.5)}" offset="50%" />
        <stop stop-color="${color}" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="${color}" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string): string =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
