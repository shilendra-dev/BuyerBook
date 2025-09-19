import { exportBuyersUrls } from "@/db/schema/export-schema";
import crypto from "crypto";
import { db } from "@/db";

export async function insertExportUrl(url: string, createdById: string) {
    try {
        const id = crypto.randomUUID();
        const result = await db.insert(exportBuyersUrls).values({
            id,
            createdById,
            url,
        })
        return result;
    } catch (error) {
        console.error("Error inserting export url:", error);
        throw error;
    }
}