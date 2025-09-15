import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const propertyTypeENUM = pgEnum(
    "property_type", ["Apartment", "Villa", "Plot", "Office", "Retail", "Warehouse", "Industrial", "Other"]
)

export const purposeENUM = pgEnum(
    "purpose", ["Buy", "Rent"]
)

export const sourceENUM = pgEnum(
    "source", ["Website", "Walk-in", "Call", "Referral", "Other"]
)

export const statusENUM = pgEnum(
    "status", ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"]
)
    
export const timelineENUM = pgEnum(
    "timeline", ["0-3m", "3-6m", ">6m", "Exploring"]
)

export const cityENUM = pgEnum(
    'city', ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]
)

export const bhkENUM = pgEnum(
    'bhk', ["1", "2", "3", "4", "Studio"]
)

export const buyers = pgTable('buyers', {
    id: text('id').primaryKey(),
    fullName: varchar("full_name").notNull(),
    email: varchar('email'),
    phone: text('phone').notNull().unique(),
    city: cityENUM('city').notNull(),
    propertyType: propertyTypeENUM('property_type').notNull(),
    bhk: bhkENUM('bhk'), //should be optional if non-residential
    purpose: purposeENUM('purpose').notNull(),
    budgetMin: integer('budget_min'),
    budgetMax: integer('budget_max'),
    timeline: timelineENUM('timeline'),
    source: sourceENUM('source').notNull(),
    status: statusENUM('status').default('New').notNull(),
    notes: text('notes'),
    tags: text('tags').array(),
    ownerId: text('owner_id').notNull().references(() => user.id),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})