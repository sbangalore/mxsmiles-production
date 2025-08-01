import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertConsultationRequestSchema } from "@shared/schema";
import { z } from "zod";
import { TREATMENT_OPTIONS } from "@/lib/types";

const formSchema = insertConsultationRequestSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  message: z.string().optional(),
  preferredDate: z.string().optional(),
  currentLocation: z.string().optional(),
}).omit({ fullName: true });

type FormData = z.infer<typeof formSchema>;

export default function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      treatment: "",
      preferredDate: "",
      currentLocation: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Combine firstName and lastName into fullName for backend compatibility
      const submitData = {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
      };
      // Remove firstName and lastName from the submit data
      delete (submitData as any).firstName;
      delete (submitData as any).lastName;
      
      return apiRequest("POST", "/api/consultation", submitData);
    },
    onSuccess: () => {
      toast({
        title: "Consultation Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
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
    <Card className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white">Get Your Free Consultation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium mb-2 text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white focus:outline-none text-white placeholder-blue-200"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-300">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium mb-2 text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white focus:outline-none text-white placeholder-blue-200"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-300">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white focus:outline-none text-white placeholder-blue-200"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone" className="block text-sm font-medium mb-2 text-white">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white focus:outline-none text-white placeholder-blue-200"
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-300">{errors.phone.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="treatment" className="block text-sm font-medium mb-2 text-white">
              Treatment Needed
            </Label>
            <Select onValueChange={(value) => setValue("treatment", value)}>
              <SelectTrigger className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white text-white">
                <SelectValue placeholder="Select a treatment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select a treatment</SelectItem>
                {TREATMENT_OPTIONS.map((treatment) => (
                  <SelectItem key={treatment.id} value={treatment.id}>
                    {treatment.name}
                  </SelectItem>
                ))}
                <SelectItem value="consultation">General Consultation</SelectItem>
              </SelectContent>
            </Select>
            {errors.treatment && (
              <p className="mt-1 text-sm text-red-300">{errors.treatment.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="currentLocation" className="block text-sm font-medium mb-2 text-white">
              Current Location (Optional)
            </Label>
            <Input
              id="currentLocation"
              {...register("currentLocation")}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white focus:outline-none text-white placeholder-blue-200"
              placeholder="City, State"
            />
          </div>

          <div>
            <Label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-white focus:outline-none text-white placeholder-blue-200"
              placeholder="Tell us about your dental needs..."
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[var(--mexican-orange)] text-white py-4 rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-lg"
          >
            {isSubmitting ? "Submitting..." : "Get Free Consultation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
