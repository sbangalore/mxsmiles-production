import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProviderApplicationSchema, type InsertProviderApplication } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Building2, Phone, Mail, MapPin, Award, Users, Clock, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const specialtyOptions = [
  "General Dentistry",
  "Cosmetic Dentistry",
  "Oral Surgery",
  "Orthodontics",
  "Endodontics",
  "Periodontics",
  "Prosthodontics",
  "Pediatric Dentistry",
  "Implantology",
  "Oral Pathology"
];

const languageOptions = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Mandarin",
  "Japanese",
  "Korean"
];

export default function ProviderApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const form = useForm<InsertProviderApplication>({
    resolver: zodResolver(insertProviderApplicationSchema),
    defaultValues: {
      clinicName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      specialties: "",
      yearsInBusiness: 1,
      numberOfDentists: 1,
      certifications: "",
      languages: "",
      description: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertProviderApplication) => {
      const response = await fetch("/api/provider-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider-applications"] });
      toast({
        title: "Application Submitted",
        description: t.providerApplication.form.successMessage,
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: t.providerApplication.form.errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: InsertProviderApplication) => {
    setIsSubmitting(true);
    submitMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="w-6 h-6" />
            {t.providerApplication.form.title}
          </CardTitle>
          <p className="text-blue-100">
            {t.providerApplication.form.subtitle}
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {t.providerApplication.form.sectionTitles.clinicInformation}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clinicName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.clinicName}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.clinicNamePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.contactName}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.contactNamePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.email}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t.providerApplication.form.emailPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.phone}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.phonePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.website}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.websitePlaceholder} {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {t.providerApplication.form.sectionTitles.locationDetails}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t.providerApplication.form.address}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.addressPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.city}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.cityPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.state}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.statePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.zipCode}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.zipCodePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Practice Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  {t.providerApplication.form.sectionTitles.practiceDetails}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.specialties}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.specialtiesPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.languages}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.providerApplication.form.languagesPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearsInBusiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.yearsInOperation}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="50" 
                            placeholder={t.providerApplication.form.yearsInOperationPlaceholder}
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfDentists"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.providerApplication.form.patientCapacity}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="20" 
                            placeholder={t.providerApplication.form.patientCapacityPlaceholder}
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t.providerApplication.form.certifications}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t.providerApplication.form.certificationsPlaceholder}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.providerApplication.form.sectionTitles.aboutYourPractice}
                </h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.providerApplication.form.description}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t.providerApplication.form.descriptionPlaceholder}
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h4 className="font-semibold text-primary mb-2">{t.providerApplication.form.nextSteps.title}</h4>
                <div className="space-y-2 text-sm text-primary/90">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{t.providerApplication.form.nextSteps.review}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{t.providerApplication.form.nextSteps.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{t.providerApplication.form.nextSteps.onboarding}</span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#007aff] hover:bg-[#0051d0] text-white py-4 text-lg font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.providerApplication.form.submitting : t.providerApplication.form.submitButton}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}