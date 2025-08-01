import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useOptimizedScroll, useActiveSection } from "@/hooks/use-optimized-scroll";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";
import { Globe, Menu, X, ArrowUpRight } from "lucide-react";

export default function AppleHeader() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { getThemeClasses } = useDesign();
  const isScrolled = useOptimizedScroll(10);
  const activeSection = useActiveSection(['pricing', 'services', 'about', 'testimonials', 'contact']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  const themeClasses = getThemeClasses();



  const handleClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.split("#")[1];
      if (location !== "/") {
        window.location.href = href;
      } else {
        const element = document.getElementById(hash);
        if (element) {
          // Add offset for services section to show title properly
          const offset = hash === "services" ? 80 : 0;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ 
            top: elementPosition, 
            behavior: "smooth" 
          });
        }
      }
    }
    // Let other routes (like /blog, /booking) use normal client-side navigation
  };

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.split("#")[1];
      return location === "/" && activeSection === sectionId;
    }
    return location === href;
  };

  const navItems = [
    { href: "/#pricing", label: t.nav.pricing, hasArrow: false },
    { href: "/#services", label: t.nav.services, hasArrow: false },
    { href: "/#about", label: t.nav.about, hasArrow: false },
    { href: "/#testimonials", label: t.nav.reviews, hasArrow: false },
    { href: "/#contact", label: t.nav.contact, hasArrow: false },
    { href: "/blog", label: t.nav.blog, hasArrow: true, preload: true },
    { href: "/booking", label: t.nav.consultation, hasArrow: true, isBlue: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-3xl shadow-sm border-b border-gray-200/50"
          : "bg-white/85 backdrop-blur-3xl border-b border-gray-200/40"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/"
              className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200"
              onClick={() => {
                if (location === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              MxSmiles
            </Link>
          </div>

          {/* Navigation Links - Apple Style */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.filter(item => item.href !== '/booking').map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleClick(item.href)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#007aff] flex items-center gap-1 ${
                  isActive(item.href) ? "text-[#007aff]" : "text-[#1d1d1f]/80"
                }`}
              >
                {item.label}
                {item.hasArrow && <ArrowUpRight className="w-3 h-3" />}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button
                onClick={() => setLanguage(language === "en" ? "es" : "en")}
                className="flex items-center space-x-1 text-sm text-[#1d1d1f]/80 hover:text-[#007aff] transition-colors duration-200"
                aria-label={`Switch to ${language === "en" ? "Spanish" : "English"} language`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === "en" ? "ES" : "EN"}
                </span>
              </button>
            </div>



            {/* Mobile menu button - Apple.com style */}
            <button
              className="md:hidden relative w-8 h-8 z-[9999] flex flex-col justify-center items-center p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {/* Top line */}
              <span
                className="block w-5 h-0.5 bg-[#1d1d1f] transform origin-center transition-all duration-500 ease-in-out absolute"
                style={{
                  transform: isMobileMenuOpen 
                    ? 'translateY(0px) rotate(45deg)' 
                    : 'translateY(-4px) rotate(0deg)',
                  transitionDelay: isMobileMenuOpen ? '0.1s' : '0.2s',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-10px',
                  marginTop: '-1px'
                }}
              ></span>
              {/* Middle line */}
              <span
                className="block w-5 h-0.5 bg-[#1d1d1f] transform transition-all duration-300 ease-in-out absolute"
                style={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transform: isMobileMenuOpen ? 'scale(0.8)' : 'scale(1)',
                  transitionDelay: isMobileMenuOpen ? '0s' : '0.1s',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-10px',
                  marginTop: '-1px'
                }}
              ></span>
              {/* Bottom line */}
              <span
                className="block w-5 h-0.5 bg-[#1d1d1f] transform origin-center transition-all duration-500 ease-in-out absolute"
                style={{
                  transform: isMobileMenuOpen 
                    ? 'translateY(0px) rotate(-45deg)' 
                    : 'translateY(4px) rotate(0deg)',
                  transitionDelay: isMobileMenuOpen ? '0.1s' : '0.2s',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-10px',
                  marginTop: '-1px'
                }}
              ></span>
            </button>
          </div>
        </div>

        {/* Fullscreen Mobile Menu - Apple.com Style with Enhanced Glass Effect */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-screen z-[9998] transform transition-all duration-700 ease-out ${
            isMobileMenuOpen 
              ? "opacity-100 visible translate-y-0" 
              : "opacity-0 invisible -translate-y-8"
          }`}
          style={{
            background: 'rgb(255, 255, 255)',
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
            transitionProperty: 'opacity, visibility, transform',
            transitionDuration: '0.6s',
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >

          {/* Menu content */}
          <div className="flex flex-col justify-center items-start h-full px-10 pt-16 pb-10 max-w-2xl mx-auto">
            <nav className="w-full">
              <ul>
                {/* Show all navigation items in mobile menu */}
                {navItems.map((item, index) => (
                  <li
                    key={item.href}
                    className={`transform transition-all duration-500 ease-out ${
                      isMobileMenuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ 
                      transitionDelay: isMobileMenuOpen ? `${index * 80 + 400}ms` : '0ms',
                      transitionDuration: '500ms',
                      transform: isMobileMenuOpen ? 'translateY(0px)' : 'translateY(20px)'
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        handleClick(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block py-2.5 text-5xl font-semibold tracking-tight transition-opacity duration-300 hover:opacity-70 ${
                        isActive(item.href) || item.isBlue
                          ? "text-[#007aff]"
                          : "text-[#1d1d1f]"
                      }`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.hasArrow && (
                          <ArrowUpRight className="w-8 h-8 text-[#007aff]/60" />
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>


          </div>
        </div>
      </nav>
    </header>
  );
}
