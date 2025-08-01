import { 
  type ConsultationRequest,
  type NewConsultationRequest,
  type ContactSubmission,  
  type NewContactSubmission,
  type Testimonial,
  type Clinic,
  type ProviderApplication,
  type NewProviderApplication,
  type Treatment,
  consultationRequests,
  contactSubmissions,
  testimonials,
  clinics,
  providerApplications,
  treatments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createConsultationRequest(request: NewConsultationRequest): Promise<ConsultationRequest>;
  createContactSubmission(submission: NewContactSubmission): Promise<ContactSubmission>;
  getTestimonials(): Promise<Testimonial[]>;
  createProviderApplication(application: NewProviderApplication): Promise<ProviderApplication>;
  getClinics(): Promise<Clinic[]>;
  getTreatments(): Promise<Treatment[]>;
}

class Storage implements IStorage {
  async createConsultationRequest(request: NewConsultationRequest): Promise<ConsultationRequest> {
    const [result] = await db.insert(consultationRequests).values(request).returning();
    return result;
  }

  async createContactSubmission(submission: NewContactSubmission): Promise<ContactSubmission> {
    const [result] = await db.insert(contactSubmissions).values(submission).returning();
    return result;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isVisible, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async createProviderApplication(application: NewProviderApplication): Promise<ProviderApplication> {
    const [result] = await db.insert(providerApplications).values(application).returning();
    return result;
  }

  async getClinics(): Promise<Clinic[]> {
    return await db
      .select()
      .from(clinics)
      .where(eq(clinics.isActive, true))
      .orderBy(desc(clinics.createdAt));
  }

  async getTreatments(): Promise<Treatment[]> {
    return await db
      .select()
      .from(treatments)
      .where(eq(treatments.isActive, true))
      .orderBy(treatments.category, treatments.name);
  }
}

export const storage = new Storage();