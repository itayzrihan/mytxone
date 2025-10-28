ALTER TABLE "User" ADD COLUMN "full_name" varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "not_mytx_email" varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "profile_image_url" text;