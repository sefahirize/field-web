import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects as soon as it renders, like react-router's <Navigate> did. The
 * dashboard renders on the client only, so this runs before anything paints.
 */
export const Navigate = ({ to, replace = false }) => {
  const router = useRouter();

  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [router, to, replace]);

  return null;
};
