CREATE TABLE "appointment_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid NOT NULL,
	"reminder_type" varchar(20) NOT NULL,
	"scheduled_time" timestamp NOT NULL,
	"sent_at" timestamp,
	"status" varchar(20) DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "appointment_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"description" text,
	"color" varchar(7)
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"dentist_id" uuid,
	"appointment_type_id" uuid,
	"appointment_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"reason" text,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinic_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinical_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"treatment_id" uuid NOT NULL,
	"note_content" text NOT NULL,
	"dentist_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dentist_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dentist_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_available" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "emergency_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"relationship" varchar(100),
	"phone" varchar(20) NOT NULL,
	"email" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "insurance_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"invoice_id" uuid,
	"claim_number" varchar(50) NOT NULL,
	"claim_date" date NOT NULL,
	"claim_amount" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'submitted' NOT NULL,
	"response_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insurance_claims_claim_number_unique" UNIQUE("claim_number")
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"treatment_id" uuid,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"invoice_date" date NOT NULL,
	"due_date" date,
	"total_amount" numeric(10, 2) NOT NULL,
	"paid_amount" numeric(10, 2) DEFAULT '0',
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"subject" varchar(255),
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"notification_type" varchar(50) NOT NULL,
	"title" varchar(255),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"link" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"note_content" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"patient_number" varchar(20) NOT NULL,
	"date_of_birth" date,
	"gender" varchar(10),
	"address" text,
	"city" varchar(100),
	"state" varchar(50),
	"zip" varchar(10),
	"insurance_provider" varchar(255),
	"insurance_id" varchar(100),
	"allergies" text,
	"medical_conditions" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_patient_number_unique" UNIQUE("patient_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid,
	"patient_id" uuid NOT NULL,
	"payment_date" date NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reference_number" varchar(100),
	"status" varchar(20) DEFAULT 'completed' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_type" varchar(50) NOT NULL,
	"recipients" jsonb NOT NULL,
	"frequency" varchar(20) NOT NULL,
	"day_of_week" integer,
	"day_of_month" integer,
	"time_of_day" varchar(5) DEFAULT '09:00' NOT NULL,
	"message" text,
	"is_active" boolean DEFAULT true,
	"last_sent_at" timestamp,
	"next_send_at" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"staff_number" varchar(20) NOT NULL,
	"position" varchar(100) NOT NULL,
	"specialization" varchar(100),
	"license_number" varchar(100),
	"license_expiry" date,
	"start_date" date,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staff_staff_number_unique" UNIQUE("staff_number")
);
--> statement-breakpoint
CREATE TABLE "staff_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" uuid NOT NULL,
	"certification_name" varchar(255) NOT NULL,
	"issuing_body" varchar(255),
	"issue_date" date,
	"expiry_date" date
);
--> statement-breakpoint
CREATE TABLE "staff_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"break_start" time,
	"break_end" time
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50),
	"entity_id" uuid,
	"changes" jsonb,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatment_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"treatment_id" uuid NOT NULL,
	"file_type" varchar(50),
	"file_path" varchar(500) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"uploaded_by" uuid,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid,
	"patient_id" uuid NOT NULL,
	"dentist_id" uuid,
	"treatment_date" date NOT NULL,
	"treatment_code" varchar(20),
	"description" text NOT NULL,
	"tooth_numbers" jsonb,
	"status" varchar(20) DEFAULT 'completed' NOT NULL,
	"notes" text,
	"estimated_cost" numeric(10, 2),
	"actual_cost" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" varchar(20) DEFAULT 'patient' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointment_reminders" ADD CONSTRAINT "appointment_reminders_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_dentist_id_staff_id_fk" FOREIGN KEY ("dentist_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_appointment_type_id_appointment_types_id_fk" FOREIGN KEY ("appointment_type_id") REFERENCES "public"."appointment_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_settings" ADD CONSTRAINT "clinic_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_treatment_id_treatments_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_dentist_id_staff_id_fk" FOREIGN KEY ("dentist_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dentist_availability" ADD CONSTRAINT "dentist_availability_dentist_id_staff_id_fk" FOREIGN KEY ("dentist_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_treatment_id_treatments_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_notes" ADD CONSTRAINT "patient_notes_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_notes" ADD CONSTRAINT "patient_notes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_reports" ADD CONSTRAINT "scheduled_reports_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_certifications" ADD CONSTRAINT "staff_certifications_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_schedule" ADD CONSTRAINT "staff_schedule_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatment_files" ADD CONSTRAINT "treatment_files_treatment_id_treatments_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatment_files" ADD CONSTRAINT "treatment_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_dentist_id_staff_id_fk" FOREIGN KEY ("dentist_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_appointment_reminders_appointment_id" ON "appointment_reminders" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_appointment_types_name" ON "appointment_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_appointments_patient_id" ON "appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_appointments_dentist_id" ON "appointments" USING btree ("dentist_id");--> statement-breakpoint
CREATE INDEX "idx_appointments_date" ON "appointments" USING btree ("appointment_date");--> statement-breakpoint
CREATE INDEX "idx_appointments_status" ON "appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_clinical_notes_treatment_id" ON "clinical_notes" USING btree ("treatment_id");--> statement-breakpoint
CREATE INDEX "idx_dentist_availability_dentist_id" ON "dentist_availability" USING btree ("dentist_id");--> statement-breakpoint
CREATE INDEX "idx_emergency_contacts_patient_id" ON "emergency_contacts" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_insurance_claims_patient_id" ON "insurance_claims" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_insurance_claims_invoice_id" ON "insurance_claims" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "idx_insurance_claims_status" ON "insurance_claims" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_invoice_items_invoice_id" ON "invoice_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "idx_invoices_patient_id" ON "invoices" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_invoices_invoice_number" ON "invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "idx_invoices_status" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_messages_sender_id" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_messages_recipient_id" ON "messages" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_id" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_is_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_patient_notes_patient_id" ON "patient_notes" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_patients_user_id" ON "patients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_patients_patient_number" ON "patients" USING btree ("patient_number");--> statement-breakpoint
CREATE INDEX "idx_patients_status" ON "patients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payments_invoice_id" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "idx_payments_patient_id" ON "payments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_payments_date" ON "payments" USING btree ("payment_date");--> statement-breakpoint
CREATE INDEX "idx_scheduled_reports_is_active" ON "scheduled_reports" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_scheduled_reports_next_send_at" ON "scheduled_reports" USING btree ("next_send_at");--> statement-breakpoint
CREATE INDEX "idx_sessions_token" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_staff_user_id" ON "staff" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_staff_position" ON "staff" USING btree ("position");--> statement-breakpoint
CREATE INDEX "idx_staff_status" ON "staff" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_staff_certifications_staff_id" ON "staff_certifications" USING btree ("staff_id");--> statement-breakpoint
CREATE INDEX "idx_staff_schedule_staff_id" ON "staff_schedule" USING btree ("staff_id");--> statement-breakpoint
CREATE INDEX "idx_staff_schedule_day" ON "staff_schedule" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "idx_system_logs_user_id" ON "system_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_system_logs_action" ON "system_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_system_logs_created_at" ON "system_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_treatment_files_treatment_id" ON "treatment_files" USING btree ("treatment_id");--> statement-breakpoint
CREATE INDEX "idx_treatments_patient_id" ON "treatments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "idx_treatments_appointment_id" ON "treatments" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_treatments_dentist_id" ON "treatments" USING btree ("dentist_id");--> statement-breakpoint
CREATE INDEX "idx_treatments_date" ON "treatments" USING btree ("treatment_date");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");