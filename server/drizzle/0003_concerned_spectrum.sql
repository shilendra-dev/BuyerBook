ALTER TABLE "export_buyers_urls" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
ALTER TABLE "export_buyers_urls" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "export_buyers_urls" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "export_buyers_urls" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "export_buyers_urls" DROP COLUMN "is_deleted";