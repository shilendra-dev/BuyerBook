import { db } from "@/db";
import { buyers } from "@/db/schema";
import { eq } from "drizzle-orm";

//Give a list buyers owned by ownerId
export async function fetchBuyersByOwner(ownerId : string){
    const result = await db.select().from(buyers).where(eq(buyers.ownerId, ownerId));
    return result;
}