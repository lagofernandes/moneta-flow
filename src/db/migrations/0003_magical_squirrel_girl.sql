CREATE TABLE "global_merchant_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pattern" text NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "global_merchant_cache_pattern_unique" UNIQUE("pattern")
);
--> statement-breakpoint
ALTER TABLE "global_merchant_cache" ADD CONSTRAINT "global_merchant_cache_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;