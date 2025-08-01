// Bundle optimization utilities to reduce unused JavaScript

// Function to defer non-critical JavaScript
export function deferNonCriticalJS(): void {
  if (typeof window === 'undefined') return;

  // Defer Google Tag Manager after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Load GTM only after critical resources
      if (window.gtag) {
        window.gtag('config', 'G-YKJHGR2MR0', {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    }, 1000);
  });
}

// Remove unused polyfills for modern browsers
export function removeUnusedPolyfills(): void {
  if (typeof window === 'undefined') return;

  // Check if browser supports modern features
  const supportsES6 = () => {
    try {
      return new Function("(a = 0) => a")() === 0;
    } catch (e) {
      return false;
    }
  };

  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Store capabilities for conditional loading
  window.__browserCapabilities = {
    es6: supportsES6(),
    intersectionObserver: supportsIntersectionObserver,
    webp: supportsWebP(),
    requestIdleCallback: 'requestIdleCallback' in window,
  };
}

// Code splitting for heavy libraries
export const loadHeavyLibraries = {
  // Load chart library only when needed
  charts: () => import('recharts'),
  
  // Load form validation only when forms are shown
  validation: () => import('zod'),
  
  // Load motion library only for animations
  motion: () => import('framer-motion'),
  
  // Load query client only when needed
  query: () => import('@tanstack/react-query'),
};

// Tree-shake unused exports
export function optimizeImports() {
  // This helps bundlers tree-shake unused code
  // Only import specific functions instead of entire libraries
  
  return {
    // Instead of importing entire lodash
    debounce: () => import('lodash/debounce'),
    throttle: () => import('lodash/throttle'),
    
    // Instead of importing entire date-fns
    format: () => import('date-fns/format'),
    parseISO: () => import('date-fns/parseISO'),
    
    // Specific lucide icons instead of entire library
    icons: {
      ChevronDown: () => import('lucide-react/dist/esm/icons/chevron-down'),
      Mail: () => import('lucide-react/dist/esm/icons/mail'),
      Phone: () => import('lucide-react/dist/esm/icons/phone'),
    }
  };
}

// Main thread optimization
export function optimizeMainThread(): void {
  if (typeof window === 'undefined') return;

  // Split long tasks into smaller chunks
  function yieldToMain() {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  // Use scheduler API when available
  if ('scheduler' in window && 'postTask' in window.scheduler) {
    window.yieldToMain = () => window.scheduler.postTask(() => {});
  } else {
    window.yieldToMain = yieldToMain;
  }

  // Defer heavy operations
  const deferHeavyWork = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1000 });
    } else {
      setTimeout(callback, 0);
    }
  };

  window.deferHeavyWork = deferHeavyWork;
}

// Bundle size monitoring
export function monitorBundleSize(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  // Log bundle information in development
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  console.group('Bundle Analysis');
  console.log('Script files:', scripts.length);
  console.log('Stylesheet files:', stylesheets.length);
  
  // Estimate total bundle size
  Promise.all([
    ...scripts.map(script => fetch(script.src).then(r => r.blob())),
    ...stylesheets.map(link => fetch(link.href).then(r => r.blob()))
  ]).then(blobs => {
    const totalSize = blobs.reduce((sum, blob) => sum + blob.size, 0);
    console.log(`Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.groupEnd();
  });
}

// Global interface extension
declare global {
  interface Window {
    __browserCapabilities: {
      es6: boolean;
      intersectionObserver: boolean;
      webp: boolean;
      requestIdleCallback: boolean;
    };
    yieldToMain: () => Promise<void>;
    deferHeavyWork: (callback: () => void) => void;
  }
}