import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling clicks outside of a specified element.
 * @param callback The function to call when a click outside is detected.
 * @returns A ref to be attached to the element to monitor for outside clicks.
 */
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
}; 