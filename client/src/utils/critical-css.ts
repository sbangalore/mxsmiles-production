// Critical CSS extraction for above-the-fold content
export const criticalCSS = `
  /* Critical above-the-fold styles - inline for faster rendering */
  .hero-section {
    background: #fbfbfd;
    padding: 8rem 0;
    overflow: hidden;
  }
  
  .header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 60;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(229, 231, 235, 0.4);
  }
  
  .primary-button {
    background: #64A8F0;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }
  
  .primary-button:hover {
    background: #5496dd;
  }
  
  /* Layout optimization */
  .grid-responsive {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
  }
  
  @media (min-width: 1024px) {
    .grid-responsive {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  /* Text optimization */
  .heading-primary {
    font-size: 2.25rem;
    line-height: 1.1;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    .heading-primary {
      font-size: 3rem;
    }
  }
  
  /* Image optimization */
  .hero-image {
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 100%;
    height: auto;
  }
`;

// Function to inject critical CSS
export function injectCriticalCSS(): void {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }
}

// Function to load non-critical CSS asynchronously
export function loadNonCriticalCSS(href: string): void {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  }
}