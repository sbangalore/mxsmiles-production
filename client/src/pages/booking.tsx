import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Video, Phone, Calendar as CalendarIcon, User, Mail, MessageSquare, Star, CheckCircle, Users, Building } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BookingSEO } from "@/components/seo-optimization";
import { trackEvent } from "@/lib/analytics";

// Booking form schema
const bookingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  timezone: z.string().min(1, "Please select your timezone"),
  contactMethod: z.enum(["phone", "email", "video"]),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// BookingForm component
function BookingForm({ serviceType }: { serviceType: 'consultation' | 'provider' | null }) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contactMethod: "video",
      timezone: "America/New_York",
      phone: "+1 "
    }
  });

  const submitBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData & { serviceType: string }) => {
      // Map form data to backend schema
      const backendData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        timeZone: data.timezone,
        contactMethod: data.contactMethod,
        serviceInterest: data.serviceType === 'consultation' ? 'Free Patient Consultation' : 'Provider Partnership',
        treatmentInterest: data.serviceType === 'consultation' ? 'Free Patient Consultation' : 'Provider Partnership',
        message: data.message || '',
        consultationType: data.contactMethod,
      };

      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Booking submission error:', errorData);
        throw new Error(errorData.message || "Failed to submit booking");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast({
        title: "✅ Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your appointment. Check your email for confirmation details.",
      });
      reset(); // Reset form fields
    },
    onError: (error: any) => {
      console.error('Booking mutation error:', error);
      toast({
        title: "❌ Booking Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    submitBookingMutation.mutate({
      ...data,
      serviceType: serviceType || 'consultation',
    });
  };

  if (!serviceType) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a service type above to continue booking.</p>
      </div>
    );
  }

  // Show success state after submission
  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Request Submitted!</h3>
          <p className="text-gray-600 mb-4">
            Thank you! We've received your booking request and will contact you within 24 hours to confirm your appointment.
          </p>
          <p className="text-sm text-gray-500">
            An email notification has been sent to our team with your details.
          </p>
        </div>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="rounded-2xl"
        >
          Schedule Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName" className="text-base font-medium">Full Name *</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="Enter your full name"
              className={`mt-2 h-12 ${errors.fullName ? "border-red-500" : ""}`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="your@email.com"
              className={`mt-2 h-12 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+1 (555) 123-4567"
            defaultValue="+1 "
            className={`mt-2 h-12 ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Scheduling */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Preferred Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="preferredDate" className="text-base font-medium">Preferred Date *</Label>
            <Input
              id="preferredDate"
              type="date"
              {...register("preferredDate")}
              min={new Date().toISOString().split('T')[0]}
              className={`mt-2 h-12 ${errors.preferredDate ? "border-red-500" : ""}`}
            />
            {errors.preferredDate && (
              <p className="text-red-500 text-sm mt-1">{errors.preferredDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="preferredTime" className="text-base font-medium">Preferred Time *</Label>
            <Select onValueChange={(value) => setValue("preferredTime", value)}>
              <SelectTrigger className={`mt-2 h-12 ${errors.preferredTime ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
                <SelectItem value="17:00">5:00 PM</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredTime && (
              <p className="text-red-500 text-sm mt-1">{errors.preferredTime.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="timezone" className="text-base font-medium">Timezone *</Label>
            <Select onValueChange={(value) => setValue("timezone", value)} defaultValue="America/New_York">
              <SelectTrigger className="mt-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Toronto">Toronto (ET)</SelectItem>
                <SelectItem value="America/Vancouver">Vancouver (PT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contactMethod" className="text-base font-medium">Preferred Contact Method *</Label>
            <Select onValueChange={(value) => setValue("contactMethod", value as "phone" | "email" | "video")} defaultValue="video">
              <SelectTrigger className="mt-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Call (Zoom)</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-3">
        <Label htmlFor="message" className="text-base font-medium">Additional Information (Optional)</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your specific needs, questions, or any special requirements..."
          rows={4}
          className="mt-2"
        />
      </div>

      {/* Submit */}
      <div className="pt-6">
        <Button 
          type="submit" 
          disabled={isSubmitting || submitBookingMutation.isPending}
          onClick={() => {
            // Track Google Analytics event
            trackEvent('consultation_booking', 'engagement', 'Schedule Free Consultation');
          }}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-2xl transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(isSubmitting || submitBookingMutation.isPending) ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            `Schedule ${serviceType === 'consultation' ? 'Free Consultation' : 'Provider Meeting'}`
          )}
        </Button>
        
        <div className="mt-6 p-5 bg-blue-50 rounded-2xl text-sm text-blue-900/80 border border-blue-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-2">What happens next:</p>
              <ul className="text-sm space-y-2">
                <li>📧 Confirmation email sent immediately</li>
                <li>📞 Our team will call within 24 hours to confirm details</li>
                <li>🎥 Calendar invite with meeting link will be sent</li>
                <li>⏰ Reminder notification 1 hour before appointment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function BookingPage() {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<'consultation' | 'provider' | null>(null);

  // Scroll to top when component mounts or when hash includes 'top'
  useEffect(() => {
    if (window.location.hash.includes('top') || window.location.hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clean up the hash
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Always scroll to top on booking page load
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const services = [
    {
      id: 'consultation' as const,
      title: 'Free Patient Consultation',
      description: 'Schedule a free consultation to discuss your dental needs and treatment options in Mexico',
      icon: <User className="w-8 h-8 text-primary" />,
      duration: '30 minutes',
      price: 'FREE',
      features: [
        'Personalized treatment recommendations',
        'Cost estimates and financing options',
        'Travel and accommodation guidance',
        'Answer to all your questions'
      ],
      doctor: {
        name: 'Dr. Maria Martinez',
        title: 'Senior Dental Consultant',
        company: 'MxSmiles - Dental Tourism Specialist',
        image: '/api/placeholder/64/64'
      }
    },
    {
      id: 'provider' as const,
      title: 'Provider Partnership Meeting',
      description: 'Join our network of dental providers and expand your practice with international patients',
      icon: <Building className="w-8 h-8 text-green-600" />,
      duration: '45 minutes',
      price: 'FREE',
      features: [
        'Partnership benefits discussion',
        'Network requirements review',
        'Revenue potential analysis',
        'Next steps and onboarding'
      ],
      doctor: {
        name: 'Dr. Carlos Rodriguez',
        title: 'Partnership Director',
        company: 'MxSmiles - Provider Relations',
        image: '/api/placeholder/64/64'
      }
    }
  ];

  const selectedServiceData = services.find(s => s.id === selectedService);

  // Show booking form when service is selected
  if (selectedService && selectedServiceData) {
    return (
      <>
        <BookingSEO />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mt-16 grid lg:grid-cols-2 gap-12">
              {/* Service Details */}
              <Card>
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-6">
                    {selectedServiceData.icon}
                  </div>
                  <CardTitle className="text-xl mb-4">{selectedServiceData.title}</CardTitle>
                  <CardDescription className="text-base">
                    {selectedServiceData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedServiceData.duration}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {selectedServiceData.price}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={selectedServiceData.doctor.image} />
                      <AvatarFallback>{selectedServiceData.doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{selectedServiceData.doctor.name}</p>
                      <p className="text-xs text-gray-600">{selectedServiceData.doctor.title}</p>
                      <p className="text-xs text-gray-500">{selectedServiceData.doctor.company}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {selectedServiceData.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">4.9/5 Rating</span>
                    </div>
                    <p className="text-xs text-gray-600">Based on 2,800+ consultations</p>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Widget */}
              <Card>
                <CardHeader className="pb-8">
                  <CardTitle className="mb-2">Schedule Your Meeting</CardTitle>
                  <CardDescription>
                    Choose your preferred date and time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <BookingForm serviceType={selectedService} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingSEO />
      <div className="min-h-screen bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Book Your Appointment</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schedule a free consultation or provider partnership meeting with our expert team
            </p>
          </div>

          {/* Service Selection */}
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card 
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200"
                onClick={() => setSelectedService(service.id)}
              >
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-6">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl mb-4">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {service.price}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" size="lg">
                      Schedule {service.id === 'consultation' ? 'Free Consultation' : 'Provider Meeting'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Signals */}
          <div className="mt-20 text-center">
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">15,000+ Patients</h3>
                <p className="text-sm text-gray-600">Successfully treated with our network</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">4.9/5 Rating</h3>
                <p className="text-sm text-gray-600">Based on verified patient reviews</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Professional Care</h3>
                <p className="text-sm text-gray-600">Board-certified dentists and modern facilities</p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-600 text-white rounded-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Select a service above to schedule your free consultation or partnership meeting
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setSelectedService('consultation')}
                >
                  Book Patient Consultation
                </Button>
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 border-2 border-white font-semibold"
                  onClick={() => setSelectedService('provider')}
                >
                  Schedule Provider Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}