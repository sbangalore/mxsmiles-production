import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { insertConsultationRequestSchema, insertContactSubmissionSchema, insertProviderApplicationSchema } from "@shared/schema";
import { singleUpload, handlePhotoUpload } from "./upload";
import { generatePresignedUrl } from "./s3Upload";
import { sendBookingNotification } from "./notifications";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static SEO files before other routes
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.resolve(process.cwd(), 'public', 'robots.txt'));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.resolve(process.cwd(), 'public', 'sitemap.xml'));
  });

  app.get('/sw.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.resolve(process.cwd(), 'public', 'sw.js'));
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'mxsmiles-production',
      version: '1.0.0',
      platform: 'Amazon Linux 2023',
      nodejs: process.version
    });
  });
  
  // Consultation request endpoint with photo upload
  app.post("/api/consultation", singleUpload, handlePhotoUpload, async (req, res) => {
    try {
      // Handle legacy firstName/lastName format
      if (req.body.firstName && req.body.lastName) {
        req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
        delete req.body.firstName;
        delete req.body.lastName;
      }
      
      const validatedData = insertConsultationRequestSchema.parse(req.body);
      const consultationRequest = await storage.createConsultationRequest(validatedData);
      
      // Send booking notification to admin
      await sendBookingNotification({
        serviceType: 'consultation',
        fullName: consultationRequest.fullName,
        email: consultationRequest.email,
        phone: consultationRequest.phone,
        preferredDate: consultationRequest.preferredDate,
        preferredTime: consultationRequest.preferredTime,
        contactMethod: consultationRequest.contactMethod,
        treatmentInterest: consultationRequest.serviceInterest,
        message: consultationRequest.description,
        photoUrl: consultationRequest.photoUrl
      });

      res.json({ 
        success: true, 
        data: consultationRequest,
        message: "Consultation request submitted successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error('Consultation submission error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit consultation request" 
        });
      }
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const contactSubmission = await storage.createContactSubmission(validatedData);
      
      // Send notification to admin
      await sendBookingNotification({
        serviceType: 'contact',
        fullName: contactSubmission.name,
        email: contactSubmission.email,
        phone: contactSubmission.phone || '',
        treatmentInterest: contactSubmission.subject,
        message: contactSubmission.message,
        contactMethod: 'email'
      });
      
      res.json({ success: true, data: contactSubmission, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error('Contact form error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Get testimonials endpoint
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json({ success: true, data: testimonials });
    } catch (error) {
      console.error('Testimonials error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch testimonials" 
      });
    }
  });

  // Provider application endpoint
  app.post("/api/provider-application", async (req, res) => {
    try {
      const validatedData = insertProviderApplicationSchema.parse(req.body);
      const application = await storage.createProviderApplication(validatedData);

      // Send booking notification to admin
      await sendBookingNotification({
        serviceType: 'provider',
        fullName: validatedData.contactName,
        email: validatedData.email,
        phone: validatedData.phone || '',
        treatmentInterest: 'Provider Partnership',
        message: `Clinic: ${validatedData.clinicName}, Specialties: ${validatedData.specialties}, Years in business: ${validatedData.yearsInBusiness}`,
        contactMethod: 'email'
      });
      
      res.json({ success: true, data: application, message: "Provider application submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error('Provider application error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit provider application" 
        });
      }
    }
  });

  // Get clinics endpoint
  app.get("/api/clinics", async (req, res) => {
    try {
      const clinics = await storage.getClinics();
      res.json({ success: true, data: clinics });
    } catch (error) {
      console.error('Clinics error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch clinics" 
      });
    }
  });

  // Get treatments for pricing calculator
  app.get("/api/treatments", async (req, res) => {
    try {
      const treatments = await storage.getTreatments();
      res.json({ success: true, data: treatments });
    } catch (error) {
      console.error('Treatments error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch treatments" 
      });
    }
  });

  // Generate presigned URL for file upload
  app.post("/api/upload/presigned-url", async (req, res) => {
    try {
      const { fileName, fileType, folder = 'consultation-photos' } = req.body;
      
      if (!fileName || !fileType) {
        return res.status(400).json({ 
          success: false, 
          error: "fileName and fileType are required" 
        });
      }

      const { uploadUrl, fileUrl } = await generatePresignedUrl(fileName, fileType, folder);
      
      res.json({
        success: true,
        data: { uploadUrl, fileUrl }
      });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate upload URL" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}