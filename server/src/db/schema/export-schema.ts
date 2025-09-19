import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const exportBuyersUrls = pgTable("export_buyers_urls", {
    id: text("id").primaryKey(),
    createdById: text("created_by_id").notNull().references(() => user.id),
    isDeleted: boolean("is_deleted").default(false),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});