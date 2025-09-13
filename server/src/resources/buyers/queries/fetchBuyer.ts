import { db } from "@/db";
import { buyers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchBuyer(ownerId : string){
    const result = await db.select().from(buyers).where(eq(buyers.ownerId, ownerId));
    return result;
}
