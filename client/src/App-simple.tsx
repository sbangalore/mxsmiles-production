import React, { Suspense, useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { DesignProvider } from "@/contexts/design-context";
import NotFound from "@/pages/not-found";
import SimpleHome from "@/pages/simple-home";

import AdaptiveHeader from "@/components/layout/adaptive-header";
import ThemeSwitcher from "@/components/theme-switcher";
import Footer from "@/components/layout/footer";
import MobileCTA from "@/components/mobile-cta";

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
  return (
    <DesignProvider>
      <div className="min-h-screen flex flex-col">
        <AdaptiveHeader />
        <ThemeSwitcher />
        <main className="flex-1 mb-24 md:mb-0">
          <Switch>
            <Route path="/" component={SimpleHome} />
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
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;