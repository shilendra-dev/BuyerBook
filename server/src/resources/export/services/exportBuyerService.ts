import { fetchAllBuyers, filterOptions, PaginationOptions, sortOptions } from "../queries/fetchAllBuyers";
import papa from "papaparse";
import cloudinary from '@/utils/cloudinary';
import fs from 'fs';
import { insertExportUrl } from "../queries/insertExportUrl";

export async function exportBuyers(filterParams: filterOptions, sortParams: sortOptions, userId: string) {

    try {
        //fetch json data from db (100 only)
        const paginationParams = { //string because our query convers it to numbers
            page: "1",
            limit: "2",
        } as PaginationOptions;

        const data = await fetchAllBuyers(filterParams, paginationParams, sortParams);


        for(let i = 1; i <= data.pagination.totalPages; i++) {
            const data = await fetchAllBuyers(filterParams, {page: i.toString(), limit: "2"}, sortParams);
            const buyerData = data.data;
            buyerData.forEach((buyer) => {
                delete buyer.id;
                delete buyer.ownerId;
                buyer.createdAt = buyer.createdAt.toLocaleDateString();
                buyer.updatedAt = buyer.updatedAt.toLocaleDateString();
            });

            fs.appendFileSync('buyers.csv', papa.unparse(buyerData));
        }
        
        const results = await cloudinary.uploader
            .upload('buyers.csv', { resource_type: "raw" })

        const secureUrl = results.secure_url;

        fs.unlinkSync('buyers.csv'); //deletes the file after upload

        //saving secure url in db
        const result = await insertExportUrl(secureUrl, userId);

        return result;
    } catch (error) {
        fs.unlinkSync('buyers.csv'); //deletes the file after upload if error
        throw error;
    }
}