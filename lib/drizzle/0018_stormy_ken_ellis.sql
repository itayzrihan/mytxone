CREATE TABLE IF NOT EXISTS "ScriptSeries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ScriptSeriesLink" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"script_id" uuid NOT NULL,
	"series_id" uuid NOT NULL,
	"order_in_series" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "QuoteItem" ADD COLUMN "parameter_pricing_mode" text;--> statement-breakpoint
ALTER TABLE "QuoteItem" ADD COLUMN "min_price_per_unit" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "QuoteItem" ADD COLUMN "max_price_per_unit" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "QuoteOption" ADD COLUMN "pricing_type" text DEFAULT 'fixed' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ScriptSeries" ADD CONSTRAINT "ScriptSeries_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ScriptSeriesLink" ADD CONSTRAINT "ScriptSeriesLink_script_id_Script_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."Script"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ScriptSeriesLink" ADD CONSTRAINT "ScriptSeriesLink_series_id_ScriptSeries_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."ScriptSeries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
