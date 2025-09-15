import { db } from "@/db";
import { buyers } from "@/db/schema";

export async function insertBulkBuyers(buyersData: any) {//any type because we added id in every object
    try {
        const result = await db.transaction(async (trx) => {
            return await trx.insert(buyers).values(buyersData).returning();
        })
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}