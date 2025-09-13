import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { buyerSchema } from "../validators/buyerValidator";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { fetchBuyer } from "../queries/fetchBuyer";
import { addBuyer } from "../queries/addBuyer";
import { z } from "zod";

export const createBuyerAPI: ControllerFunction =  async (
    req: AuthenticatedRequest,
    _res: Response
): Promise<ApiResponse> => {
    try {
        const validatedData = buyerSchema.parse(req.body);
        
        if (!req.user?.id) {
            return {
                status: 401,
                message: "Unauthorized",
                type: "error"
            }
        }
        const ownerId = req.user.id;

        // Check if buyer already exists
        const existingBuyer = await fetchBuyer(ownerId);
        if (existingBuyer.length > 0) {
            return {
                status: 400,
                message: "Buyer already exists",
                type: "error"
            }
        }

        // Create buyer
        const [newBuyer] = await addBuyer(validatedData, ownerId);
        
        return {
            status: 200,
            message: "Buyer created successfully",
            data: newBuyer,
            type: "success"
        }
    } catch (error) {
        if(error instanceof z.ZodError){
            return {
                status: 400,
                message: "Validation error",
                type: "error"
            }
        }
        return {
            status: 500,
            message: "Internal server error",
            type: "error"
        }
    }
}