ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "messageCount";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "lastMessageReset";