import { useEffect } from 'react';

// Preload all critical pages immediately for upfront loading
export const usePreloader = () => {
  useEffect(() => {
    // Load all pages immediately for desktop and mobile
    Promise.all([
      import('../pages/blog'),
      import('../pages/booking'),
      import('../pages/consultation-simple'),
      import('../pages/provider-application'),
      import('../pages/privacy-policy'),
      import('../pages/terms-of-service'),
      import('../pages/medical-disclaimer'),
      import('../pages/crm'),
      import('../pages/crm-login')
    ]).then(() => {
      console.log('All pages preloaded upfront');
    }).catch((error) => {
      console.warn('Some pages failed to preload:', error);
    });
  }, []);
};