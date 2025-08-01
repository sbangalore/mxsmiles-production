import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
}

export default function SEOOptimization({
  title = "MxSmiles - Affordable Dental Tourism in Mexico | Save 40-70% on Dental Care",
  description = "Get high-quality dental care in Mexico and save 40-70% on treatments. Trusted dental tourism with top-rated clinics in Los Algodones and Tijuana. Free consultation available.",
  keywords = "dental tourism Mexico, cheap dental care, Los Algodones dentist, Tijuana dental implants, affordable dental work, Mexico dental vacation, dental tourism packages",
  canonical = "https://mxsmiles.com",
  ogTitle,
  ogDescription,
  ogImage = "https://mxsmiles.com/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData
}: SEOProps) {
  
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || title;
  const finalTwitterDescription = twitterDescription || description;
  const finalTwitterImage = twitterImage || ogImage;

  // Default structured data for dental practice
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "DentalClinic",
    "name": "MxSmiles",
    "description": "Affordable dental tourism connecting US and Canadian patients with top-rated dental clinics in Mexico",
    "url": canonical,
    "logo": "https://mxsmiles.com/logo.png",
    "image": ogImage,
    "telephone": "+1-558-845-8889",
    "email": "info@mxsmiles.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Mexico",
      "addressLocality": "Los Algodones",
      "addressRegion": "Baja California"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "32.7157",
      "longitude": "-114.7108"
    },
    "openingHours": "Mo-Fr 08:00-17:00",
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, Insurance",
    "currenciesAccepted": "USD, CAD",
    "availableLanguage": ["English", "Spanish"],
    "medicalSpecialty": [
      "Dental Implants",
      "Cosmetic Dentistry", 
      "Orthodontics",
      "Oral Surgery",
      "Preventive Dentistry"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "2847"
    },
    "offers": {
      "@type": "Offer",
      "description": "Save 40-70% on dental treatments compared to US prices",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "USD",
        "price": "Starting from $299"
      }
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="MxSmiles" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@mxsmiles" />
      <meta name="twitter:creator" content="@mxsmiles" />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="MxSmiles" />
      <meta name="publisher" content="MxSmiles" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Language and Location */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="US-CA" />
      <meta name="geo.country" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Theme and Branding */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//google-analytics.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
}

// Specific SEO components for different pages
export function HomeSEO() {
  return (
    <SEOOptimization
      title="MxSmiles - Save 40-70% on Dental Care in Mexico | Dental Tourism"
      description="Get affordable, high-quality dental care in Mexico. Save 40-70% on dental implants, crowns, veneers and more. Free consultation with top-rated clinics in Los Algodones and Tijuana."
      keywords="dental tourism Mexico, affordable dental care, Los Algodones dentist, Tijuana dental implants, cheap dental work Mexico, dental vacation packages, Mexico dental tourism"
      canonical="https://mxsmiles.com"
    />
  );
}

export function BlogSEO() {
  return (
    <SEOOptimization
      title="Dental Tourism Blog - Expert Tips & Guides | MxSmiles"
      description="Get expert advice on dental tourism to Mexico. Read comprehensive guides on procedures, destinations, costs, and patient experiences from our dental tourism specialists."
      keywords="dental tourism blog, Mexico dental care tips, Los Algodones dental guide, dental tourism advice, Mexico dentist reviews"
      canonical="https://mxsmiles.com/blog"
      ogType="blog"
    />
  );
}

export function BookingSEO() {
  return (
    <SEOOptimization
      title="Book Free Dental Consultation | MxSmiles Dental Tourism"
      description="Schedule your free consultation with our dental tourism experts. Get personalized treatment recommendations and cost estimates for dental care in Mexico."
      keywords="free dental consultation, book dental appointment Mexico, dental tourism consultation, MxSmiles booking"
      canonical="https://mxsmiles.com/booking"
    />
  );
}