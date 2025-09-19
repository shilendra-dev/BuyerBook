import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { handleApiError } from "@/utils/errorHandler";
import { fetchAllBuyers } from "@/resources/export/queries/fetchAllBuyers";
import { PaginationOptions } from "@/resources/export/queries/fetchAllBuyers";
import { sortOptions } from "@/resources/export/queries/fetchAllBuyers";
import { filterOptions } from "@/resources/export/queries/fetchAllBuyers";

export const getAllBuyersAPI: ControllerFunction = async (
  req: AuthenticatedRequest,
  _res: Response
): Promise<ApiResponse> => {
  try {
    // Extract pagination parameters from query string

    const { paginationParams, sortParams, filterParams } = req.query as unknown as { paginationParams: PaginationOptions, sortParams: sortOptions, filterParams: filterOptions } ;

    const page = parseInt(paginationParams.page);
    const limit = parseInt(paginationParams.limit);
    
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

    const testResult = await fetchAllBuyers(filterParams, paginationParams, sortParams);

    // const result = await getAllBuyers({ page, limit }); DEPRICATED`

    return {
      status: 200,
      message: "Buyers retrieved successfully",
      data: {
        buyers: testResult.data,
        pagination: testResult.pagination,
      },
      type: "success",
    };
  } catch (error) {
    return handleApiError(error);
  }
};
