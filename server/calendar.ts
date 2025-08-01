// Calendar and Zoom integration utilities
import { randomUUID } from 'crypto';

export interface ZoomMeeting {
  id: string;
  join_url: string;
  host_id: string;
  topic: string;
  start_time: string;
  duration: number;
  password?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
}

/**
 * Generate a Zoom meeting link for a consultation
 * In a real implementation, this would use Zoom's API
 */
export function generateZoomMeeting(
  patientName: string,
  preferredDate: string,
  preferredTime: string
): ZoomMeeting {
  const meetingId = Math.random().toString().substring(2, 12);
  const password = Math.random().toString(36).substring(2, 8);
  
  return {
    id: meetingId,
    join_url: `https://zoom.us/j/${meetingId}?pwd=${password}`,
    host_id: "mxsmiles_host",
    topic: `Dental Consultation - ${patientName}`,
    start_time: `${preferredDate}T${preferredTime}:00-07:00`, // PST timezone
    duration: 30, // 30 minutes
    password: password
  };
}

/**
 * Generate calendar event data
 */
export function generateCalendarEvent(
  patientName: string,
  patientEmail: string,
  preferredDate: string,
  preferredTime: string,
  zoomUrl: string
): CalendarEvent {
  const startDateTime = new Date(`${preferredDate}T${preferredTime}:00-07:00`);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // 30 minutes later
  
  return {
    id: randomUUID(),
    summary: `MxSmiles Dental Consultation - ${patientName}`,
    description: `Free dental consultation with MxSmiles.\n\nJoin Zoom Meeting: ${zoomUrl}\n\nWe look forward to discussing your dental needs and treatment options.`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "America/Los_Angeles"
    },
    end: {
      dateTime: endDateTime.toISOString(), 
      timeZone: "America/Los_Angeles"
    },
    location: zoomUrl,
    attendees: [
      {
        email: patientEmail,
        displayName: patientName
      },
      {
        email: "consultations@mxsmiles.com",
        displayName: "MxSmiles Consultation Team"
      }
    ]
  };
}

/**
 * Generate iCal format for calendar invite
 */
export function generateICalInvite(calendarEvent: CalendarEvent): string {
  const formatDate = (date: string) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startTime = formatDate(calendarEvent.start.dateTime);
  const endTime = formatDate(calendarEvent.end.dateTime);
  const now = formatDate(new Date().toISOString());

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MxSmiles//Dental Consultation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${calendarEvent.id}@mxsmiles.com`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${calendarEvent.summary}`,
    `DESCRIPTION:${calendarEvent.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${calendarEvent.location}`,
    `ORGANIZER;CN=MxSmiles:mailto:consultations@mxsmiles.com`,
    `ATTENDEE;CN=${calendarEvent.attendees[0].displayName};RSVP=TRUE:mailto:${calendarEvent.attendees[0].email}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Dental consultation in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Send calendar invite email with Zoom link
 * In a real implementation, this would use a proper email service
 */
export async function sendCalendarInvite(
  patientEmail: string,
  patientName: string,
  calendarEvent: CalendarEvent,
  zoomMeeting: ZoomMeeting
): Promise<boolean> {
  try {
    // For demo purposes, we'll just log the invite details
    console.log('Sending calendar invite to:', patientEmail);
    console.log('Meeting details:', {
      summary: calendarEvent.summary,
      startTime: calendarEvent.start.dateTime,
      zoomUrl: zoomMeeting.join_url,
      password: zoomMeeting.password
    });
    
    // In a real implementation, you would:
    // 1. Use an email service like SendGrid, Nodemailer, or AWS SES
    // 2. Send an email with the iCal attachment
    // 3. Include meeting details in the email body
    
    return true;
  } catch (error) {
    console.error('Failed to send calendar invite:', error);
    return false;
  }
}