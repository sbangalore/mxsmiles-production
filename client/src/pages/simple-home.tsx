import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Star, DollarSign, Shield, Heart } from "lucide-react";

export default function SimpleHome() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              🦷 Save 40-70% on Dental Care in Mexico
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Get world-class dental treatment at a fraction of US costs. Trusted by thousands of patients who've saved thousands of dollars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#64A8F0] hover:bg-[#5496dd] text-white px-8 py-4 text-lg">
                <Phone className="mr-2 h-5 w-5" />
                Get Free Consultation
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <DollarSign className="mr-2 h-5 w-5" />
                Calculate Savings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MxSmiles?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect you with certified dental professionals in Mexico's top medical tourism destinations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-2 hover:border-[#64A8F0] transition-colors">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-[#64A8F0] mx-auto mb-4" />
                <CardTitle className="text-2xl text-gray-900">Massive Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Save 40-70% compared to US dental costs while receiving the same quality of care from certified professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#64A8F0] transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-[#64A8F0] mx-auto mb-4" />
                <CardTitle className="text-2xl text-gray-900">Quality Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Work with certified dentists in modern facilities using the latest technology and international standards.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#64A8F0] transition-colors">
              <CardHeader>
                <Heart className="h-12 w-12 text-[#64A8F0] mx-auto mb-4" />
                <CardTitle className="text-2xl text-gray-900">Trusted Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Join thousands of satisfied patients who have transformed their smiles while saving money in Mexico.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600">Real stories from real patients</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                location: "Phoenix, AZ",
                treatment: "Dental Implants",
                rating: 5,
                text: "Saved $8,000 on dental implants and received amazing care. The clinic in Los Algodones was more modern than my dentist back home!"
              },
              {
                name: "Michael Chen",
                location: "San Diego, CA",
                treatment: "Full Mouth Restoration",
                rating: 5,
                text: "The quality exceeded my expectations. Professional staff, modern equipment, and saved over $15,000 compared to US prices."
              },
              {
                name: "Maria Rodriguez",
                location: "El Paso, TX",
                treatment: "Cosmetic Dentistry",
                rating: 5,
                text: "My smile transformation was incredible! The dentist spoke perfect English and the results are better than I dreamed."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-[#64A8F0] transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
                  <p className="text-sm font-medium text-[#64A8F0]">{testimonial.treatment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[#64A8F0] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Save on Dental Care?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get a free consultation and personalized treatment plan today
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span className="text-lg font-medium">Call: (555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span className="text-lg font-medium">info@mxsmiles.com</span>
                </div>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-white text-[#64A8F0] hover:bg-gray-100 px-8 py-4 text-lg font-semibold w-full"
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}