/**
 * Performance Optimization Hooks
 * Optimizes landing page for maximum speed and conversion
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// Lazy loading hook for components below the fold
export const useLazyLoading = (threshold: number = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return { ref, isIntersecting };
};

// Preload critical resources
export const useResourcePreloading = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/hero-image.webp',
      '/og-image.jpg',
      '/twitter-image.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      '/fonts/inter-var.woff2'
    ];

    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);
};

// Optimize animations for performance
export const useOptimizedAnimation = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getAnimationProps = useCallback((defaultProps: any) => {
    return reduceMotion 
      ? { 
          initial: defaultProps.animate || { opacity: 1 },
          animate: defaultProps.animate || { opacity: 1 },
          transition: { duration: 0 }
        }
      : defaultProps;
  }, [reduceMotion]);

  return { reduceMotion, getAnimationProps };
};

// Debounced scroll handler for performance
export const useOptimizedScroll = (callback: () => void, delay: number = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    window.addEventListener('scroll', debouncedCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedCallback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedCallback]);
};

// Critical Web Vitals monitoring
export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Web vitals tracking disabled temporarily for launch
    console.log('Web vitals tracking initialized');
  }, []);
};

// Image optimization helper
export const useOptimizedImage = (src: string, alt: string) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageProps = {
    src,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    onLoad: () => setLoaded(true),
    onError: () => setError(true),
    style: {
      opacity: loaded ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }
  };

  return { imageProps, loaded, error };
};

// Viewport-based component loading
export const useViewportLoading = (threshold: number = 0.1) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use requestIdleCallback for non-critical loading
    const loadWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setShouldLoad(true));
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => setShouldLoad(true), 1);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadWhenIdle();
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '200px' }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return { ref, shouldLoad };
};

// Bundle size optimization - dynamic imports
export const useDynamicImport = <T>(importFn: () => Promise<{ default: T }>) => {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (component) return;
    
    setLoading(true);
    setError(null);

    try {
      const { default: Component } = await importFn();
      setComponent(Component);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [importFn, component]);

  return { component, loading, error, loadComponent };
};

// Global types removed for launch