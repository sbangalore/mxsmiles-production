import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core tables for MxSmiles production app (no CRM functionality)

export const consultationRequests = pgTable("consultation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  contactMethod: text("contact_method").notNull().default("phone"), // phone, email, text
  serviceInterest: text("service_interest").notNull(),
  dateOfBirth: text("date_of_birth"),
  description: text("description"),
  photoUrl: text("photo_url"), // S3 URL for uploaded photos
  preferredDate: text("preferred_date"), // Preferred consultation date
  preferredTime: text("preferred_time"), // Preferred consultation time
  notificationsSent: boolean("notifications_sent").default(false),
  // Booking system fields
  appointmentDate: timestamp("appointment_date"),
  timeSlot: text("time_slot"),
  consultationType: text("consultation_type").default("video"), // 'video', 'phone'
  timeZone: text("time_zone").default("America/New_York"),
  treatmentInterest: text("treatment_interest"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("pending"), // pending, contacted, scheduled, completed
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  location: text("location").notNull(),
  treatment: text("treatment").notNull(),
  rating: text("rating").notNull(),
  testimonial: text("testimonial").notNull(),
  originalLanguage: text("original_language").default("en"), // en, es, etc.
  imageUrl: text("image_url"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clinics = pgTable("clinics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull().default("Mexico"),
  website: text("website"),
  description: text("description"),
  specialties: jsonb("specialties").$type<string[]>().notNull(),
  languages: jsonb("languages").$type<string[]>().notNull(),
  certifications: jsonb("certifications").$type<string[]>().notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(false),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const providerApplications = pgTable("provider_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicName: text("clinic_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  specialties: text("specialties").notNull(),
  yearsInBusiness: integer("years_in_business").notNull(),
  numberOfDentists: integer("number_of_dentists").notNull(),
  certifications: text("certifications"),
  languages: text("languages").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const treatments = pgTable("treatments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  usPrice: decimal("us_price", { precision: 10, scale: 2 }).notNull(),
  mexicoPrice: decimal("mexico_price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration"), // e.g., "1-2 hours", "2-3 visits"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for form validation
export const insertConsultationRequestSchema = createInsertSchema(consultationRequests, {
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  fullName: z.string().min(2, "Please provide your full name"),
  serviceInterest: z.string().min(1, "Please select a service"),
  contactMethod: z.enum(["phone", "email", "text"]),
}).omit({
  id: true,
  createdAt: true,
  notificationsSent: true,
  status: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions, {
  email: z.string().email("Please provide a valid email address"),
  name: z.string().min(2, "Please provide your name"),
  subject: z.string().min(1, "Please provide a subject"),
  message: z.string().min(10, "Please provide a detailed message"),
}).omit({
  id: true,
  createdAt: true,
});

export const insertProviderApplicationSchema = createInsertSchema(providerApplications, {
  email: z.string().email("Please provide a valid email address"),
  clinicName: z.string().min(2, "Please provide clinic name"),
  contactName: z.string().min(2, "Please provide contact name"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  address: z.string().min(5, "Please provide full address"),
  city: z.string().min(2, "Please provide city"),
  state: z.string().min(2, "Please provide state"),
  zipCode: z.string().min(5, "Please provide zip code"),
  specialties: z.string().min(1, "Please list specialties"),
  yearsInBusiness: z.number().min(1, "Years in business must be at least 1"),
  numberOfDentists: z.number().min(1, "Number of dentists must be at least 1"),
  languages: z.string().min(1, "Please list languages spoken"),
  description: z.string().min(20, "Please provide a detailed description"),
}).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Type exports for TypeScript
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type NewConsultationRequest = typeof consultationRequests.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type Clinic = typeof clinics.$inferSelect;
export type NewClinic = typeof clinics.$inferInsert;
export type ProviderApplication = typeof providerApplications.$inferSelect;
export type NewProviderApplication = typeof providerApplications.$inferInsert;
export type Treatment = typeof treatments.$inferSelect;
export type NewTreatment = typeof treatments.$inferInsert;