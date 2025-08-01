var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      define: {
        // Make React available globally to fix use-sync-external-store-shim
        global: "globalThis"
      },
      plugins: [
        react({
          // Ensure React is properly imported for production builds
          jsxImportSource: "react",
          jsxRuntime: "automatic",
          babel: {
            // Skip Babel transforms for modern browsers
            parserOpts: {
              sourceType: "module",
              allowAwaitOutsideFunction: true
            },
            generatorOpts: {
              decoratorsBeforeExport: true
            }
          }
        }),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path2.resolve(import.meta.dirname, "client", "src"),
          "@shared": path2.resolve(import.meta.dirname, "shared"),
          "@assets": path2.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path2.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path2.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true,
        sourcemap: true,
        // Target modern browsers that support ES2022
        target: "es2022",
        // Optimize chunk size
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              if (id.includes("node_modules")) {
                if (id.includes("react-dom")) return "react-dom";
                if (id.includes("react") && !id.includes("react-dom")) return "react-core";
                if (id.includes("@radix-ui")) return "radix-ui";
                if (id.includes("framer-motion")) return "framer-motion";
                if (id.includes("react-hook-form")) return "react-hook-form";
                if (id.includes("zod")) return "zod";
                if (id.includes("react-icons")) return "react-icons";
                if (id.includes("@tanstack")) return "tanstack";
                if (id.includes("wouter")) return "router";
                if (id.includes("date-fns")) return "date-fns";
                if (id.includes("recharts")) return "recharts";
                if (id.includes("lucide-react")) return "lucide-icons";
                return "vendor";
              }
            },
            // Optimize chunk size
            maxParallelFileOps: 5,
            experimentalMinChunkSize: 1e4
          }
        },
        // Minify for modern syntax
        minify: "terser",
        terserOptions: {
          ecma: 2022,
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log", "console.info"],
            passes: 2
          },
          format: {
            comments: false
          }
        }
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      },
      // Skip polyfills for modern browsers
      optimizeDeps: {
        esbuildOptions: {
          target: "es2022"
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/static.ts
var static_exports = {};
__export(static_exports, {
  serveStatic: () => serveStatic2
});
import express2 from "express";
import fs2 from "fs";
import path4 from "path";
function serveStatic2(app2) {
  const distPath = path4.resolve(process.cwd(), "dist", "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.get("/", (_req, res) => {
    const standalonePath = path4.resolve(distPath, "standalone.html");
    if (fs2.existsSync(standalonePath)) {
      res.sendFile(standalonePath);
    } else {
      res.sendFile(path4.resolve(distPath, "index.html"));
    }
  });
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}
var init_static = __esm({
  "server/static.ts"() {
    "use strict";
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";
import path from "path";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  clinics: () => clinics,
  consultationRequests: () => consultationRequests,
  contactSubmissions: () => contactSubmissions,
  insertConsultationRequestSchema: () => insertConsultationRequestSchema,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertProviderApplicationSchema: () => insertProviderApplicationSchema,
  providerApplications: () => providerApplications,
  testimonials: () => testimonials,
  treatments: () => treatments
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var consultationRequests = pgTable("consultation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  contactMethod: text("contact_method").notNull().default("phone"),
  // phone, email, text
  serviceInterest: text("service_interest").notNull(),
  dateOfBirth: text("date_of_birth"),
  description: text("description"),
  photoUrl: text("photo_url"),
  // S3 URL for uploaded photos
  preferredDate: text("preferred_date"),
  // Preferred consultation date
  preferredTime: text("preferred_time"),
  // Preferred consultation time
  notificationsSent: boolean("notifications_sent").default(false),
  // Booking system fields
  appointmentDate: timestamp("appointment_date"),
  timeSlot: text("time_slot"),
  consultationType: text("consultation_type").default("video"),
  // 'video', 'phone'
  timeZone: text("time_zone").default("America/New_York"),
  treatmentInterest: text("treatment_interest"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("pending")
  // pending, contacted, scheduled, completed
});
var contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  location: text("location").notNull(),
  treatment: text("treatment").notNull(),
  rating: text("rating").notNull(),
  testimonial: text("testimonial").notNull(),
  originalLanguage: text("original_language").default("en"),
  // en, es, etc.
  imageUrl: text("image_url"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var clinics = pgTable("clinics", {
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
  specialties: jsonb("specialties").$type().notNull(),
  languages: jsonb("languages").$type().notNull(),
  certifications: jsonb("certifications").$type().notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(false),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var providerApplications = pgTable("provider_applications", {
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
  status: text("status").default("pending"),
  // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow()
});
var treatments = pgTable("treatments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  usPrice: decimal("us_price", { precision: 10, scale: 2 }).notNull(),
  mexicoPrice: decimal("mexico_price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration"),
  // e.g., "1-2 hours", "2-3 visits"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var insertConsultationRequestSchema = createInsertSchema(consultationRequests, {
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  fullName: z.string().min(2, "Please provide your full name"),
  serviceInterest: z.string().min(1, "Please select a service"),
  contactMethod: z.enum(["phone", "email", "text"])
}).omit({
  id: true,
  createdAt: true,
  notificationsSent: true,
  status: true
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions, {
  email: z.string().email("Please provide a valid email address"),
  name: z.string().min(2, "Please provide your name"),
  subject: z.string().min(1, "Please provide a subject"),
  message: z.string().min(10, "Please provide a detailed message")
}).omit({
  id: true,
  createdAt: true
});
var insertProviderApplicationSchema = createInsertSchema(providerApplications, {
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
  description: z.string().min(20, "Please provide a detailed description")
}).omit({
  id: true,
  createdAt: true,
  status: true
});

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var Storage = class {
  async createConsultationRequest(request) {
    const [result] = await db.insert(consultationRequests).values(request).returning();
    return result;
  }
  async createContactSubmission(submission) {
    const [result] = await db.insert(contactSubmissions).values(submission).returning();
    return result;
  }
  async getTestimonials() {
    return await db.select().from(testimonials).where(eq(testimonials.isVisible, true)).orderBy(desc(testimonials.createdAt));
  }
  async createProviderApplication(application) {
    const [result] = await db.insert(providerApplications).values(application).returning();
    return result;
  }
  async getClinics() {
    return await db.select().from(clinics).where(eq(clinics.isActive, true)).orderBy(desc(clinics.createdAt));
  }
  async getTreatments() {
    return await db.select().from(treatments).where(eq(treatments.isActive, true)).orderBy(treatments.category, treatments.name);
  }
};
var storage = new Storage();

// server/upload.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
var s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});
async function uploadToS3(file, key) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set");
  }
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not configured");
  }
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "private"
    // Keep files private for security
  });
  try {
    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_S3_REGION || "us-east-1"}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}
