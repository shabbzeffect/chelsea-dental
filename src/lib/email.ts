import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { confirmationTemplate } from './email-templates/confirmation';
import { reminderTemplate } from './email-templates/reminder';
import { cancellationTemplate } from './email-templates/cancellation';
import { rescheduledTemplate } from './email-templates/rescheduled';
import { noShowTemplate } from './email-templates/no-show';

// Initialize SendGrid if API key is provided
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create SMTP transporter as fallback
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  dentistName?: string;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

export interface RescheduledEmailData {
  patientName: string;
  patientEmail: string;
  oldDate: string;
  oldStartTime: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  dentistName?: string;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Use SendGrid if API key is configured
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        from: process.env.FROM_EMAIL || 'noreply@chelseadental.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log(`Email sent via SendGrid to ${options.to}`);
      return true;
    }

    // Fallback to SMTP
    await smtpTransporter.sendMail({
      from: `"Chelsea Dental Clinic" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`Email sent via SMTP to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean> {
  const template = confirmationTemplate(data);
  return sendEmail({
    to: data.patientEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentReminder(data: AppointmentEmailData): Promise<boolean> {
  const template = reminderTemplate(data);
  return sendEmail({
    to: data.patientEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentCancellation(data: AppointmentEmailData): Promise<boolean> {
  const template = cancellationTemplate(data);
  return sendEmail({
    to: data.patientEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentRescheduled(data: RescheduledEmailData): Promise<boolean> {
  const template = rescheduledTemplate(data);
  return sendEmail({
    to: data.patientEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentNoShow(data: AppointmentEmailData): Promise<boolean> {
  const template = noShowTemplate(data);
  return sendEmail({
    to: data.patientEmail,
    subject: template.subject,
    html: template.html,
  });
}
