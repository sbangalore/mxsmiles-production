import { Link } from "wouter";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[#1d1d1f] text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Company Info - Left Side */}
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">MxSmiles</h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base max-w-md">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Subscribe to our YouTube channel">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Contact us on WhatsApp">
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info - Right Side */}
          <div className="flex-shrink-0">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">{t.footer.contactUs}</h4>
            <ul className="space-y-2 text-gray-300 text-sm md:text-base">
              <li>
                <a href="mailto:info@mxsmiles.com" className="hover:text-white transition-colors">
                  info@mxsmiles.com
                </a>
              </li>
              <li className="text-gray-300">
                {t.footer.newYork}
              </li>
              <li><Link href="/booking" className="hover:text-white transition-colors">{t.footer.freeConsultation}</Link></li>
              <li><Link href="/provider-application" className="hover:text-white transition-colors">{t.footer.providerOnboarding}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li className="text-gray-300">{t.footer.support24}</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-xs md:text-sm">
              {t.footer.copyright}
            </p>
            <div className="flex flex-wrap justify-center md:space-x-6 mt-3 md:mt-0 gap-4 md:gap-0">
              <Link href="/privacy-policy" className="text-gray-300 hover:text-white text-xs md:text-sm transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="/terms-of-service" className="text-gray-300 hover:text-white text-xs md:text-sm transition-colors">
                {t.footer.termsOfService}
              </Link>
              <Link href="/medical-disclaimer" className="text-gray-300 hover:text-white text-xs md:text-sm transition-colors">
                {t.footer.medicalDisclaimer}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
