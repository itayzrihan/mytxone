ALTER TABLE "User" ADD COLUMN "totp_secret" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "totp_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "totp_seed_id" varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "totp_setup_completed" timestamp;