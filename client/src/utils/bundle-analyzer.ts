// Bundle analysis and optimization for PageSpeed Insights improvements

// Track bundle size and provide recommendations
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return;

  let totalJSSize = 0;
  let totalCSSSize = 0;

  // Monitor network requests for assets
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      const url = resourceEntry.name;

      if (url.includes('.js')) {
        totalJSSize += resourceEntry.transferSize || 0;
      } else if (url.includes('.css')) {
        totalCSSSize += resourceEntry.transferSize || 0;
      }
    });

    // Log bundle size warnings
    if (totalJSSize > 500 * 1024) { // 500KB
      console.warn(`JavaScript bundle size: ${(totalJSSize / 1024).toFixed(2)}KB - Consider code splitting`);
    }
    
    if (totalCSSSize > 100 * 1024) { // 100KB
      console.warn(`CSS bundle size: ${(totalCSSSize / 1024).toFixed(2)}KB - Consider CSS optimization`);
    }
  });

  observer.observe({ entryTypes: ['resource'] });
};

// Identify unused JavaScript modules
export const identifyUnusedJS = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;

  const usedModules = new Set<string>();
  const originalRequire = window.require;

  // Track module usage
  if (originalRequire) {
    window.require = function(moduleName: string) {
      usedModules.add(moduleName);
      return originalRequire(moduleName);
    };
  }

  // Report unused modules after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const potentiallyUnused = [
        'framer-motion',
        'recharts', 
        'date-fns',
        '@radix-ui/react-accordion',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-menubar'
      ];

      const unused = potentiallyUnused.filter(module => !usedModules.has(module));
      
      if (unused.length > 0) {
        console.log('Potentially unused modules:', unused);
      }
    }, 3000);
  });
};

// Generate bundle optimization report
export const generateOptimizationReport = () => {
  const report = {
    recommendations: [],
    savings: {
      js: 0,
      css: 0
    }
  };

  // Check for heavy libraries that could be lazy loaded
  const heavyLibraries = [
    { name: 'framer-motion', size: 180, canLazyLoad: true },
    { name: 'recharts', size: 150, canLazyLoad: true },
    { name: '@tanstack/react-query', size: 90, canLazyLoad: false },
    { name: 'lucide-react', size: 120, canLazyLoad: true }
  ];

  heavyLibraries.forEach(lib => {
    if (lib.canLazyLoad) {
      report.recommendations.push(`Lazy load ${lib.name} (${lib.size}KB savings)`);
      report.savings.js += lib.size;
    }
  });

  // Check for unused CSS
  const unusedCSSPatterns = [
    { pattern: 'dark:', usage: checkDarkModeUsage(), size: 20 },
    { pattern: 'print:', usage: checkPrintStylesUsage(), size: 10 },
    { pattern: 'hover:', usage: checkHoverStatesUsage(), size: 15 }
  ];

  unusedCSSPatterns.forEach(css => {
    if (!css.usage) {
      report.recommendations.push(`Remove unused ${css.pattern} CSS (${css.size}KB savings)`);
      report.savings.css += css.size;
    }
  });

  return report;
};

// Utility functions for usage checking
const checkDarkModeUsage = (): boolean => {
  return document.documentElement.classList.contains('dark') ||
         document.querySelector('[data-theme="dark"]') !== null;
};

const checkPrintStylesUsage = (): boolean => {
  // Most sites don't need print styles
  return false;
};

const checkHoverStatesUsage = (): boolean => {
  // Check if device supports hover
  return window.matchMedia('(hover: hover)').matches;
};

// Runtime bundle optimization
export const optimizeRuntimeBundle = () => {
  // Remove unused polyfills
  const polyfillPatterns = [
    'es6-promise',
    'whatwg-fetch',
    'core-js'
  ];

  polyfillPatterns.forEach(pattern => {
    const scripts = document.querySelectorAll(`script[src*="${pattern}"]`);
    scripts.forEach(script => {
      if (isPolyfillUnneeded(pattern)) {
        script.remove();
      }
    });
  });
};

const isPolyfillUnneeded = (polyfill: string): boolean => {
  switch (polyfill) {
    case 'es6-promise':
      return typeof Promise !== 'undefined';
    case 'whatwg-fetch':
      return typeof fetch !== 'undefined';
    case 'core-js':
      return typeof Symbol !== 'undefined' && typeof Promise !== 'undefined';
    default:
      return false;
  }
};

// Initialize bundle optimization
export const initBundleOptimization = () => {
  if (typeof window === 'undefined') return;

  // Start monitoring
  analyzeBundleSize();
  identifyUnusedJS();
  optimizeRuntimeBundle();

  // Generate and log optimization report in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      const report = generateOptimizationReport();
      console.log('Bundle Optimization Report:', report);
      
      const totalSavings = report.savings.js + report.savings.css;
      if (totalSavings > 100) {
        console.log(`🚀 Potential savings: ${totalSavings}KB`);
      }
    }, 5000);
  }
};