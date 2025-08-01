import { useEffect } from "react";
import Hero from "@/components/sections/hero";
import CostComparison from "@/components/sections/cost-comparison";
import PricingCalculator from "@/components/sections/pricing-calculator";
import ServicesGrid from "@/components/sections/services-grid";
import About from "@/components/sections/about";
import Reviews from "@/components/sections/reviews";
import Contact from "@/components/sections/contact";


import Locations from "@/components/sections/locations";
import { Helmet } from "react-helmet";
import { HomeSEO } from "@/components/seo-optimization";
import { ConditionalMotion } from "@/hooks/use-motion-component";

export default function Home() {
  // Handle URL hash fragments when page loads (for navigation from other pages)
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.substring(1); // Remove the # symbol
      if (hash) {
        // Small delay to ensure the page has rendered and animations have completed
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      }
    };

    // Handle hash on initial load
    handleHashScroll();

    // Also handle hash changes (in case of programmatic navigation)
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);
  return (
    <>
      <HomeSEO />
      
      <Hero />
      <ConditionalMotion 
        id="cost-comparison"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <CostComparison />
      </ConditionalMotion>
      <ConditionalMotion 
        id="pricing"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <PricingCalculator />
      </ConditionalMotion>
      <ConditionalMotion 
        id="services"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <ServicesGrid />
      </ConditionalMotion>
      <ConditionalMotion 
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <About />
      </ConditionalMotion>
      <ConditionalMotion 
        id="testimonials"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Reviews />
      </ConditionalMotion>

      <ConditionalMotion 
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Contact />
      </ConditionalMotion>

      <ConditionalMotion
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Locations />
      </ConditionalMotion>
    </>
  );
}
