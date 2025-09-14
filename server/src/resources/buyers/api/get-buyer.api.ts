import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { fetchBuyerById } from "../queries/fetchBuyerById";
import { handleApiError } from "@/utils/errorHandler";

export const getBuyerAPI: ControllerFunction = async (
  req: AuthenticatedRequest,
  _res: Response
): Promise<ApiResponse> => {
  try {
    const buyerId = req.params.id;
    const result = await fetchBuyerById(buyerId);

    return {
      status: 200,
      message: "Buyer retrieved successfully",
      data: result,
      type: "success",
    };
  } catch (error) {
    return handleApiError(error);
  }
};
