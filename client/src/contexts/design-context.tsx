import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type DesignTheme = "apple";

interface DesignContextType {
  theme: DesignTheme;
  setTheme: (theme: DesignTheme) => void;
  getThemeClasses: () => {
    headerBg: string;
    headerText: string;
    bodyBg: string;
    bodyText: string;
    primaryButton: string;
    secondaryButton: string;
    cardBg: string;
    cardText: string;
    accent: string;
    navigationStyle: string;
  };
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<DesignTheme>("apple");

  useEffect(() => {
    // Apple-style theme: Clean, minimal, with glass effects
    const root = document.documentElement;
    root.style.setProperty("--header-bg", "rgba(255, 255, 255, 0.8)");
    root.style.setProperty("--header-text", "#1d1d1f");
    root.style.setProperty("--body-bg", "#ffffff");
    root.style.setProperty("--body-text", "#1d1d1f");
    root.style.setProperty("--primary-button", "#007aff");
    root.style.setProperty("--secondary-button", "#f5f5f7");
    root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.7)");
    root.style.setProperty("--card-text", "#1d1d1f");
    root.style.setProperty("--accent", "#007aff");
    
    // Add backdrop-blur class to body for glass effect
    document.body.classList.add("apple-theme");
    document.body.classList.remove("senior-care-theme", "default-theme");
  }, []);

  const getThemeClasses = () => {
    return {
      headerBg: "bg-white/70 backdrop-blur-xl border-b border-gray-200/10",
      headerText: "text-[#1d1d1f]",
      bodyBg: "bg-white",
      bodyText: "text-[#1d1d1f]",
      primaryButton: "bg-[#007aff] hover:bg-[#1f8fff] text-white rounded-full shadow-lg",
      secondaryButton: "bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] rounded-full border border-gray-200/50",
      cardBg: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl",
      cardText: "text-[#1d1d1f]",
      accent: "text-[#007aff]",
      navigationStyle: "apple-nav"
    };
  };

  return (
    <DesignContext.Provider value={{ theme, setTheme, getThemeClasses }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
}