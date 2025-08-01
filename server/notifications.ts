// Notification service for sending emails and SMS with SendGrid integration
import { MailService } from '@sendgrid/mail';

export interface NotificationData {
  name: string;
  email: string;
  phone: string;
  contactMethod: 'phone' | 'email' | 'text';
  serviceInterest: string;
}

export interface BulkEmailData {
  recipients: Array<{
    email: string;
    name: string;
    personalizedData?: Record<string, any>;
  }>;
  subject: string;
  template: string;
  sender?: {
    name: string;
    email: string;
  };
}

export interface EmailSendResult {
  email: string;
  name: string;
  success: boolean;
  error?: string;
  sentAt?: Date;
}

export async function sendWelcomeEmail(data: NotificationData): Promise<boolean> {
  try {
    // Email implementation would go here
    console.log('📧 Sending welcome email to:', data.email);
    console.log('Email Subject: Welcome to MxSmiles!');
    console.log(`Email Body: Hi ${data.name}, we received your information and a team member will contact you within 24 hours to discuss your dental needs and schedule a call.`);
    
    // Simulate email delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

// Initialize SendGrid
const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendBookingNotification(bookingData: any): Promise<boolean> {
  try {
    const adminEmail = 'bsudarshan@outlook.com';
    
    // Create email content
    const subject = `New ${bookingData.serviceType === 'consultation' ? 'Patient Consultation' : 'Provider Partnership'} Booking - MxSmiles`;
    
    const emailBody = `
New booking request received:

SERVICE TYPE: ${bookingData.serviceType === 'consultation' ? 'Free Patient Consultation' : 'Provider Partnership Meeting'}
NAME: ${bookingData.fullName}
EMAIL: ${bookingData.email}
PHONE: ${bookingData.phone}
${bookingData.preferredDate ? `PREFERRED DATE: ${bookingData.preferredDate}` : ''}
${bookingData.preferredTime ? `PREFERRED TIME: ${bookingData.preferredTime}` : ''}
${bookingData.contactMethod ? `PREFERRED CONTACT: ${bookingData.contactMethod}` : ''}
${bookingData.treatmentInterest ? `TREATMENT INTEREST: ${bookingData.treatmentInterest}` : ''}
${bookingData.message ? `MESSAGE: ${bookingData.message}` : ''}
${bookingData.photoUrl ? `UPLOADED PHOTO: ${bookingData.photoUrl}` : ''}

SUBMITTED: ${new Date().toLocaleString()}

---
MxSmiles Booking System
    `.trim();
    
    // Send actual email via SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const emailData = {
        to: adminEmail,
        from: 'bsudarshan@outlook.com', // Use your verified sender
        subject: subject,
        text: emailBody,
        html: emailBody.replace(/\n/g, '<br>')
      };
      
      await mailService.send(emailData);
      console.log('✅ Email sent successfully to:', adminEmail);
      return true;
    } else {
      // Fallback to console logging if no API key
      console.log('📧 SendGrid API key not found, logging email:');
      console.log('Email Subject:', subject);
      console.log('Email Body:', emailBody);
      return false;
    }
  } catch (error) {
    console.error('Failed to send booking notification:', error);
    // Log the email content even if sending fails
    console.log('📧 Fallback - Email content that failed to send:');
    console.log('Subject:', `New ${bookingData.serviceType === 'consultation' ? 'Patient Consultation' : 'Provider Partnership'} Booking - MxSmiles`);
    console.log('Details:', bookingData);
    return false;
  }
}

export async function sendWelcomeSMS(data: NotificationData): Promise<boolean> {
  try {
    // SMS implementation would go here
    console.log('📱 Sending welcome SMS to:', data.phone);
    console.log(`SMS Body: Hi ${data.name}, thanks for reaching out to MxSmiles! We'll call you within 24 hours to schedule your call.`);
    
    // Simulate SMS delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('Failed to send welcome SMS:', error);
    return false;
  }
}

// Enhanced bulk email sending function using loops
export async function sendBulkEmails(
  bulkData: BulkEmailData,
  options: {
    batchSize?: number;
    delayBetweenEmails?: number;
    delayBetweenBatches?: number;
    maxRetries?: number;
  } = {}
): Promise<{
  results: EmailSendResult[];
  summary: {
    total: number;
    sent: number;
    failed: number;
    successRate: number;
  };
}> {
  const {
    batchSize = 10,
    delayBetweenEmails = 100,
    delayBetweenBatches = 1000,
    maxRetries = 3
  } = options;

  const results: EmailSendResult[] = [];
  const recipients = bulkData.recipients;
  const totalRecipients = recipients.length;

  console.log(`📧 Starting bulk email sending to ${totalRecipients} recipients in batches of ${batchSize}`);

  // Process recipients in batches using loops
  for (let batchStart = 0; batchStart < totalRecipients; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize, totalRecipients);
    const batch = recipients.slice(batchStart, batchEnd);
    const batchNumber = Math.floor(batchStart / batchSize) + 1;
    const totalBatches = Math.ceil(totalRecipients / batchSize);

    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} emails)`);

    // Process each email in the current batch
    for (let i = 0; i < batch.length; i++) {
      const recipient = batch[i];
      let success = false;
      let error: string | undefined;
      let retryCount = 0;

      // Retry loop for failed emails
      while (!success && retryCount < maxRetries) {
        try {
          // Personalize email content
          const personalizedContent = personalizeEmailTemplate(
            bulkData.template,
            recipient.name,
            recipient.personalizedData || {}
          );

          // Send individual email
          await sendSingleEmail({
            to: recipient.email,
            name: recipient.name,
            subject: bulkData.subject,
            content: personalizedContent,
            sender: bulkData.sender
          });

          success = true;
          console.log(`✅ Email sent to ${recipient.name} (${recipient.email})`);
        } catch (err) {
          retryCount++;
          error = err instanceof Error ? err.message : 'Unknown error';
          
          if (retryCount < maxRetries) {
            console.log(`⚠️ Retry ${retryCount}/${maxRetries} for ${recipient.email}: ${error}`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenEmails * retryCount));
          } else {
            console.error(`❌ Failed to send email to ${recipient.name} (${recipient.email}) after ${maxRetries} attempts: ${error}`);
          }
        }
      }

      // Record result
      results.push({
        email: recipient.email,
        name: recipient.name,
        success,
        error: success ? undefined : error,
        sentAt: success ? new Date() : undefined
      });

      // Add delay between emails (except for the last email in batch)
      if (i < batch.length - 1 && delayBetweenEmails > 0) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
      }
    }

    // Add delay between batches (except for the last batch)
    if (batchEnd < totalRecipients && delayBetweenBatches > 0) {
      console.log(`⏱️ Waiting ${delayBetweenBatches}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  // Calculate summary statistics
  const sent = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const successRate = totalRecipients > 0 ? (sent / totalRecipients) * 100 : 0;

  const summary = {
    total: totalRecipients,
    sent,
    failed,
    successRate: Math.round(successRate * 100) / 100
  };

  console.log(`📊 Bulk email sending completed:`);
  console.log(`   Total: ${summary.total}`);
  console.log(`   Sent: ${summary.sent}`);
  console.log(`   Failed: ${summary.failed}`);
  console.log(`   Success Rate: ${summary.successRate}%`);

  return { results, summary };
}

