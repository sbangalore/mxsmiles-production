import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "@/components/language-selector";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { t } = useLanguage();

  // Navigation ordered by homepage sections from top to bottom
  const navigation = [
    { name: t.nav.pricing, href: "/#pricing", hasArrow: false },
    { name: t.nav.services, href: "/#services", hasArrow: false },
    { name: t.nav.about, href: "/#about", hasArrow: false },
    { name: t.nav.reviews, href: "/#testimonials", hasArrow: false },
    { name: t.nav.contact, href: "/#contact", hasArrow: false },
    { name: "Blog", href: "/blog", hasArrow: true },
  ];

  // Scroll detection for active section highlighting
  useEffect(() => {
    if (location !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Check sections in reverse order (bottom to top)
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
        // If we're at the top of the page (hero section), show pricing as active
        setActiveSection("pricing");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.split("#")[1];
      if (location !== "/") {
        // Navigate to home first, then scroll to section after page loads
        window.location.href = href;
      } else {
        // Already on home page, just scroll to section
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
  };

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.split("#")[1];
      return location === "/" && activeSection === sectionId;
    }
    return location === href;
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
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
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--medical-blue)]">MxSmiles</h1>
                <p className="text-xs text-[var(--trust-gray)] hidden sm:block">{t.hero.tagline}</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                item.href.startsWith("/#") ? (
                  <button
                    key={item.name}
                    onClick={() => handleClick(item.href)}
                    className={`transition-colors hover:text-[var(--medical-blue)] flex items-center gap-1 ${
                      isActive(item.href) 
                        ? "text-[var(--medical-blue)]" 
                        : "text-[var(--trust-gray)]"
                    }`}
                  >
                    {item.name}
                    {item.hasArrow && <ArrowUpRight className="w-3 h-3" />}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors hover:text-[var(--medical-blue)] flex items-center gap-1 ${
                      isActive(item.href) 
                        ? "text-[var(--medical-blue)]" 
                        : "text-[var(--trust-gray)]"
                    }`}
                  >
                    {item.name}
                    {item.hasArrow && <ArrowUpRight className="w-3 h-3" />}
                  </Link>
                )
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            {/* Free consultation button - hidden on mobile, shown on desktop */}
            <Button asChild className="hidden md:flex bg-[var(--medical-blue)] text-white hover:bg-primary/90">
              <Link href="/booking">{t.nav.consultation}</Link>
            </Button>
            
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-6 flow-root">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      item.href.startsWith("/#") ? (
                        <button
                          key={item.name}
                          onClick={() => {
                            handleClick(item.href);
                            setIsOpen(false);
                          }}
                          className={`block px-3 py-2 text-base font-medium transition-colors hover:text-[var(--medical-blue)] text-left w-full ${
                            isActive(item.href) 
                              ? "text-[var(--medical-blue)]" 
                              : "text-[var(--trust-gray)]"
                          }`}
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`block px-3 py-2 text-base font-medium transition-colors hover:text-[var(--medical-blue)] ${
                            isActive(item.href) 
                              ? "text-[var(--medical-blue)]" 
                              : "text-[var(--trust-gray)]"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
