"use client";

import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  isLoading?: boolean;
}

interface UseInfiniteScrollResult {
  lastItemRef: (node: Element | null) => void;
  isIntersecting: boolean;
  reset: () => void;
}

export function useInfiniteScroll({
  threshold = 0.5,
  rootMargin = '0px',
  enabled = true,
  isLoading = false,
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollResult {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<Element | null>(null);

  // Cleanup function for the observer
  const cleanupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Reset function to clear intersection state
  const reset = useCallback(() => {
    setIsIntersecting(false);
    cleanupObserver();
  }, [cleanupObserver]);

  // Setup the intersection observer
  const setupObserver = useCallback(() => {
    if (!enabled || isLoading || typeof IntersectionObserver === 'undefined') {
      return;
    }

    cleanupObserver();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }
  }, [threshold, rootMargin, enabled, isLoading, cleanupObserver]);

  // Ref callback for the last item
  const setLastItemRef = useCallback(
    (node: Element | null) => {
      lastItemRef.current = node;
      setupObserver();
    },
    [setupObserver]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupObserver();
    };
  }, [cleanupObserver]);

  // Reset intersection state when loading state changes
  useEffect(() => {
    if (isLoading) {
      setIsIntersecting(false);
    }
  }, [isLoading]);

  return {
    lastItemRef: setLastItemRef,
    isIntersecting,
    reset,
  };
}

// Example usage with a scroll container
export function useInfiniteScrollWithContainer(
  containerRef: RefObject<Element>,
  options: UseInfiniteScrollOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { threshold = 0.5, rootMargin = '0px', enabled = true, isLoading = false } = options;

  useEffect(() => {
    if (!enabled || isLoading || !containerRef.current || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: containerRef.current,
        threshold,
        rootMargin,
      }
    );

    observerRef.current = observer;

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [containerRef, threshold, rootMargin, enabled, isLoading]);

  const reset = useCallback(() => {
    setIsIntersecting(false);
  }, []);

  return {
    targetRef,
    isIntersecting,
    reset,
  };
}
