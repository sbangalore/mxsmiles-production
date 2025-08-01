import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Calculator, Tag, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimationPresets } from "@/hooks/use-scroll-animation";
import { ConditionalMotion } from "@/hooks/use-motion-component";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/performance/image-optimizer";

export default function Hero() {
  const { t } = useLanguage();
  const { theme, getThemeClasses } = useDesign();
  const themeClasses = getThemeClasses();
  const { fadeInLeft, fadeInRight, fadeInUp } = useAnimationPresets();
  
  return (
    <section className="hero-section bg-[#fbfbfd] py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ConditionalMotion
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-xl text-[var(--trust-gray)] mb-12 leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            <ConditionalMotion 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <ConditionalMotion
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/booking">
                  <Button 
                    className={`${themeClasses.primaryButton} px-8 py-4 font-medium text-lg w-full`}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {t.hero.ctaFree}
                  </Button>
                </Link>
              </ConditionalMotion>
              <ConditionalMotion
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className={`${themeClasses.secondaryButton} px-8 py-4 font-medium text-lg border-2`}
                  onClick={() => {
                    const element = document.getElementById('pricing');
                    if (element) {
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
                      window.scrollTo({ 
                        top: elementPosition, 
                        behavior: "smooth" 
                      });
                    }
                  }}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {t.hero.ctaCalculate}
                </Button>
              </ConditionalMotion>
            </ConditionalMotion>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-[var(--trust-gray)]">
                <Star className="w-4 h-4 text-[var(--mexican-orange)] mr-2" />
                {t.hero.trustIndicators.rating}
              </div>
              <div className="flex items-center text-sm text-[var(--trust-gray)]">
                <Tag className="w-4 h-4 text-[var(--health-green)] mr-2" />
                {t.hero.trustIndicators.guarantee}
              </div>
            </div>
          </ConditionalMotion>
          
          {/* Hero Image */}
          <ConditionalMotion 
            className="relative"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&fm=webp&q=85"
              alt="Modern dental clinic interior"
              className="rounded-2xl shadow-2xl w-full h-auto"
              width={800}
              height={600}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 584px"
              style={{ maxWidth: '584px', height: 'auto' }}
            />
            
            {/* Floating Trust Badge */}
            <ConditionalMotion 
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: [0, -5, 0]
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 1.2 },
                scale: { duration: 0.6, delay: 1.2 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=60&h=60&fit=crop&crop=face&fm=webp&q=80"
                    alt="Dr. Rodriguez"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    width={32}
                    height={32}
                    sizes="32px"
                  />
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face&fm=webp&q=80"
                    alt="Dr. Martinez"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    width={32}
                    height={32}
                    sizes="32px"
                  />
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face&fm=webp&q=80"
                    alt="Dr. Garcia"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    width={32}
                    height={32}
                    sizes="32px"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.about.boardCertifiedTeam}</div>
                  <div className="text-xs text-[var(--trust-gray)]">{t.about.yearsExperience}</div>
                </div>
              </div>
            </ConditionalMotion>
          </ConditionalMotion>
        </div>
      </div>
    </section>
  );
}
