import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ConditionalMotion } from "@/hooks/use-motion-component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.contact.form.success,
        description: t.contact.emailResponse,
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: t.contact.form.error,
        description: t.contact.form.error,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConditionalMotion 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t.contact.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contact.subtitle}
          </p>
        </ConditionalMotion>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ConditionalMotion
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.contact.getInTouch}</h3>
                <p className="text-gray-600 mb-8">
                  {t.contact.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.contact.email}</h4>
                    <a href="mailto:info@mxsmiles.com" className="text-green-600 hover:text-green-700 transition-colors">
                      info@mxsmiles.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{t.contact.emailResponse}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.contact.locations}</h4>
                    <p className="text-gray-600">{t.contact.locationDesc}</p>
                    <p className="text-sm text-gray-600 mt-1">{t.contact.borderAccess}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.contact.hours}</h4>
                    <p className="text-gray-600">{t.contact.mondayFriday}</p>
                    <p className="text-gray-600">{t.contact.saturday}</p>
                    <p className="text-sm text-gray-600 mt-1">{t.contact.emergencyAvailable}</p>
                  </div>
                </div>
              </div>
            </div>
          </ConditionalMotion>

          {/* Contact Form */}
          <ConditionalMotion
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t.contact.sendMessage}</CardTitle>
                <CardDescription>
                  {t.contact.formDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.contact.form.name} *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder={t.contact.form.placeholders.name}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">{t.contact.form.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder={t.contact.form.placeholders.email}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">{t.contact.form.phone} *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder={t.contact.form.placeholders.phone}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">{t.contact.form.message} *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder={t.contact.form.placeholders.message}
                      rows={5}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? t.contact.form.sending : t.contact.form.send}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ConditionalMotion>
        </div>
      </div>
    </section>
  );
}