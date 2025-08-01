import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language-context";
import { insertConsultationRequestSchema, type InsertConsultationRequest } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Phone, Mail, MessageSquare, Upload, Stethoscope, User } from "lucide-react";

export default function ConsultationPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsertConsultationRequest>({
    resolver: zodResolver(insertConsultationRequestSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      contactMethod: "phone",
      serviceInterest: "",
      dateOfBirth: "",
      description: "",
      preferredDate: "",
      preferredTime: "",
      photoUrl: uploadedPhotos[0] || "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: InsertConsultationRequest) => 
      apiRequest('/api/consultation', 'POST', data),
    onSuccess: () => {
      setIsSuccess(true);
      setIsSubmitting(false);
      toast({
        title: t.common.success,
        description: t.consultationForm.successMessage,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      console.error('Consultation submission error:', error);
      toast({
        title: t.common.error,
        description: "There was a problem submitting your consultation request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: InsertConsultationRequest) => {
    setIsSubmitting(true);
    
    try {
      let formData = data;
      
      // Use the uploaded photo URL if available
      if (uploadedPhotos.length > 0) {
        formData.photoUrl = uploadedPhotos[0];
      }

      submitMutation.mutate(formData);
    } catch (error) {
      console.error('Consultation submission error:', error);
      toast({
        title: t.common.error,
        description: "There was a problem submitting your consultation request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    { value: "general", label: t.consultationForm.serviceSelection.general, icon: Stethoscope },
    { value: "cosmetic", label: t.consultationForm.serviceSelection.cosmetic, icon: User },
    { value: "orthodontics", label: t.consultationForm.serviceSelection.orthodontics, icon: CheckCircle },
    { value: "oral_surgery", label: t.consultationForm.serviceSelection.oralSurgery, icon: Stethoscope },
    { value: "emergency", label: t.consultationForm.serviceSelection.emergency, icon: Phone },
    { value: "consultation", label: t.consultationForm.serviceSelection.notSure, icon: MessageSquare },
  ];

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>{t.consultationForm.title} - MxSmiles</title>
          <meta name="description" content={t.consultationForm.subtitle} />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t.common.success}!
              </h1>
              <p className="text-gray-600 mb-6">
                {t.consultationForm.successMessage}
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                {t.nav.home}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t.consultationForm.title} - MxSmiles | Secure Dental Tourism</title>
        <meta 
          name="description" 
          content={`${t.consultationForm.subtitle} Secure patient communications and personalized treatment plans.`}
        />
        <meta name="keywords" content="free dental consultation, MxSmiles consultation, dental tourism Mexico, secure dental consultation" />
        <link rel="canonical" href="https://mxsmiles.com/consultation" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t.consultationForm.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
              {t.consultationForm.subtitle}
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-8 md:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  {/* Service Selection */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                      {t.consultationForm.serviceSelection.title}
                    </h3>
                    <RadioGroup
                      value={watch("serviceInterest")}
                      onValueChange={(value) => setValue("serviceInterest", value)}
                      className="grid grid-cols-1 gap-3"
                    >
                      {serviceOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-3 md:p-4 hover:bg-gray-50">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <option.icon className="w-5 h-5 text-blue-600" />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.serviceInterest && (
                      <p className="text-red-500 text-sm mt-1">{errors.serviceInterest.message}</p>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                      {t.consultationForm.personalInfo.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName">
                          {t.consultationForm.personalInfo.fullName} *
                        </Label>
                        <Input 
                          id="fullName"
                          placeholder={t.consultationForm.placeholders.fullName}
                          {...register("fullName")}
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">
                          {t.consultationForm.personalInfo.phone} *
                        </Label>
                        <Input 
                          id="phone"
                          type="tel"
                          placeholder={t.consultationForm.placeholders.phone}
                          {...register("phone")}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">
                          {t.consultationForm.personalInfo.email} *
                        </Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder={t.consultationForm.placeholders.email}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactMethod">
                          {t.consultationForm.personalInfo.contactMethod} *
                        </Label>
                        <Select
                          value={watch("contactMethod")}
                          onValueChange={(value) => setValue("contactMethod", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t.common.select} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {t.consultationForm.personalInfo.contactOptions.phone}
                              </div>
                            </SelectItem>
                            <SelectItem value="email">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {t.consultationForm.personalInfo.contactOptions.email}
                              </div>
                            </SelectItem>
                            <SelectItem value="text">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                {t.consultationForm.personalInfo.contactOptions.text}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.contactMethod && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactMethod.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth">
                          {t.consultationForm.personalInfo.dateOfBirth} ({t.common.optional})
                        </Label>
                        <Input 
                          id="dateOfBirth"
                          type="date"
                          {...register("dateOfBirth")}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="description">
                        {t.consultationForm.personalInfo.description} ({t.common.optional})
                      </Label>
                      <Textarea 
                        id="description"
                        placeholder={t.consultationForm.placeholders.description}
                        className="min-h-24"
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Preferred Consultation Schedule */}
                    <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                        {language === 'es' ? 'Horario Preferido para Consulta' : 'Preferred Consultation Schedule'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <Label htmlFor="preferredDate">
                            {language === 'es' ? 'Fecha Preferida' : 'Preferred Date'} ({t.common.optional})
                          </Label>
                          <Input 
                            id="preferredDate"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            {...register("preferredDate")}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="preferredTime">
                            {language === 'es' ? 'Hora Preferida' : 'Preferred Time'} ({t.common.optional})
                          </Label>
                          <Select
                            value={watch("preferredTime") || ""}
                            onValueChange={(value) => setValue("preferredTime", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'es' ? 'Seleccionar hora' : 'Select time'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9:00">9:00 AM</SelectItem>
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
                        </div>
                      </div>
                      
                      <p className="text-sm text-blue-600">
                        {language === 'es' 
                          ? 'Si programas una consulta, recibirás un enlace de Zoom y una invitación de calendario.'
                          : 'If you schedule a consultation, you will receive a Zoom link and calendar invite.'
                        }
                      </p>
                    </div>

                    <div className="mt-6">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        {t.consultationForm.personalInfo.photoUpload} ({t.common.optional})
                      </Label>
                      <PhotoUpload
                        onUploadComplete={(url) => {
                          setUploadedPhotos([url]);
                          setValue("photoUrl", url);
                        }}
                        onUploadError={(error) => {
                          toast({
                            title: "Upload Error",
                            description: error,
                            variant: "destructive",
                          });
                        }}
                        multiple={false}
                        maxFiles={1}
                        uploadText={language === 'es' ? 'Subir Foto Dental' : 'Upload Dental Photo'}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {language === 'es' 
                          ? 'Opcional: Sube una foto de tu situación dental actual para una evaluación más precisa.'
                          : 'Optional: Upload a photo of your current dental situation for more accurate evaluation.'
                        }
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.consultationForm.submitting : t.common.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}