CREATE TABLE "export_buyers_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by_id" text NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "export_buyers_urls" ADD CONSTRAINT "export_buyers_urls_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;