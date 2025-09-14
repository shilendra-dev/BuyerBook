import { db } from "@/db";
import { buyers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BuyerNotFoundError } from "../errors/buyerErrors";

export async function deleteBuyer(buyerId: string) {
    const result = await db
        .delete(buyers)
        .where(eq(buyers.id, buyerId))
        .returning();

    if (result.length === 0) {
        throw new BuyerNotFoundError(buyerId);
    }

    return result[0];
}