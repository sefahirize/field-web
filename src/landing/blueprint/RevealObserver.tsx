"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Drives the scroll reveal in site.module.css for the page it is rendered in
 * (its parent element). Elements already on screen are marked "now" so they
 * do not blink out and back in once this runs; the rest get "in" as they
 * scroll into view. With reduced motion it does nothing, so nothing is hidden.
 */
export const RevealObserver = () => {
  const anchor = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = anchor.current?.parentElement;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending: HTMLElement[] = [];
    const fold = window.innerHeight;
    for (const el of root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")) {
      const box = el.getBoundingClientRect();
      if (box.top < fold && box.bottom > 0) el.setAttribute("data-shown", "now");
      else pending.push(el);
    }
    root.setAttribute("data-reveal-ready", "");

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    pending.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return <span ref={anchor} hidden />;
};
