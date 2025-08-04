import React from 'react';

export default function Hero() {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              🦷 Save 40-70% on Dental Care in Mexico
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed opacity-95">
              Get world-class dental treatment in Mexico at a fraction of US costs. 
              Trusted by thousands of patients who've transformed their smiles while saving thousands of dollars.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a 
                href="tel:+15551234567"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                📞 Get Free Consultation
              </a>
              <button
                onClick={scrollToPricing}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                💰 Calculate Savings
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white border-opacity-20">
              <div className="flex items-center text-sm opacity-90">
                <span className="text-yellow-400 mr-2">⭐</span>
                4.9/5 Rating from 2,000+ Patients
              </div>
              <div className="flex items-center text-sm opacity-90">
                <span className="text-green-400 mr-2">🛡️</span>
                100% Money-Back Guarantee
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&fm=webp&q=85"
              alt="Modern dental clinic interior"
              className="rounded-2xl shadow-2xl w-full h-auto"
              width={800}
              height={600}
            />
            
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=32&h=32&fit=crop&crop=face&fm=webp&q=80"
                    alt="Dr. Rodriguez"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    width={32}
                    height={32}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face&fm=webp&q=80"
                    alt="Dr. Martinez"  
                    className="w-8 h-8 rounded-full border-2 border-white"
                    width={32}
                    height={32}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face&fm=webp&q=80"
                    alt="Dr. Garcia"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Board Certified Team</div>
                  <div className="text-xs text-gray-600">15+ Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
