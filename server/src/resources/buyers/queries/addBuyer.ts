import { db } from "@/db";
import { buyers } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { BuyerInput } from "../validators/buyerValidator";

export async function addBuyer( data : BuyerInput, ownerId : string) {
    const id = uuidv4();
  
    const result = await db
      .insert(buyers)
      .values({
        id,
        fullName: data.fullName,
        email: data.email ?? null,
        phone: data.phone,
        city: data.city,
        propertyType: data.propertyType,
        bhk: data.bhk ?? null,
        purpose: data.purpose,
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        timeline: data.timeline ?? null,
        source: data.source,
        status: data.status ?? "New",
        notes: data.notes ?? null,
        tags: data.tags ?? [],
        ownerId: ownerId,
      })
      .returning();
  
    return result;
  }