import { db } from "@/db";
import { buyers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchBuyerById(id : string){
    const result = await db.select().from(buyers).where(eq(buyers.id, id));
    return result;
}