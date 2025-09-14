import { db } from "@/db";
import { buyers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchBuyerByPhone(phone : string){
    const result = await db.select().from(buyers).where(eq(buyers.phone, phone));
    return result;
}