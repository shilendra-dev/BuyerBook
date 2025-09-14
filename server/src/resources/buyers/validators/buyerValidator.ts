import { z } from "zod";

// Buyer input validator
export const buyerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email().optional(),
  phone: z.string().regex(/^\d{7,15}$/, "Phone must be 7–15 digits"),
  city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail", "Warehouse", "Industrial", "Other"]),
  bhk: z.enum(["1", "2", "3", "4", "Studio"]).optional(),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: z.enum(["0-3m", "3-6m", ">6m", "Exploring"]).optional(),
  source: z.enum(["Website", "Walk-in", "Call", "Referral", "Other"]),
  status: z.enum(["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"]).default("New"),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Type inference
export type BuyerInput = z.infer<typeof buyerSchema>;

// Update buyer validator
export const updateBuyerSchema = buyerSchema.partial()
export type BuyerUpdateInput = z.infer<typeof updateBuyerSchema>; //infer type