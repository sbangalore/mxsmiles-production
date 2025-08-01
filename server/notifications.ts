import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function sendBookingNotification(bookingData: any): Promise<boolean> {
  try {
    const adminEmail = 'bsudarshan@outlook.com';
    const sourceEmail = 'bsudarshan@outlook.com'; // Using admin email as sender since it's verified
    
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

    const htmlBody = emailBody.replace(/\n/g, '<br>');
    
    // Check if AWS credentials are available
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('📧 AWS credentials not found, logging email:');
      console.log('Email Subject:', subject);
      console.log('Email Body:', emailBody);
      return false;
    }
    
    // Send email via AWS SES
    const command = new SendEmailCommand({
      Source: sourceEmail,
      Destination: {
        ToAddresses: [adminEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: 'UTF-8',
          },
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    await sesClient.send(command);
    console.log('✅ Email sent successfully via AWS SES to:', adminEmail);
    return true;
    
  } catch (error) {
    console.error('Failed to send booking notification via SES:', error);
    // Log the email content even if sending fails
    console.log('📧 Fallback - Email content that failed to send:');
    console.log('Subject:', `New ${bookingData.serviceType === 'consultation' ? 'Patient Consultation' : 'Provider Partnership'} Booking - MxSmiles`);
    console.log('Details:', bookingData);
    return false;
  }
}