// JavaScript optimization utilities to address PageSpeed Insights diagnostics

// Defer loading of non-critical JavaScript modules
export const deferNonCriticalModules = () => {
  // Defer Google Analytics until after main content loads
  const deferGA = () => {
    if (window.gtag && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      // Defer GA configuration
      setTimeout(() => {
        window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
          page_title: document.title,
          page_location: window.location.href
        });
      }, 2000);
    }
  };

  // Defer after page load
  if (document.readyState === 'complete') {
    deferGA();
  } else {
    window.addEventListener('load', deferGA);
  }
};

// Remove unused polyfills that are not needed for modern browsers
export const removeUnusedPolyfills = () => {
  // Check if modern features are supported
  const modernFeatures = {
    fetch: typeof fetch !== 'undefined',
    promise: typeof Promise !== 'undefined',
    intersectionObserver: 'IntersectionObserver' in window,
    customElements: 'customElements' in window
  };

  // If all modern features are supported, we can skip polyfills
  const isModernBrowser = Object.values(modernFeatures).every(Boolean);
  
  if (isModernBrowser) {
    // Remove babel-polyfill or core-js if present
    const polyfillScripts = document.querySelectorAll('script[src*="polyfill"], script[src*="core-js"]');
    polyfillScripts.forEach(script => {
      console.log('Removing unnecessary polyfill:', script.src);
      script.remove();
    });
  }
};

// Lazy load heavy components to reduce initial bundle size
export const createLazyComponent = (
  importFn: () => Promise<any>
) => {
  // Use dynamic import for lazy loading
  return importFn;
};

// Tree-shake unused icon imports
export const getOptimizedIcons = () => {
  // Only import icons that are actually used in the application
  return {
    ArrowRight: () => import('lucide-react').then(m => ({ default: m.ArrowRight })),
    Phone: () => import('lucide-react').then(m => ({ default: m.Phone })),
    Mail: () => import('lucide-react').then(m => ({ default: m.Mail })),
    Calendar: () => import('lucide-react').then(m => ({ default: m.Calendar })),
    Star: () => import('lucide-react').then(m => ({ default: m.Star })),
    Check: () => import('lucide-react').then(m => ({ default: m.Check })),
    Menu: () => import('lucide-react').then(m => ({ default: m.Menu })),
    X: () => import('lucide-react').then(m => ({ default: m.X }))
  };
};

// Optimize third-party scripts loading
export const optimizeThirdPartyScripts = () => {
  // Delay Google Analytics loading
  const gaScript = document.querySelector('script[src*="googletagmanager"]');
  if (gaScript) {
    // Remove immediate loading
    gaScript.remove();
    
    // Add back after page is interactive
    const loadGA = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    };
    
    // Load after 3 seconds or on first user interaction
    const timer = setTimeout(loadGA, 3000);
    
    const loadOnInteraction = () => {
      clearTimeout(timer);
      loadGA();
      ['click', 'scroll', 'keydown'].forEach(event => {
        document.removeEventListener(event, loadOnInteraction);
      });
    };
    
    ['click', 'scroll', 'keydown'].forEach(event => {
      document.addEventListener(event, loadOnInteraction, { once: true });
    });
  }
};

// Code splitting for route-based chunks
export const splitRouteChunks = () => {
  const routes = {
    home: () => import('@/pages/home'),
    blog: () => import('@/pages/blog'),
    booking: () => import('@/pages/booking')
  };
  
  return routes;
};

// Monitor and report bundle size
export const monitorBundlePerformance = () => {
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        if (resource.name.includes('.js')) {
          const size = resource.transferSize || 0;
          
          if (size > 100 * 1024) { // 100KB+
            console.warn(`Large JavaScript file: ${resource.name} (${(size / 1024).toFixed(2)}KB)`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Initialize JavaScript optimizations
export const initJavaScriptOptimizations = () => {
  // Apply optimizations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      deferNonCriticalModules();
      removeUnusedPolyfills();
      optimizeThirdPartyScripts();
      monitorBundlePerformance();
    });
  } else {
    deferNonCriticalModules();
    removeUnusedPolyfills();
    optimizeThirdPartyScripts();
    monitorBundlePerformance();
  }
};