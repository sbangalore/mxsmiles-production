// Lazy imports for code splitting and reducing unused JavaScript
import { lazy } from 'react';

// Lazy load non-critical pages to reduce initial bundle size
export const BlogPage = lazy(() => import('@/pages/blog'));
export const BlogPostPage = lazy(() => import('@/pages/blog-post'));
export const BookingPage = lazy(() => import('@/pages/booking'));
export const CRMDashboard = lazy(() => import('@/pages/crm'));
export const CRMLogin = lazy(() => import('@/pages/crm-login'));
export const PrivacyPage = lazy(() => import('@/pages/privacy-policy'));
export const TermsPage = lazy(() => import('@/pages/terms-of-service'));
export const DisclaimerPage = lazy(() => import('@/pages/medical-disclaimer'));

// Lazy load heavy components that aren't above-the-fold
export const PricingCalculator = lazy(() => import('@/components/sections/pricing-calculator'));
export const TestimonialsSection = lazy(() => import('@/components/sections/reviews'));
export const ContactSection = lazy(() => import('@/components/sections/contact'));

// Preload critical components that will be needed soon
export const preloadCriticalComponents = () => {
  // Preload booking page when user hovers over CTA buttons
  const preloadBooking = () => import('@/pages/booking');
  
  // Preload blog when user scrolls past hero
  const preloadBlog = () => import('@/pages/blog');
  
  return { preloadBooking, preloadBlog };
};

// Dynamic import with error handling
export const loadComponent = async (importFn: () => Promise<any>) => {
  try {
    return await importFn();
  } catch (error) {
    console.warn('Failed to load component:', error);
    // Fallback to empty component
    return { default: () => null };
  }
};