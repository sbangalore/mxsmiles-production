import { db } from "./db";
import { treatments, testimonials, clinics } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Insert sample treatments
  const treatmentData = [
    {
      name: "Dental Cleaning",
      category: "Preventive",
      usPrice: "150.00",
      mexicoPrice: "50.00",
      duration: "1 hour"
    },
    {
      name: "Teeth Whitening",
      category: "Cosmetic",
      usPrice: "500.00",
      mexicoPrice: "150.00",
      duration: "1-2 hours"
    },
    {
      name: "Dental Crown",
      category: "Restorative",
      usPrice: "1200.00",
      mexicoPrice: "350.00",
      duration: "2-3 visits"
    },
    {
      name: "Dental Implant",
      category: "Restorative",
      usPrice: "3500.00",
      mexicoPrice: "1200.00",
      duration: "3-6 months"
    },
    {
      name: "Root Canal",
      category: "Restorative",
      usPrice: "1000.00",
      mexicoPrice: "300.00",
      duration: "1-2 visits"
    }
  ];

  console.log("Adding treatments...");
  await db.insert(treatments).values(treatmentData);

  // Insert sample testimonials
  const testimonialData = [
    {
      patientName: "Sarah Johnson",
      location: "Los Angeles, CA",
      treatment: "Dental Implants",
      rating: "5",
      testimonial: "I saved over $8,000 on my dental implants in Mexico. The quality was exceptional and the dentist spoke perfect English. Highly recommend!",
      originalLanguage: "en",
      isVisible: true
    },
    {
      patientName: "Mike Rodriguez",
      location: "Phoenix, AZ",
      treatment: "Full Mouth Restoration",
      rating: "5",
      testimonial: "The entire process was smooth from start to finish. The clinic was modern and clean, and I received world-class care at a fraction of US prices.",
      originalLanguage: "en",
      isVisible: true
    },
    {
      patientName: "Lisa Chen",
      location: "San Diego, CA",
      treatment: "Cosmetic Dentistry",
      rating: "5",
      testimonial: "MxSmiles made my dream smile affordable. The dentist was amazing and the results exceeded my expectations!",
      originalLanguage: "en",
      isVisible: true
    }
  ];

  console.log("Adding testimonials...");
  await db.insert(testimonials).values(testimonialData);

  // Insert sample clinics
  const clinicData = [
    {
      name: "Los Algodones Dental Center",
      email: "info@ladentist.com",
      phone: "+52-658-517-1234",
      address: "Calle Primera #123",
      city: "Los Algodones",
      state: "Baja California",
      zipCode: "21970",
      country: "Mexico",
      website: "https://ladentist.com",
      description: "Modern dental clinic specializing in implants and cosmetic dentistry with English-speaking staff.",
      specialties: ["Dental Implants", "Cosmetic Dentistry", "Oral Surgery"],
      languages: ["English", "Spanish"],
      certifications: ["ADA Certified", "ISO 9001"],
      isActive: true,
      isVerified: true
    }
  ];

  console.log("Adding clinics...");
  await db.insert(clinics).values(clinicData);

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error);