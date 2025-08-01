import React from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";

export default function ConsultationPage() {
  const { t } = useLanguage();
  
  // Redirect to Cal.com booking page
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/booking';
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Free Consultation - MxSmiles</title>
        <meta 
          name="description" 
          content="Schedule your free dental consultation with MxSmiles. Get personalized treatment recommendations and cost estimates."
        />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12 text-blue-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl">Redirecting to Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We're taking you to our new booking system powered by Cal.com for a better experience.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <span>Loading</span>
              <ArrowRight className="w-4 h-4 animate-bounce" />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              If you're not redirected automatically, <a href="/booking" className="text-blue-600 underline">click here</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}