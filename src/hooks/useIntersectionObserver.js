import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Observing element intersection with viewport
 * @param {Object} options - IntersectionObserver options (rootMargin, threshold, etc.)
 * @returns {{ elementRef: React.RefObject, isIntersecting: boolean, hasIntersected: boolean }}
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [node, setNode] = useState(null);
  const nodeRef = useRef(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Ref object with a setter so attaching the node (via JSX ref or tests) re-runs the effect
  const elementRef = useMemo(
    () => ({
      get current() {
        return nodeRef.current;
      },
      set current(value) {
        nodeRef.current = value;
        setNode(value);
      },
    }),
    []
  );

  // Primitive deps so inline `{ rootMargin: "0px" }` objects don't re-subscribe every render
  const rootMargin = options.rootMargin ?? '100px';
  const threshold = options.threshold;

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    }, {
      rootMargin: '100px',
      ...optionsRef.current,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, rootMargin, threshold]);

  return { elementRef, isIntersecting, hasIntersected };
};
