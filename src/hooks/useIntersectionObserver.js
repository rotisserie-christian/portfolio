import { useEffect, useRef, useState } from 'react';

/**
 * Observing element intersection with viewport
 * @param {Object} options - IntersectionObserver options (rootMargin, threshold, etc.)
 * @returns {{ elementRef: React.RefObject, isIntersecting: boolean, hasIntersected: boolean }}
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      rootMargin: '100px', // Start loading 100px before entering viewport
      ...options
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

