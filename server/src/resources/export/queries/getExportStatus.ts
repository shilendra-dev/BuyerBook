import { db } from "@/db";
import { exportBuyersUrls } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getExportStatus(exportId: string) {
    try {
        const result = await db.select().from(exportBuyersUrls).where(and(eq(exportBuyersUrls.id, exportId)));
        return result[0];
    } catch (error) {
        console.error("Error getting export status:", error);
        throw error;
    }
}