// Helper function to send a single email
async function sendSingleEmail(emailData: {
  to: string;
  name: string;
  subject: string;
  content: string;
  sender?: { name: string; email: string };
}): Promise<boolean> {
  // Simulate email sending with realistic delay
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  
  // Simulate occasional failures (5% failure rate for testing)
  if (Math.random() < 0.05) {
    throw new Error('Email service temporarily unavailable');
  }

  // In a real implementation, you would use an email service here
  console.log(`📧 Email sent to: ${emailData.name} <${emailData.to}>`);
  console.log(`   Subject: ${emailData.subject}`);
  
  return true;
}

// Helper function to personalize email templates
function personalizeEmailTemplate(
  template: string,
  name: string,
  personalizedData: Record<string, any>
): string {
  let content = template;
  
  // Replace common placeholders
  content = content.replace(/\{\{name\}\}/g, name);
  content = content.replace(/\{\{firstName\}\}/g, name.split(' ')[0]);
  
  // Replace custom placeholders
  for (const [key, value] of Object.entries(personalizedData)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    content = content.replace(placeholder, String(value));
  }
  
  return content;
}

// Newsletter subscription loop function
export async function sendNewsletterToSubscribers(
  subscriberEmails: string[],
  newsletterData: {
    subject: string;
    content: string;
    sender?: { name: string; email: string };
  }
): Promise<EmailSendResult[]> {
  const results: EmailSendResult[] = [];
  
  console.log(`📰 Sending newsletter to ${subscriberEmails.length} subscribers`);
  
  // Use a simple loop for newsletter sending
  for (let i = 0; i < subscriberEmails.length; i++) {
    const email = subscriberEmails[i];
    
    try {
      await sendSingleEmail({
        to: email,
        name: email.split('@')[0], // Simple name extraction
        subject: newsletterData.subject,
        content: newsletterData.content,
        sender: newsletterData.sender
      });
      
      results.push({
        email,
        name: email.split('@')[0],
        success: true,
        sentAt: new Date()
      });
      
      // Add small delay between newsletter emails
      if (i < subscriberEmails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      results.push({
        email,
        name: email.split('@')[0],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

// Follow-up email sequence using loops
export async function sendEmailSequence(
  recipient: { email: string; name: string },
  sequence: Array<{
    subject: string;
    template: string;
    delayDays: number;
  }>
): Promise<EmailSendResult[]> {
  const results: EmailSendResult[] = [];
  
  console.log(`📬 Starting email sequence for ${recipient.name} (${sequence.length} emails)`);
  
  // Loop through email sequence
  for (let i = 0; i < sequence.length; i++) {
    const email = sequence[i];
    
    // For demo purposes, we'll simulate the delay with shorter intervals
    const delayMs = email.delayDays * 1000; // Convert days to milliseconds (simulated)
    
    if (i > 0) {
      console.log(`⏱️ Waiting ${email.delayDays} days before sending email ${i + 1}...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    try {
      const personalizedContent = personalizeEmailTemplate(
        email.template,
        recipient.name,
        {}
      );
      
      await sendSingleEmail({
        to: recipient.email,
        name: recipient.name,
        subject: email.subject,
        content: personalizedContent
      });
      
      results.push({
        email: recipient.email,
        name: recipient.name,
        success: true,
        sentAt: new Date()
      });
      
      console.log(`✅ Sequence email ${i + 1} sent to ${recipient.name}`);
    } catch (error) {
      results.push({
        email: recipient.email,
        name: recipient.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ Failed to send sequence email ${i + 1} to ${recipient.name}`);
      // Continue with the sequence even if one email fails
    }
  }
  
  return results;
}

export async function sendNotifications(data: NotificationData): Promise<{ emailSent: boolean; smsSent: boolean }> {
  const results = await Promise.allSettled([
    sendWelcomeEmail(data),
    data.contactMethod === 'text' || data.contactMethod === 'phone' ? sendWelcomeSMS(data) : Promise.resolve(false)
  ]);

  return {
    emailSent: results[0].status === 'fulfilled' ? results[0].value : false,
    smsSent: results[1].status === 'fulfilled' ? results[1].value : false,
  };
}