ALTER TABLE "User" ADD COLUMN "messageCount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastMessageReset" timestamp DEFAULT now() NOT NULL;