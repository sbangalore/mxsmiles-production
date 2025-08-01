// Advanced code splitting utilities for reducing JavaScript bundle size

import { lazy } from 'react';

// Lazy load heavy components with preloading capability
export const LazyBlog = lazy(() => import('@/pages/blog'));
export const LazyBooking = lazy(() => import('@/pages/booking'));
// Skip CRM and Legal as they may not exist
// export const LazyCRM = lazy(() => import('@/pages/crm/dashboard'));
// export const LazyLegal = lazy(() => import('@/pages/legal/privacy-policy'));

// Preload critical route components
export const preloadCriticalRoutes = () => {
  // Preload booking page after 2 seconds (high conversion priority)
  setTimeout(() => {
    import('@/pages/booking');
  }, 2000);

  // Preload blog after 4 seconds (content discovery)
  setTimeout(() => {
    import('@/pages/blog');
  }, 4000);
};

// Dynamic import with error handling
export const importWithFallback = async <T>(
  importFn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await importFn();
  } catch (error) {
    console.warn('Dynamic import failed, using fallback:', error);
    return fallback;
  }
};

// Split heavy libraries into separate chunks
export const loadChartLibrary = () =>
  import('recharts').then(module => module);

export const loadAnimationLibrary = () =>
  import('framer-motion').then(module => module);

export const loadFormLibrary = () =>
  Promise.all([
    import('react-hook-form'),
    import('@hookform/resolvers/zod')
  ]);

// Tree-shake unused exports - use standard lucide-react imports
export const loadOptimizedIcons = async () => {
  const { 
    ArrowRight, 
    Phone, 
    Mail, 
    Calendar, 
    Star, 
    Check, 
    X, 
    Menu, 
    ChevronDown 
  } = await import('lucide-react');
  
  return {
    ArrowRight,
    Phone,
    Mail,
    Calendar,
    Star,
    Check,
    X,
    Menu,
    ChevronDown
  };
};

// Remove unused polyfills for modern browsers
export const removeUnusedPolyfills = () => {
  // Detect modern browser capabilities
  const isModernBrowser = 
    'Promise' in window &&
    'fetch' in window &&
    'IntersectionObserver' in window &&
    'requestIdleCallback' in window;

  if (isModernBrowser) {
    // Remove babel polyfills for modern browsers
    const scripts = document.querySelectorAll('script[src*="polyfill"]');
    scripts.forEach(script => script.remove());
  }
};

// Defer non-critical JavaScript
export const deferNonCriticalJS = () => {
  // Defer analytics until page is fully loaded
  if (window.gtag) {
    const deferAnalytics = () => {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
    };
    
    if (document.readyState === 'complete') {
      setTimeout(deferAnalytics, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(deferAnalytics, 1000);
      });
    }
  }

  // Defer social media widgets
  const deferSocialWidgets = () => {
    // Any social media scripts can be loaded here after main content
  };
  
  // Use requestIdleCallback with fallback
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(deferSocialWidgets);
  } else {
    setTimeout(deferSocialWidgets, 1000);
  }
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const originalFetch = window.fetch;
    let totalJSSize = 0;
    
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const url = args[0] as string;
      
      if (url.includes('.js') && response.headers.get('content-length')) {
        const size = parseInt(response.headers.get('content-length') || '0');
        totalJSSize += size;
        
        if (totalJSSize > 500 * 1024) { // 500KB threshold
          console.warn(`JavaScript bundle size exceeded 500KB: ${(totalJSSize / 1024).toFixed(2)}KB`);
        }
      }
      
      return response;
    };
  }
};