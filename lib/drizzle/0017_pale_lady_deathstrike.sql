CREATE TABLE IF NOT EXISTS "QuoteItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"item_type" text NOT NULL,
	"fixed_price" numeric(10, 2),
	"min_price" numeric(10, 2),
	"max_price" numeric(10, 2),
	"parameter_type" text,
	"parameter_unit" text,
	"price_per_unit" numeric(10, 2),
	"min_units" integer,
	"max_units" integer,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuoteOption" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"fixed_price" numeric(10, 2),
	"min_price" numeric(10, 2),
	"max_price" numeric(10, 2),
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuoteResponse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"customer_phone" text,
	"selected_items" json NOT NULL,
	"selected_options" json NOT NULL,
	"parameter_values" json,
	"total_min_price" numeric(10, 2),
	"total_max_price" numeric(10, 2),
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuoteTemplate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"business_type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"allow_guest_submissions" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_template_id_QuoteTemplate_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."QuoteTemplate"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuoteOption" ADD CONSTRAINT "QuoteOption_item_id_QuoteItem_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."QuoteItem"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuoteResponse" ADD CONSTRAINT "QuoteResponse_template_id_QuoteTemplate_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."QuoteTemplate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuoteTemplate" ADD CONSTRAINT "QuoteTemplate_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
