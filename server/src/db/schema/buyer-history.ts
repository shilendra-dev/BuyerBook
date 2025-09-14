import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { buyers } from "./buyers-scehma";
import { user } from "./auth-schema";

export const buyerHistory = pgTable('buyer_history', {
    id: text('id').primaryKey(),
    buyerId: text('buyer_id').notNull().references(() => buyers.id),
    changedBy: text('changed_by').notNull().references(() => user.id),
    changedAt: timestamp('changed_at').defaultNow().notNull(),
    diff: json('diff').notNull(),
})