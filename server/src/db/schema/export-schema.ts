import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const exportBuyersUrls = pgTable("export_buyers_urls", {
    id: uuid("id").defaultRandom().primaryKey(),
    createdById: text("created_by_id").notNull().references(() => user.id),
    status: text("status").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});