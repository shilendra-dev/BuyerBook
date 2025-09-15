import { handleApiError } from "@/utils/errorHandler";
import { ControllerFunction } from "@/types/base.types";
import { AuthenticatedRequest } from "@/types/base.types";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { insertBulkBuyers } from "../queries/insertBulkBuyers";
import { uploadBulkBuyerSchema } from "../validators/buyerValidator";
import crypto from "crypto";

//we will be getting an array of objects <200
export const uploadBulkBuyersAPI: ControllerFunction = async (req: AuthenticatedRequest, _res: Response): Promise<ApiResponse> => {
    try {
        const validatedBuyers = uploadBulkBuyerSchema.parse(req.body);
        //ownerId
        if (!req.user?.id) {
            return {
                status: 401,
                message: "Unauthorized",
                type: "error",
            }
        }
        const ownerId = req.user.id;

        //add uuid to each buyer
        const buyers = validatedBuyers.map((value) => {
            return {
                ...value,
                id: crypto.randomUUID(),
                ownerId,
            }
        })

        //we have to add every buyer to the database
        const result = await insertBulkBuyers(buyers);
        
        if(result.length === 0){
            return {
                status: 400,
                message: "No buyers uploaded",
                type: "error",
            }
        }
        
        return {
            status: 200,
            message: "Buyers uploaded successfully",
            data: result,
            type: "success",
        }
        

    } catch (error) {
        return handleApiError(error);
    }
}