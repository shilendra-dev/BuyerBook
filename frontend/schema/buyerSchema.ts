import { z } from "zod";



// Helper function to convert string to number or return null if empty
const toNumber = (val: unknown): number | null => {
  if (val === "" || val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// Helper function to handle string to array conversion for tags
const toArray = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// BHK schema with simple validation
const bhkSchema = z.union([
  z.literal('1'),
  z.literal('2'),
  z.literal('3'),
  z.literal('4'),
  z.literal('Studio'),
  z.literal(''),
  z.null()
]).optional();

// Simple BHK normalizer
const normalizeBhk = (val: unknown) => {
  if (val === null || val === undefined || val === '') return null;
  const strVal = String(val).trim();
  return ['1', '2', '3', '4', 'Studio', ''].includes(strVal) ? strVal : null;
};

export const buyerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    
    email: z.preprocess(
      (val) => val === "" ? null : val,
      z.string().email("Invalid email format").nullable().optional()
    ),
    
    phone: z.string().regex(/^\d{7,15}$/, "Phone must be 7–15 digits"),
    
    city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"], { 
      error: () => ({ message: "Invalid city" }) 
    }),
    
    propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail", "Warehouse", "Industrial", "Other"], { 
      error: () => ({ message: "Invalid property type" }) 
    }),
    
    bhk: z.preprocess(normalizeBhk, bhkSchema),
    
    purpose: z.enum(["Buy", "Rent"], { 
      error: () => ({ message: "Invalid purpose" }) 
    }),
    
    budgetMin: z.preprocess(
      toNumber,
      z.number().min(0, "Minimum budget cannot be negative").nullable().optional()
    ),
    
    budgetMax: z.preprocess(
      toNumber,
      z.number().min(0, "Maximum budget cannot be negative").nullable().optional()
    ),
    
    timeline: z.preprocess(
      (val) => val === "" ? null : val,
      z.enum(["0-3m", "3-6m", ">6m", "Exploring"], { 
        error: () => ({ message: "Invalid timeline" }) 
      }).nullable().optional()
    ),
    
    source: z.enum(["Website", "Walk-in", "Call", "Referral", "Other"], { 
      error: () => ({ message: "Invalid source" }) 
    }),
    
    status: z.enum(
      ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"], 
      { error: () => ({ message: "Invalid status" }) }
    ).default("New").optional(),
    
    notes: z.preprocess(
      (val) => val === "" ? undefined : val,
      z.string().optional()
    ),
    
    tags: z.preprocess(
      toArray,
      z.array(z.string()).default([]).optional()
    ),
});

export type Buyer = z.infer<typeof buyerSchema>;

// For CSV import/export
export const buyerCsvSchema = buyerSchema.refine(
    (data) => {
        const min = data.budgetMin !== null && data.budgetMin !== undefined ? Number(data.budgetMin) : null;
        const max = data.budgetMax !== null && data.budgetMax !== undefined ? Number(data.budgetMax) : null;
        return !(min !== null && max !== null && max < min);
    },
    {
        message: "Maximum budget cannot be less than minimum budget",
        path: ["budgetMax"],
    }
);