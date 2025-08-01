import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";
import { Globe, Phone, Menu, X, ArrowUpRight } from "lucide-react";

export default function SeniorCareHeader() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { getThemeClasses } = useDesign();
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const themeClasses = getThemeClasses();

  useEffect(() => {
    const handleScroll = () => {
      if (location === "/") {
        const scrollPosition = window.scrollY + 100;
        
        const contactSection = document.getElementById("contact");
        const testimonialsSection = document.getElementById("testimonials");
        const aboutSection = document.getElementById("about");
        const servicesSection = document.getElementById("services");
        const pricingSection = document.getElementById("pricing");
        
        if (contactSection && contactSection.offsetTop <= scrollPosition) {
          setActiveSection("contact");
        } else if (testimonialsSection && testimonialsSection.offsetTop <= scrollPosition) {
          setActiveSection("testimonials");
        } else if (aboutSection && aboutSection.offsetTop <= scrollPosition) {
          setActiveSection("about");
        } else if (servicesSection && servicesSection.offsetTop <= scrollPosition) {
          setActiveSection("services");
        } else if (pricingSection && pricingSection.offsetTop <= scrollPosition) {
          setActiveSection("pricing");
        } else {
          setActiveSection("pricing");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.split("#")[1];
      if (location !== "/") {
        window.location.href = href;
      } else {
        const element = document.getElementById(hash);
        if (element) {
          // Add offset for services section to show title properly
          const offset = hash === 'services' ? 80 : 0;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: elementPosition, behavior: "smooth" });
        }
      }
    } else if (href === "/blog") {
      // For blog navigation, ensure we scroll to top
      window.location.href = href;
    }
    setIsMenuOpen(false);
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
    { href: "/blog", label: "Blog", hasArrow: true },
  ];

  return (
    <header className="bg-[#f8f9fa]/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      {/* Top bar with phone numbers - Senior care style */}
      <div className="bg-[#3498db] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">{t.nav.callNow}:</span>
              <a href="tel:+15588458889" className="flex items-center space-x-1 hover:underline">
                <Phone className="w-3 h-3" />
                <span>+(558) 845 889</span>
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="tel:+18570005579" className="flex items-center space-x-1 hover:underline">
                <Phone className="w-3 h-3" />
                <span>+(857) 000 579</span>
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <button
                onClick={() => setLanguage(language === "en" ? "es" : "en")}
                className="hover:underline"
              >
                {language === "en" ? "Español" : "English"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="cursor-pointer"
              onClick={() => {
                if (location !== "/") {
                  window.location.href = "/";
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <div className="text-2xl font-bold text-[#2c3e50] tracking-tight">
                MxSmiles
              </div>
              <div className="ml-2 text-sm text-[#3498db] font-medium hidden sm:block">
                Compassionate Care
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleClick(item.href)}
                className={`text-base font-medium transition-colors duration-200 hover:text-[#3498db] flex items-center gap-1 ${
                  isActive(item.href) 
                    ? 'text-[#3498db] border-b-2 border-[#3498db] pb-1' 
                    : 'text-[#2c3e50]'
                }`}
              >
                {item.label}
                {item.hasArrow && <ArrowUpRight className="w-3 h-3" />}
              </Link>
            ))}
          </div>

          {/* CTA Button - Senior Care Style */}
          <div className="flex items-center space-x-4">
            <Link href="/booking" className="hidden sm:block">
              <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-medium px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-md">
                {t.nav.freeConsultation}
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#2c3e50] hover:text-[#3498db] transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white rounded-b-2xl shadow-lg">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`block py-3 px-4 text-base font-medium rounded-xl transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-[#3498db] bg-blue-50'
                      : 'text-[#2c3e50] hover:text-[#3498db] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <Link href="/booking">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white font-medium px-6 py-3 rounded-full transition-all duration-200"
                  >
                    {t.nav.freeConsultation}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}