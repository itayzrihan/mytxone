CREATE TABLE IF NOT EXISTS "RegistrationToken" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(255) NOT NULL UNIQUE,
	"user_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"service_name" varchar(255) NOT NULL,
	"callback_url" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"seed_id" varchar(255),
	"totp_seed" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"completed_at" timestamp,
	FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX "RegistrationToken_token_idx" on "RegistrationToken" ("token");--> statement-breakpoint
CREATE INDEX "RegistrationToken_user_id_idx" on "RegistrationToken" ("user_id");--> statement-breakpoint
CREATE INDEX "RegistrationToken_status_idx" on "RegistrationToken" ("status");
