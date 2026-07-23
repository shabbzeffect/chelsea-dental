export { confirmationTemplate } from './confirmation';
export { reminderTemplate } from './reminder';
export { cancellationTemplate } from './cancellation';
export { rescheduledTemplate } from './rescheduled';
export { noShowTemplate } from './no-show';

export interface EmailTemplateData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  dentistName?: string;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

export interface RescheduledEmailData extends EmailTemplateData {
  oldDate: string;
  oldStartTime: string;
}
