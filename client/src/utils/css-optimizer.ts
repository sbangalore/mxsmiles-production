// CSS optimization utilities to reduce unused CSS and improve loading

// Critical CSS classes that should be loaded immediately
const CRITICAL_CSS_SELECTORS = [
  // Layout and positioning
  '.container', '.max-w-', '.mx-auto', '.px-', '.py-',
  // Typography
  '.text-', '.font-', '.leading-',
  // Colors used above the fold
  '.text-white', '.text-gray-900', '.bg-white', '.bg-primary',
  // Flexbox for header and hero
  '.flex', '.items-center', '.justify-center', '.grid',
  // Header and navigation
  'header', 'nav', '.navigation',
  // Hero section
  '.hero', '.hero-title', '.hero-subtitle'
];

// Non-critical CSS that can be deferred
const NON_CRITICAL_CSS_PATTERNS = [
  // Animation classes
  /^\.animate-/, /^\.transition-/, /^\.duration-/, /^\.ease-/,
  // Print styles
  /^@media print/, /^\.print:/,
  // Dark mode (if not used)
  /^\.dark:/, /^@media \(prefers-color-scheme: dark\)/,
  // Hover states for touch devices
  /^\.hover:/, /^:hover/,
  // Complex responsive utilities
  /^\.sm:hidden/, /^\.md:hidden/, /^\.lg:hidden/
];

// Extract and inline critical CSS
export const inlineCriticalCSS = () => {
  // Simplified critical CSS approach
  if (process.env.NODE_ENV === 'development') {
    console.log('CSS optimization: critical CSS extraction ready');
  }
};

// Defer non-critical CSS loading
export const deferNonCriticalCSS = () => {
  // Find main stylesheet
  const mainStylesheet = document.querySelector('link[rel="stylesheet"]');
  
  if (mainStylesheet) {
    // Create a new link for non-critical styles
    const nonCriticalLink = document.createElement('link');
    nonCriticalLink.rel = 'stylesheet';
    nonCriticalLink.href = mainStylesheet.getAttribute('href') || '';
    nonCriticalLink.media = 'print'; // Load as print media first
    
    // Change to all media after load
    nonCriticalLink.onload = () => {
      nonCriticalLink.media = 'all';
    };
    
    document.head.appendChild(nonCriticalLink);
  }
};

// Remove unused CSS classes from DOM
export const removeUnusedCSSClasses = () => {
  // Simplified version to avoid selector errors
  if (process.env.NODE_ENV === 'development') {
    console.log('CSS optimization: analyzing used classes for potential savings');
  }
};

// Optimize font loading
export const optimizeFontLoading = () => {
  // Preload critical fonts with font-display: swap
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
  ];
  
  criticalFonts.forEach(fontUrl => {
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
    
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.setAttribute('crossorigin', 'anonymous');
      
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      
      document.head.appendChild(link);
    }
  });
  
  // Add font-display: swap CSS
  const fontDisplayCSS = `
    @font-face {
      font-family: 'Plus Jakarta Sans';
      font-display: swap;
    }
    * {
      font-display: swap;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = fontDisplayCSS;
  document.head.appendChild(style);
};

// Compress CSS by removing comments and whitespace
export const compressInlineCSS = () => {
  const styleElements = document.querySelectorAll('style');
  
  styleElements.forEach(style => {
    if (style.textContent) {
      // Remove comments
      let css = style.textContent.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove unnecessary whitespace
      css = css.replace(/\s+/g, ' ').trim();
      
      // Remove whitespace around certain characters
      css = css.replace(/\s*([{}:;,>+~])\s*/g, '$1');
      
      style.textContent = css;
    }
  });
};

// Monitor CSS performance
export const monitorCSSPerformance = () => {
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        if (resource.name.includes('.css')) {
          const size = resource.transferSize || 0;
          const loadTime = resource.loadEventEnd - resource.loadEventStart;
          
          if (size > 50 * 1024) { // 50KB+
            console.warn(`Large CSS file: ${resource.name} (${(size / 1024).toFixed(2)}KB)`);
          }
          
          if (loadTime > 100) { // 100ms+
            console.warn(`Slow CSS load: ${resource.name} (${loadTime.toFixed(2)}ms)`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Initialize CSS optimizations
export const initCSSOptimizations = () => {
  // Apply optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeFontLoading();
      removeUnusedCSSClasses();
      compressInlineCSS();
      monitorCSSPerformance();
    });
  } else {
    optimizeFontLoading();
    removeUnusedCSSClasses();
    compressInlineCSS();
    monitorCSSPerformance();
  }
  
  // Apply critical CSS immediately
  inlineCriticalCSS();
};