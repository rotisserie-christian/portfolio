import { useEffect, useRef } from 'react';

/**
 * Custom hook for intersection observer functionality
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Threshold for intersection (default: 0.1)
 * @param {string} options.rootMargin - Root margin for intersection (default: '0px 0px -100px 0px')
 * @param {Function} options.onIntersect - Callback function when element intersects
 * @param {boolean} options.shouldObserve - Whether to observe the element (default: true)
 * @returns {Object} - { ref: element ref, isIntersecting: boolean }
 */
export function useIntersectionObserver({
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    onIntersect,
    shouldObserve = true
}) {
    const ref = useRef(null);
    const isIntersecting = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || !shouldObserve) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting.current = entry.isIntersecting;
                if (entry.isIntersecting && onIntersect) {
                    onIntersect(entry);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, onIntersect, shouldObserve]);

    return { ref, isIntersecting: isIntersecting.current };
}

/**
 * Hook for managing multiple intersection observers
 * @param {Array} configs - Array of observer configurations
 * @returns {Array} - Array of observer results
 */
export function useMultipleIntersectionObservers(configs) {
    const results = configs.map(config => useIntersectionObserver(config));
    return results;
}
