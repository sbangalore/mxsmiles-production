import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, User, Quote } from "lucide-react";
import { ConditionalMotion } from "@/hooks/use-motion-component";
import { Link } from "wouter";
import type { Testimonial } from "@shared/schema";
import { useLanguage } from "@/contexts/language-context";
import { OptimizedImage } from "@/components/performance/image-optimizer";
import { useDesign } from "@/contexts/design-context";

export default function Reviews() {
  const { t } = useLanguage();
  const { theme } = useDesign();
  const { data: testimonials, isLoading } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ["/api/testimonials"],
  });

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              {t.testimonials.patientReviews}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from patients who saved thousands on quality dental care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const reviews = testimonials?.data || [];

  return (
    <section id="testimonials" className="py-20 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConditionalMotion
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            {t.testimonials.patientReviews}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </ConditionalMotion>

        {reviews.length === 0 ? (
          <ConditionalMotion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reviews Coming Soon
              </h3>
              <p className="text-gray-600">
                We're collecting patient testimonials. Check back soon to read success stories!
              </p>
            </div>
          </ConditionalMotion>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ConditionalMotion
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100">
                  <CardContent className="p-6">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < parseInt(review.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>

                    {/* Testimonial */}
                    <div className="relative mb-6">
                      <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-200" />
                      <p className="text-gray-700 leading-relaxed pl-4">
                        "{review.testimonial}"
                      </p>
                      {review.originalLanguage && review.originalLanguage === 'es' && (
                        <p className="text-xs text-gray-500 italic pl-4 mt-2">
                          {t.testimonials.translatedFrom} {t.testimonials.spanish}
                        </p>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-2">
                        {review.imageUrl ? (
                          <OptimizedImage
                            src={review.imageUrl}
                            alt={review.patientName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                            width={40}
                            height={40}
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.patientName}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {review.location}
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 px-3 py-2 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Treatment: {review.treatment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ConditionalMotion>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <ConditionalMotion
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <div className="bg-primary text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{t.about.readyToJoin}</h3>
            <p className="text-white/80 mb-6">
              {t.about.readyToJoinDesc}
            </p>
            <div className="flex justify-center">
              <Button 
                className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary-lighter transition-colors"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t.nav.freeConsultation}
              </Button>
            </div>
          </div>
        </ConditionalMotion>

        {/* Trust Indicators */}
        <ConditionalMotion
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600">{t.about.happyPatients}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
            <p className="text-gray-600">{t.about.averageRating}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
            <p className="text-gray-600">{t.about.averageSavings}</p>
          </div>
        </ConditionalMotion>
      </div>
    </section>
  );
}