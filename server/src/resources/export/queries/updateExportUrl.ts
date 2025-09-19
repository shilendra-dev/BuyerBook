import { exportBuyersUrls } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export default async function updateExportUrl(exportId: string, url: string) {
    try {
        await db.update(exportBuyersUrls).set({
            url: url,
            status: "completed",
        }).where(eq(exportBuyersUrls.id, exportId));
    }catch(error) {
        console.error("Error updating export url:", error);
        throw error;
    }
}