import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { deleteBuyer } from "../queries/deleteBuyer";
import { handleApiError } from "@/utils/errorHandler";

export const deleteBuyerAPI: ControllerFunction = async (
  req: AuthenticatedRequest,
  _res: Response
): Promise<ApiResponse> => {
  try {
    const buyerId = req.params.id;
    const result = await deleteBuyer(buyerId);

    return {
      status: 200,
      message: "Buyer deleted successfully",
      data: result,
      type: "success",
    };
  } catch (error) {
    return handleApiError(error);
  }
};
