import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { DesignProvider } from "@/contexts/design-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

import { Suspense, useEffect, useState } from "react";
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

// Simple error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">We're working to fix this issue.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  // Preload critical pages
  usePreloader();
  
  // Apply performance optimizations
  usePerformanceOptimizations();
  
  // Initialize PageSpeed optimizations targeting 398KB JS and 79KB CSS savings
  useEffect(() => {
    try {
      initPerformanceOptimizations();
    } catch (error) {
      console.warn('Performance optimizations failed:', error);
    }
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
    try {
      // Verify required environment variable is present
      if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
        console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
      } else {
        initGA();
      }
    } catch (error) {
      console.warn('GA initialization failed:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;