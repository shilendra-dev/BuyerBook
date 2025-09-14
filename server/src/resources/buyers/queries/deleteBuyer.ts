import { db } from "@/db";
import { buyers, buyerHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BuyerNotFoundError } from "../errors/buyerErrors";

export async function deleteBuyer(buyerId: string) {
    return await db.transaction(async (tx) => {
        // First, check if buyer exists
        const existingBuyer = await tx
            .select()
            .from(buyers)
            .where(eq(buyers.id, buyerId))
            .limit(1);

        if (existingBuyer.length === 0) {
            throw new BuyerNotFoundError(buyerId);
        }

        // Delete buyer history records first (to avoid foreign key constraint)
        await tx
            .delete(buyerHistory)
            .where(eq(buyerHistory.buyerId, buyerId));

        // Then delete the buyer
        const result = await tx
            .delete(buyers)
            .where(eq(buyers.id, buyerId))
            .returning();

        return result[0];
    });
}