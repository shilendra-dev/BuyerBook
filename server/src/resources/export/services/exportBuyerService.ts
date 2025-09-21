import { fetchAllBuyers, filterOptions, PaginationOptions, sortOptions } from "../queries/fetchAllBuyers";
import papa from "papaparse";
import cloudinary from '@/utils/cloudinary';
import fs, { appendFileSync } from 'fs';
import updateExportStatus from "../queries/updateExportStatus";
import updateExportUrl from "../queries/updateExportUrl";
import os from 'os';

export async function exportBuyers(filterParams: filterOptions, sortParams: sortOptions, exportId: string) {
    try {
        //update status in db
        await updateExportStatus(exportId, "in_progress");

        //fetch json data from db (100 only)
        const paginationParams = { //string because our query convers it to numbers
            page: "1",
            limit: "2",
        } as PaginationOptions;

        const data = await fetchAllBuyers(filterParams, paginationParams, sortParams);
        const keys = ["fullName", "email", "phone", "city", "propertyType", "bhk", "purpose", "budgetMin", "budgetMax", "timeline", "source", "status", "notes", "tags", "createdAt"];
        appendFileSync('buyers.csv', keys.join(',') + os.EOL);

        for (let i = 1; i <= data.pagination.totalPages; i++) {
            const data = await fetchAllBuyers(filterParams, { page: i.toString(), limit: "2" }, sortParams);
            const buyerData = data.data;
            buyerData.forEach((buyer) => {
                delete buyer.id;
                delete buyer.ownerId;
                buyer.createdAt = buyer.createdAt.toLocaleDateString();
                buyer.updatedAt = buyer.updatedAt.toLocaleDateString();
            });
            await json2csvParser(buyerData, 'buyers.csv', keys);
        }

        const results = await cloudinary.uploader
            .upload('buyers.csv', { resource_type: "raw" })

        const secureUrl = results.secure_url;

        fs.unlinkSync('buyers.csv'); //deletes the file after upload

        //saving secure url in db
        const updateExportResult = await updateExportUrl(exportId, secureUrl);

        return updateExportResult;
    } catch (error) {
        await updateExportStatus(exportId, "failed");
        throw error;
    }
}

function formatValue(value: any): string {
    if (Array.isArray(value)) {
        return value.join(' | ');
    }
    if (typeof value === "string") {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value ?? "";
}

async function json2csvParser(data: any, fileName: string, keys: string[]) {
    data.forEach((buyer: any) => {
        fs.appendFileSync(fileName, (keys.map((key) => formatValue(buyer[key])).join(',')) + os.EOL);
    });
}