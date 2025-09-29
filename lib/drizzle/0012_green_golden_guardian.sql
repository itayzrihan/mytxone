ALTER TABLE "Script" ALTER COLUMN "language" SET DEFAULT 'english';--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Script' AND column_name = 'hook_type') THEN
        ALTER TABLE "Script" ADD COLUMN "hook_type" text NOT NULL;
    END IF;
END $$;--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Script' AND column_name = 'main_content_type') THEN
        ALTER TABLE "Script" ADD COLUMN "main_content_type" text DEFAULT 'storytelling' NOT NULL;
    END IF;
END $$;--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Script' AND column_name = 'content_folder_link') THEN
        ALTER TABLE "Script" ADD COLUMN "content_folder_link" text;
    END IF;
END $$;--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Script' AND column_name = 'production_video_link') THEN
        ALTER TABLE "Script" ADD COLUMN "production_video_link" text;
    END IF;
END $$;--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Script' AND column_name = 'uploaded_video_links') THEN
        ALTER TABLE "Script" ADD COLUMN "uploaded_video_links" json;
    END IF;
END $$;--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Script' AND column_name = 'status') THEN
        ALTER TABLE "Script" ADD COLUMN "status" text DEFAULT 'in-progress' NOT NULL;
    END IF;
END $$;