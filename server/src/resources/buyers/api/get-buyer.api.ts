import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { fetchBuyerById } from "../queries/fetchBuyerById";

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
    console.error(error);
    return {
      status: 500,
      message: "Internal server error",
      type: "error",
    };
  }
};
