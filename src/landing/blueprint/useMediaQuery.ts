"use client";

import { useSyncExternalStore } from "react";

/** Whether a media query matches, kept up to date. False on the server and in the first render. */
export const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    onChange => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
