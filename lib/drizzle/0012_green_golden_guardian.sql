ALTER TABLE "Script" ALTER COLUMN "language" SET DEFAULT 'english';--> statement-breakpoint
ALTER TABLE "Script" ADD COLUMN "hook_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Script" ADD COLUMN "main_content_type" text DEFAULT 'storytelling' NOT NULL;--> statement-breakpoint
ALTER TABLE "Script" ADD COLUMN "content_folder_link" text;--> statement-breakpoint
ALTER TABLE "Script" ADD COLUMN "production_video_link" text;--> statement-breakpoint
ALTER TABLE "Script" ADD COLUMN "uploaded_video_links" json;--> statement-breakpoint
ALTER TABLE "Script" ADD COLUMN "status" text DEFAULT 'in-progress' NOT NULL;