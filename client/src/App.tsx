import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { DesignProvider } from "@/contexts/design-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

import { Suspense, useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  BookingPage, 
  PrivacyPage,
  TermsPage,
  DisclaimerPage 
} from "@/utils/lazy-imports";

// Keep these as direct imports since they're small/critical
import Consultation from "@/pages/consultation-simple";
import ProviderApplication from "@/pages/provider-application";
import AdaptiveHeader from "@/components/layout/adaptive-header";
import ThemeSwitcher from "@/components/theme-switcher";
import Footer from "@/components/layout/footer";
import MobileCTA from "@/components/mobile-cta";

import { useAnalytics } from "@/hooks/use-analytics";
import { usePreloader } from "@/hooks/use-preloader";
import { usePerformanceOptimizations } from "@/hooks/use-performance";
import { initGA } from "@/lib/analytics";
import { initPerformanceOptimizations } from "@/utils/performance-optimization";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  // Preload critical pages
  usePreloader();
  
  // Apply performance optimizations
  usePerformanceOptimizations();
  
  // Initialize PageSpeed optimizations targeting 398KB JS and 79KB CSS savings
  useEffect(() => {
    initPerformanceOptimizations();
  }, []);
  
  return (
    <DesignProvider>
      <div className="min-h-screen flex flex-col">
        <AdaptiveHeader />
        <ThemeSwitcher />
        <main className="flex-1 mb-24 md:mb-0">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/consultation" component={Consultation} />
            <Route path="/provider-application" component={ProviderApplication} />
            <Route path="/privacy-policy">
              <Suspense fallback={<LoadingSpinner />}>
                <PrivacyPage />
              </Suspense>
            </Route>
            <Route path="/terms-of-service">
              <Suspense fallback={<LoadingSpinner />}>
                <TermsPage />
              </Suspense>
            </Route>
            <Route path="/medical-disclaimer">
              <Suspense fallback={<LoadingSpinner />}>
                <DisclaimerPage />
              </Suspense>
            </Route>
            <Route path="/booking">
              <Suspense fallback={<LoadingSpinner />}>
                <BookingPage />
              </Suspense>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <MobileCTA />
      </div>
    </DesignProvider>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;