var singleUpload = upload.single("photo");
var handlePhotoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }
    const timestamp2 = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = req.file.originalname.split(".").pop() || "jpg";
    const key = `consultation-photos/${timestamp2}-${randomId}.${fileExtension}`;
    const photoUrl = await uploadToS3(req.file, key);
    req.body.photoUrl = photoUrl;
    next();
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload photo"
    });
  }
};

// server/s3Upload.ts
import { S3Client as S3Client2, PutObjectCommand as PutObjectCommand2 } from "@aws-sdk/client-s3";
import { getSignedUrl as getSignedUrl2 } from "@aws-sdk/s3-request-presigner";
import multer2 from "multer";
var s3Client2 = new S3Client2({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
var BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
var storage2 = multer2.memoryStorage();
var upload2 = multer2({
  storage: storage2,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function generatePresignedUrl(fileName, fileType, folder = "uploads") {
  const key = `${folder}/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand2({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ACL: "public-read"
  });
  try {
    const uploadUrl = await getSignedUrl2(s3Client2, command, { expiresIn: 3600 });
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    return { uploadUrl, fileUrl };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
}

// server/notifications.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
var sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});
async function sendBookingNotification(bookingData) {
  try {
    const adminEmail = "bsudarshan@outlook.com";
    const sourceEmail = "bsudarshan@outlook.com";
    const subject = `New ${bookingData.serviceType === "consultation" ? "Patient Consultation" : "Provider Partnership"} Booking - MxSmiles`;
    const emailBody = `
New booking request received:

SERVICE TYPE: ${bookingData.serviceType === "consultation" ? "Free Patient Consultation" : "Provider Partnership Meeting"}
NAME: ${bookingData.fullName}
EMAIL: ${bookingData.email}
PHONE: ${bookingData.phone}
${bookingData.preferredDate ? `PREFERRED DATE: ${bookingData.preferredDate}` : ""}
${bookingData.preferredTime ? `PREFERRED TIME: ${bookingData.preferredTime}` : ""}
${bookingData.contactMethod ? `PREFERRED CONTACT: ${bookingData.contactMethod}` : ""}
${bookingData.treatmentInterest ? `TREATMENT INTEREST: ${bookingData.treatmentInterest}` : ""}
${bookingData.message ? `MESSAGE: ${bookingData.message}` : ""}
${bookingData.photoUrl ? `UPLOADED PHOTO: ${bookingData.photoUrl}` : ""}

SUBMITTED: ${(/* @__PURE__ */ new Date()).toLocaleString()}

---
MxSmiles Booking System
    `.trim();
    const htmlBody = emailBody.replace(/\n/g, "<br>");
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log("\u{1F4E7} AWS credentials not found, logging email:");
      console.log("Email Subject:", subject);
      console.log("Email Body:", emailBody);
      return false;
    }
    const command = new SendEmailCommand({
      Source: sourceEmail,
      Destination: {
        ToAddresses: [adminEmail]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8"
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: "UTF-8"
          },
          Html: {
            Data: htmlBody,
            Charset: "UTF-8"
          }
        }
      }
    });
    await sesClient.send(command);
    console.log("\u2705 Email sent successfully via AWS SES to:", adminEmail);
    return true;
  } catch (error) {
    console.error("Failed to send booking notification via SES:", error);
    console.log("\u{1F4E7} Fallback - Email content that failed to send:");
    console.log("Subject:", `New ${bookingData.serviceType === "consultation" ? "Patient Consultation" : "Provider Partnership"} Booking - MxSmiles`);
    console.log("Details:", bookingData);
    return false;
  }
}

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.sendFile(path.resolve(process.cwd(), "public", "robots.txt"));
  });
  app2.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    res.sendFile(path.resolve(process.cwd(), "public", "sitemap.xml"));
  });
  app2.get("/sw.js", (req, res) => {
    res.type("application/javascript");
    res.sendFile(path.resolve(process.cwd(), "public", "sw.js"));
  });
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "mxsmiles-production",
      version: "1.0.0",
      platform: "Amazon Linux 2023",
      nodejs: process.version
    });
  });
  app2.post("/api/consultation", singleUpload, handlePhotoUpload, async (req, res) => {
    try {
      if (req.body.firstName && req.body.lastName) {
        req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
        delete req.body.firstName;
        delete req.body.lastName;
      }
      const validatedData = insertConsultationRequestSchema.parse(req.body);
      const consultationRequest = await storage.createConsultationRequest(validatedData);
      await sendBookingNotification({
        serviceType: "consultation",
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
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Consultation submission error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit consultation request"
        });
      }
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const contactSubmission = await storage.createContactSubmission(validatedData);
      await sendBookingNotification({
        serviceType: "contact",
        fullName: contactSubmission.name,
        email: contactSubmission.email,
        phone: contactSubmission.phone || "",
        treatmentInterest: contactSubmission.subject,
        message: contactSubmission.message,
        contactMethod: "email"
      });
      res.json({ success: true, data: contactSubmission, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit contact form"
        });
      }
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json({ success: true, data: testimonials2 });
    } catch (error) {
      console.error("Testimonials error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch testimonials"
      });
    }
  });
  app2.post("/api/provider-application", async (req, res) => {
    try {
      const validatedData = insertProviderApplicationSchema.parse(req.body);
      const application = await storage.createProviderApplication(validatedData);
      await sendBookingNotification({
        serviceType: "provider",
        fullName: validatedData.contactName,
        email: validatedData.email,
        phone: validatedData.phone || "",
        treatmentInterest: "Provider Partnership",
        message: `Clinic: ${validatedData.clinicName}, Specialties: ${validatedData.specialties}, Years in business: ${validatedData.yearsInBusiness}`,
        contactMethod: "email"
      });
      res.json({ success: true, data: application, message: "Provider application submitted successfully" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Provider application error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit provider application"
        });
      }
    }
  });
  app2.get("/api/clinics", async (req, res) => {
    try {
      const clinics2 = await storage.getClinics();
      res.json({ success: true, data: clinics2 });
    } catch (error) {
      console.error("Clinics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch clinics"
      });
    }
  });
  app2.get("/api/treatments", async (req, res) => {
    try {
      const treatments2 = await storage.getTreatments();
      res.json({ success: true, data: treatments2 });
    } catch (error) {
      console.error("Treatments error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch treatments"
      });
    }
  });
  app2.post("/api/upload/presigned-url", async (req, res) => {
    try {
      const { fileName, fileType, folder = "consultation-photos" } = req.body;
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/compression.ts
import compression from "compression";
var compressionMiddleware = compression({
  // Enable compression for text-based responses only
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    const contentLength = res.get("Content-Length");
    if (contentLength && parseInt(contentLength) < 1024) {
      return false;
    }
    const contentType = res.get("Content-Type");
    if (contentType) {
      return /^text\/|^application\/(json|javascript|xml)/.test(contentType);
    }
    return compression.filter(req, res);
  },
  // Conservative compression level for stability
  level: 4,
  // Only compress responses larger than 1KB
  threshold: 1024
  // Use minimal configuration to avoid zlib parameter issues
});

// server/index.ts
var app = express3();
app.use(compressionMiddleware);
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Server error:", err);
    if (app.get("env") === "production") {
      res.status(status).json({ message });
    } else {
      res.status(status).json({ message });
      throw err;
    }
  });
  if (app.get("env") === "development") {
    const { setupVite: setupVite2 } = await init_vite().then(() => vite_exports);
    await setupVite2(app, server);
  } else {
    const { serveStatic: serveStatic3 } = await Promise.resolve().then(() => (init_static(), static_exports));
    serveStatic3(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    console.log(`serving on port ${port}`);
  });
})();
