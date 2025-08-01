// CSS optimization and tree-shaking utilities

// Critical CSS classes that must be loaded immediately
const CRITICAL_CSS_CLASSES = [
  // Header and navigation
  'header', 'nav', 'navigation',
  // Hero section
  'hero', 'hero-title', 'hero-subtitle', 'hero-cta',
  // Layout
  'container', 'max-w-', 'mx-auto', 'px-', 'py-',
  // Typography
  'text-', 'font-', 'leading-',
  // Colors
  'text-white', 'text-gray-900', 'bg-white', 'bg-primary',
  // Flexbox and Grid
  'flex', 'grid', 'items-center', 'justify-center',
];

// Non-critical CSS that can be loaded later
const NON_CRITICAL_CSS_CLASSES = [
  // Animation classes
  'animate-', 'transition-', 'duration-', 'ease-',
  // Complex layouts
  'aspect-ratio', 'backdrop-', 'clip-',
  // Form elements (below fold)
  'form-', 'input-', 'button-secondary',
  // Footer content
  'footer', 'footer-link', 'footer-section',
];

// Extract critical CSS for above-the-fold content
export const extractCriticalCSS = (): string => {
  const criticalStyles: string[] = [];
  
  // Get all stylesheets
  const stylesheets = Array.from(document.styleSheets);
  
  stylesheets.forEach(stylesheet => {
    try {
      const rules = Array.from(stylesheet.cssRules || []);
      
      rules.forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          const selector = rule.selectorText;
          
          // Check if selector contains critical classes
          const isCritical = CRITICAL_CSS_CLASSES.some(criticalClass =>
            selector.includes(criticalClass) ||
            selector.includes(`.${criticalClass}`)
          );
          
          if (isCritical) {
            criticalStyles.push(rule.cssText);
          }
        }
      });
    } catch (e) {
      // Skip cross-origin stylesheets
    }
  });
  
  return criticalStyles.join('\n');
};

// Defer non-critical CSS loading
export const deferNonCriticalCSS = () => {
  const nonCriticalLink = document.createElement('link');
  nonCriticalLink.rel = 'stylesheet';
  nonCriticalLink.href = '/assets/non-critical.css';
  nonCriticalLink.media = 'print';
  nonCriticalLink.onload = () => {
    nonCriticalLink.media = 'all';
  };
  
  document.head.appendChild(nonCriticalLink);
};

// Remove unused CSS classes from the DOM
export const removeUnusedCSSClasses = () => {
  const allElements = document.querySelectorAll('*');
  const usedClasses = new Set<string>();
  
  // Collect all classes actually used in the DOM
  allElements.forEach(element => {
    element.classList.forEach(className => {
      usedClasses.add(className);
    });
  });
  
  // Remove unused Tailwind utilities (development only)
  if (process.env.NODE_ENV === 'development') {
    const unusedClasses: string[] = [];
    
    // Check for common unused utility patterns
    const commonUnusedPatterns = [
      /^hover:/, /^focus:/, /^active:/, // Interactive states for hidden elements
      /^md:hidden/, /^lg:hidden/, // Responsive utilities
      /^dark:/, // Dark mode utilities if not used
      /^print:/, // Print utilities
    ];
    
    document.styleSheets[0]?.cssRules && Array.from(document.styleSheets[0].cssRules).forEach(rule => {
      if (rule instanceof CSSStyleRule) {
        const selector = rule.selectorText;
        commonUnusedPatterns.forEach(pattern => {
          if (pattern.test(selector) && !document.querySelector(selector)) {
            unusedClasses.push(selector);
          }
        });
      }
    });
    
    if (unusedClasses.length > 0) {
      console.log(`Found ${unusedClasses.length} potentially unused CSS classes:`, unusedClasses.slice(0, 10));
    }
  }
};

// Optimize CSS delivery
export const optimizeCSSDelivery = () => {
  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
  ];
  
  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
  
  // Use font-display: swap for better performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Plus Jakarta Sans';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Inline critical CSS
export const inlineCriticalCSS = (criticalCSS: string) => {
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
};

// Monitor CSS usage and provide recommendations
export const monitorCSSUsage = () => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    
    // Check CSS blocking time
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      
      if (loadTime > 2000) {
        console.warn(`CSS blocking time: ${loadTime.toFixed(2)}ms - consider critical CSS optimization`);
      }
      
      // Report CSS file sizes
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach((sheet, index) => {
        try {
          const rules = sheet.cssRules?.length || 0;
          console.log(`Stylesheet ${index + 1}: ${rules} rules`);
        } catch (e) {
          console.log(`Stylesheet ${index + 1}: Cross-origin or inaccessible`);
        }
      });
    });
  }
};

// Generate optimized CSS build configuration
export const getOptimizedCSSConfig = () => ({
  purge: {
    enabled: true,
    content: [
      './client/src/**/*.{js,jsx,ts,tsx}',
      './client/src/**/*.html',
    ],
    options: {
      safelist: CRITICAL_CSS_CLASSES,
      blocklist: NON_CRITICAL_CSS_CLASSES,
    }
  },
  plugins: [
    // Remove unused CSS
    require('@fullhuman/postcss-purgecss')({
      content: ['./client/src/**/*.{js,jsx,ts,tsx}'],
      defaultExtractor: (content: string) => content.match(/[\w-/:]+(?<!:)/g) || []
    }),
    // Compress CSS
    require('cssnano')({
      preset: 'advanced',
    }),
  ]
});