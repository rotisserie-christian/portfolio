import { useEffect, useState } from 'react';

/**
 * Tracks document visibility (tab foreground). Used to pause visualizer RAF
 * when the page is hidden, matching Butterchurn's pageVisible gate.
 */
export const usePageVisible = () => {
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return pageVisible;
};

/**
 * Whether a visualizer RAF loop should run.
 * @param {boolean} visible
 * @param {boolean} pageVisible
 */
export const shouldRunVisualizerLoop = (visible, pageVisible) => Boolean(visible && pageVisible);
