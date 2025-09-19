import { db } from "@/db";
import { exportBuyersUrls } from "@/db/schema";

export default async function initializeExportUrl(userId: string) {
    try{
        const result = await db.insert(exportBuyersUrls).values({
            createdById: userId,
            status: "pending",
            url: "",
        }).returning({
            exportId: exportBuyersUrls.id,
        });
        return result;
    }catch(error) {
        console.error("Error initializing export url");
        throw error;
    }
}