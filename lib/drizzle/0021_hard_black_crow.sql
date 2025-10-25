CREATE TABLE IF NOT EXISTS "RegistrationToken" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(255) NOT NULL,
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
	CONSTRAINT "RegistrationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RegistrationToken" ADD CONSTRAINT "RegistrationToken_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
