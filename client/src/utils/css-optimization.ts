// CSS optimization utilities to reduce unused CSS
export const criticalCSSSelectors = [
  // Above-the-fold critical styles
  '.hero-section',
  '.header-fixed',
  '.primary-button',
  '.grid-responsive',
  '.heading-primary',
  '.hero-image',
  '.nav-link',
  '.logo',
  
  // Layout essentials
  '.min-h-screen',
  '.flex',
  '.flex-1',
  '.flex-col',
  '.items-center',
  '.justify-center',
  '.container',
  '.mx-auto',
  '.px-4',
  '.py-2',
  
  // Typography critical
  '.text-3xl',
  '.text-xl',
  '.text-lg',
  '.font-bold',
  '.font-semibold',
  
  // Colors critical
  '.text-white',
  '.text-gray-900',
  '.bg-primary',
  '.bg-white',
];

// Function to extract critical CSS
export function extractCriticalCSS(fullCSS: string): string {
  const lines = fullCSS.split('\n');
  const criticalLines: string[] = [];
  let inCriticalRule = false;
  let braceCount = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line starts a critical rule
    const isCriticalSelector = criticalCSSSelectors.some(selector => 
      trimmedLine.includes(selector) || trimmedLine.startsWith(selector)
    );
    
    if (isCriticalSelector) {
      inCriticalRule = true;
      braceCount = 0;
    }
    
    if (inCriticalRule) {
      criticalLines.push(line);
      
      // Count braces to know when rule ends
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      
      if (braceCount <= 0) {
        inCriticalRule = false;
      }
    }
  }
  
  return criticalLines.join('\n');
}

// Defer non-critical CSS loading
export function loadNonCriticalCSS(href: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = function() {
    this.onload = null;
    this.rel = 'stylesheet';
  };
  
  // Fallback for browsers that don't support preload
  const noscriptLink = document.createElement('noscript');
  const fallbackLink = document.createElement('link');
  fallbackLink.rel = 'stylesheet';
  fallbackLink.href = href;
  noscriptLink.appendChild(fallbackLink);
  
  document.head.appendChild(link);
  document.head.appendChild(noscriptLink);
}

// Remove unused CSS classes from DOM
export function removeUnusedClasses(): void {
  if (typeof document === 'undefined') return;
  
  const unusedClasses = [
    // Remove classes that are only used in development
    'debug',
    'dev-only',
    
    // Remove unused animation classes on mobile
    ...(window.innerWidth < 768 ? [
      'hover:scale-110',
      'hover:shadow-2xl',
      'transition-transform',
      'duration-500',
    ] : []),
    
    // Remove unused theme classes
    'theme-dark',
    'theme-senior-care',
  ];
  
  unusedClasses.forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => el.classList.remove(className));
  });
}