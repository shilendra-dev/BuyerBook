export type PropertyType = "Apartment" | "Villa" | "Plot" | "Office" | "Retail" | "Warehouse" | "Industrial" | "Other";

export type Purpose = "Buy" | "Rent";

export type Source = "Website" | "Walk-in" | "Call" | "Referral" | "Other";

export type Status = "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped";

export type Timeline = "0-3m" | "3-6m" | ">6m" | "Exploring";

export type City = "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other";

export type BHK = "1" | "2" | "3" | "4" | "Studio";

export interface Buyer {
  id: string;
  fullName: string;
  email?: string | null | undefined;
  phone: string;
  city: City;
  propertyType: PropertyType;
  bhk?: BHK | null | undefined;
  purpose: Purpose;
  budgetMin?: number | null | undefined;
  budgetMax?: number | null | undefined;
  timeline?: Timeline | null | undefined;
  source: Source;
  status: Status;
  notes?: string | null | undefined;
  tags?: string[] | null | undefined;
  ownerId: string;
  updatedAt: Date;
  createdAt: Date;
}