import { z } from "zod";

export const buyerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email format").nullable().optional(),
    phone: z.string().regex(/^\d{7,15}$/, "Phone must be 7–15 digits"),
    city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"], { error: () => ({ message: "Invalid city" }) }),
    propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail", "Warehouse", "Industrial", "Other"], { error: () => ({ message: "Invalid property type" }) }),
    bhk: z.preprocess(
        (val) => (val === "" ? null : val),
        z.enum(["1", "2", "3", "4", "Studio"], { error: () => ({ message: "Invalid bhk" }) }).nullable().optional()
    ),
    purpose: z.enum(["Buy", "Rent"], { error: () => ({ message: "Invalid purpose" }) }),
    budgetMin: z.number().min(0, "Minimum budget cannot be negative").nullable().optional(),
    budgetMax: z.number().min(0, "Maximum budget cannot be negative").nullable().optional(),
    timeline: z.enum(["0-3m", "3-6m", ">6m", "Exploring"], { error: () => ({ message: "Invalid timeline" }) }).nullable().optional(),
    source: z.enum(["Website", "Walk-in", "Call", "Referral", "Other"], { error: () => ({ message: "Invalid source" }) }),
    status: z.enum(["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"], { error: () => ({ message: "Invalid status" }) }).default("New").optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).nullable().optional(),
});

// For CSV import/export
export const buyerCsvSchema = buyerSchema
    .extend({
        budgetMin: z.string().optional().nullable(),
        budgetMax: z.string().optional().nullable(),
        tags: z.string().optional().nullable() // Comma-separated string for CSV
    })
    .refine(
        (data) => {
            const min = data.budgetMin ? parseFloat(data.budgetMin) : null;
            const max = data.budgetMax ? parseFloat(data.budgetMax) : null;
            return !(min !== null && max !== null && max < min);
        },
        {
            message: "Maximum budget must be greater than or equal to minimum budget",
            path: ["budgetMax"],
        }
    );