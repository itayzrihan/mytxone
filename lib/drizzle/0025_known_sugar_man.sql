CREATE TABLE IF NOT EXISTS "Community" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"community_type" text NOT NULL,
	"category" text DEFAULT 'business' NOT NULL,
	"image_url" text,
	"member_count" integer DEFAULT 0 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"tags" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CommunityMember" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"user_id" uuid,
	"guest_name" text,
	"guest_email" text,
	"membership_status" text DEFAULT 'member' NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HypnosisLead" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"allow_marketing" boolean DEFAULT false NOT NULL,
	"allow_hypnosis_knowledge" boolean DEFAULT false NOT NULL,
	"ebook_sent" boolean DEFAULT false NOT NULL,
	"ebook_sent_at" timestamp,
	"source" varchar(50) DEFAULT 'hypno-landing' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "RegistrationToken";--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "paypal_subscription_id" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Community" ADD CONSTRAINT "Community_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_community_id_Community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."Community"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "totp_secret";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "totp_enabled";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "totp_seed_id";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "totp_setup_completed";