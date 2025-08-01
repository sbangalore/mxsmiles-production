/**
 * Apple.com-style smooth scrolling utilities
 * Provides consistent smooth scrolling behavior across the application
 */

export const smoothScrollTo = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ 
      top: elementPosition, 
      behavior: "smooth" 
    });
  }
};

export const smoothScrollToTop = () => {
  window.scrollTo({ 
    top: 0, 
    behavior: "smooth" 
  });
};

export const smoothScrollToElement = (element: HTMLElement, offset: number = 80) => {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ 
    top: elementPosition, 
    behavior: "smooth" 
  });
};