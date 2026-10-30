'use client';

import * as React from "react";
import { breakpoints } from '@landing/constants/breakpoints';

// Match Tailwind's SM breakpoint
const MOBILE_BREAKPOINT = breakpoints.sm;

export function useIsMobile() {
  // Initialize with null to indicate "not yet known"
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      setIsMobile(mql.matches);
    };

    // Run initial check
    checkMobile();

    // Setup listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Return false during SSR, actual value after hydration
  return isMobile ?? false;
}
