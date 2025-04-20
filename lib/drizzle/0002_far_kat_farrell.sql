CREATE TABLE IF NOT EXISTS "ApiKey" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"hashedKey" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastUsedAt" timestamp,
	"name" text,
	CONSTRAINT "ApiKey_hashedKey_unique" UNIQUE("hashedKey")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
