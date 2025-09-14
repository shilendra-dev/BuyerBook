import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { buyerSchema } from "../validators/buyerValidator";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { fetchBuyerByPhone } from "../queries/fetchBuyerByPhone";
import { addBuyer } from "../queries/addBuyer";
import { handleApiError } from "@/utils/errorHandler";

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

        // Check if buyer already exists using phone number
        const phone = validatedData.phone;
        
        const existingBuyer = await fetchBuyerByPhone(phone);
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
        return handleApiError(error);
    }
}