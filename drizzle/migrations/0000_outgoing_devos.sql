CREATE TABLE IF NOT EXISTS "crystals" (
	"id" serial PRIMARY KEY NOT NULL,
	"crystal_id" varchar(20) NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(100) NOT NULL,
	"elements" jsonb NOT NULL,
	"effects" jsonb NOT NULL,
	"price_level" varchar(10) NOT NULL,
	"bead_sizes" jsonb NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "crystals_crystal_id_unique" UNIQUE("crystal_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "energy_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" varchar(50) NOT NULL,
	"user_id" integer,
	"profile_id" integer,
	"scene" varchar(50) NOT NULL,
	"body_strength" varchar(10) NOT NULL,
	"favorable_elements" jsonb NOT NULL,
	"missing_elements" jsonb NOT NULL,
	"radar_chart_data" jsonb,
	"summary_text" text,
	"logic_chain" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "energy_reports_report_id_unique" UNIQUE("report_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(50) NOT NULL,
	"user_id" integer,
	"profile_id" integer,
	"recommendation_id" integer,
	"price_tier" varchar(20) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" varchar(20) NOT NULL,
	"address" jsonb NOT NULL,
	"contact_info" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" varchar(50),
	"price_tier" varchar(20) NOT NULL,
	"crystals" jsonb NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"image_url" varchar(255),
	"description" text,
	"reason_summary" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(50) NOT NULL,
	"birth_date" date NOT NULL,
	"gender" varchar(10) NOT NULL,
	"location" varchar(100) NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"nickname" varchar(50),
	"avatar" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "energy_reports" ADD CONSTRAINT "energy_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "energy_reports" ADD CONSTRAINT "energy_reports_profile_id_user_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_profile_id_user_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_recommendation_id_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_report_id_energy_reports_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "energy_reports"("report_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
