import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrate() {
  console.log("🔧 Running database migration...");
  
  const client = await pool.connect();
  
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultation_requests (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        contact_method TEXT NOT NULL DEFAULT 'phone',
        service_interest TEXT NOT NULL,
        date_of_birth TEXT,
        description TEXT,
        photo_url TEXT,
        preferred_date TEXT,
        preferred_time TEXT,
        notifications_sent BOOLEAN DEFAULT FALSE,
        appointment_date TIMESTAMP,
        time_slot TEXT,
        consultation_type TEXT DEFAULT 'video',
        time_zone TEXT DEFAULT 'America/New_York',
        treatment_interest TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        status TEXT DEFAULT 'pending'
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_name TEXT NOT NULL,
        location TEXT NOT NULL,
        treatment TEXT NOT NULL,
        rating TEXT NOT NULL,
        testimonial TEXT NOT NULL,
        original_language TEXT DEFAULT 'en',
        image_url TEXT,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT 'Mexico',
        website TEXT,
        description TEXT,
        specialties JSONB NOT NULL,
        languages JSONB NOT NULL,
        certifications JSONB NOT NULL,
        image_url TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_applications (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        clinic_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        website TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        specialties TEXT NOT NULL,
        years_in_business INTEGER NOT NULL,
        number_of_dentists INTEGER NOT NULL,
        certifications TEXT,
        languages TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS treatments (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        us_price DECIMAL(10,2) NOT NULL,
        mexico_price DECIMAL(10,2) NOT NULL,
        duration TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("✅ Database migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);