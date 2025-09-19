import { db } from "@/db";
import { exportBuyersUrls } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function updateExportStatus(exportId: string, status: string) {
    try {
        await db.update(exportBuyersUrls).set({
            status: status,
        }).where(eq(exportBuyersUrls.id, exportId));
    }catch(error) {
        console.error("Error updating export status:", error);
        throw error;
    }
}