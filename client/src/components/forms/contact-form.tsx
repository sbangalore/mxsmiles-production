import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { useLanguage } from "@/contexts/language-context";

type FormData = z.infer<typeof insertContactSubmissionSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed to Send",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{t.contact.form.send}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="w-full"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className="w-full"
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </Label>
              <Input
                id="subject"
                {...register("subject")}
                className="w-full"
                placeholder="How can we help?"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              className="w-full"
              placeholder="Please tell us about your dental needs or any questions you have..."
              rows={5}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white hover:bg-primary/90 py-3 text-lg"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
