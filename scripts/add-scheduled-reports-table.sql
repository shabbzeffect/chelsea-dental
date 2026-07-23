-- Add scheduled_reports table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'scheduled_reports') THEN
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
    
    -- Add indexes
    CREATE INDEX "idx_scheduled_reports_is_active" ON "scheduled_reports" USING btree ("is_active");
    CREATE INDEX "idx_scheduled_reports_next_send_at" ON "scheduled_reports" USING btree ("next_send_at");
    
    -- Add foreign key
    ALTER TABLE "scheduled_reports" ADD CONSTRAINT "scheduled_reports_created_by_users_id_fk" 
    FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
    
    RAISE NOTICE 'scheduled_reports table created successfully';
  ELSE
    RAISE NOTICE 'scheduled_reports table already exists';
  END IF;
END $$;
