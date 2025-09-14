import { z } from "zod";
import api from "@/lib/axios";

// ----------------------
// SCHEMAS
// ----------------------

// Full Buyer schema matching API + DB
const buyerSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").nullable().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
  propertyType: z.enum([
    "Apartment",
    "Villa",
    "Plot",
    "Office",
    "Retail",
    "Warehouse",
    "Industrial",
    "Other",
  ]),
  bhk: z.enum(["1", "2", "3", "4", "Studio"]).nullable().optional(),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.number().nullable().optional(),
  budgetMax: z.number().nullable().optional(),
  timeline: z.enum(["0-3m", "3-6m", ">6m", "Exploring"]).nullable().optional(),
  source: z.enum(["Website", "Walk-in", "Call", "Referral", "Other"]),
  status: z.enum([
    "New",
    "Qualified",
    "Contacted",
    "Visited",
    "Negotiation",
    "Converted",
    "Dropped",
  ]),
  notes: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  ownerId: z.string(),
  createdAt: z.string().datetime().transform(str => new Date(str)),
  updatedAt: z.string().datetime().transform(str => new Date(str)),
});

// Pagination schema
const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Buyers list schema (array + pagination)
const buyersListSchema = z.object({
  buyers: z.array(buyerSchema),
  pagination: paginationSchema,
});

// Schema for create form (strict required fields)
const buyerCreateSchema = buyerSchema.pick({
  fullName: true,
  email: true,
  phone: true,
  city: true,
  propertyType: true,
  bhk: true,
  purpose: true,
  budgetMin: true,
  budgetMax: true,
  timeline: true,
  source: true,
  notes: true,
  tags: true,
});

// Schema for update form (all optional)
const buyerUpdateSchema = buyerCreateSchema.partial();

// ----------------------
// TYPES
// ----------------------
type Buyer = z.infer<typeof buyerSchema>;
export type BuyerFormValues = z.infer<typeof buyerCreateSchema>;
export type BuyerUpdateValues = z.infer<typeof buyerUpdateSchema>;
export type BuyersList = z.infer<typeof buyersListSchema>;

// ----------------------
// API FUNCTIONS
// ----------------------
const buyerApi = {
  // Fetch all buyers with pagination
  getAllBuyers: async (): Promise<BuyersList> => {
    try {
      const response = await api.get("/buyers");
      const validated = buyersListSchema.parse(response.data.data);
      return validated;
    } catch (error) {
      console.error("Error fetching buyers:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.message);
      }
      throw error;
    }
  },

  // Fetch single buyer
  getBuyerById: async (id: string): Promise<Buyer> => {
    const response = await api.get(`/buyers/${id}`);
    return buyerSchema.parse(response.data.data);
  },

  // Create buyer
  createBuyer: async (buyerData: BuyerFormValues): Promise<Buyer> => {
    buyerCreateSchema.parse(buyerData);
    const response = await api.post("/buyers", buyerData);
    return buyerSchema.parse(response.data.data);
  },

  // Update buyer
  updateBuyer: async (
    id: string,
    buyerData: BuyerUpdateValues
  ): Promise<Buyer> => {
    buyerUpdateSchema.parse(buyerData);
    const response = await api.put(`/buyers/${id}`, buyerData);
    return buyerSchema.parse(response.data.data);
  },

  // Delete buyer
  deleteBuyer: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`/buyers/${id}`);
    return { success: true };
  },
};

export { buyerApi, buyerSchema, buyerCreateSchema, buyerUpdateSchema };
