import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { getAllBuyers } from "../queries/getAllBuyers";
import { handleApiError } from "@/utils/errorHandler";

export const getAllBuyersAPI: ControllerFunction = async (
  req: AuthenticatedRequest,
  _res: Response
): Promise<ApiResponse> => {
  try {
    // Extract pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate pagination parameters
    if (page < 1) {
      return {
        status: 400,
        message: "Page must be greater than 0",
        type: "error",
      };
    }

    if (limit < 1 || limit > 100) {
      return {
        status: 400,
        message: "Limit must be between 1 and 100",
        type: "error",
      };
    }

    const result = await getAllBuyers({ page, limit });

    return {
      status: 200,
      message: "Buyers retrieved successfully",
      data: {
        buyers: result.data,
        pagination: result.pagination,
      },
      type: "success",
    };
  } catch (error) {
    return handleApiError(error);
  }
};
