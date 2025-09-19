import { ControllerFunction } from "@/types/base.types";
import { AuthenticatedRequest } from "@/types/base.types";
import { ApiResponse } from "@/types/base.types";
import { handleApiError } from "@/utils/errorHandler";
import { queue } from "@/utils/queue";
import { Response } from "express";
import { filterOptions } from "../queries/fetchAllBuyers";
import { sortOptions } from "../queries/fetchAllBuyers";
import initializeExportUrl from "../queries/initializeExportUrl";

export const exportBuyersAPI: ControllerFunction = async (req: AuthenticatedRequest, _res: Response): Promise<ApiResponse> => {
    try {
        const {sortParams, filterParams} = req.query as unknown as {sortParams: sortOptions, filterParams: filterOptions};

        if (!req.user?.id) {
            return {
                status: 401,
                message: "Unauthorized",
                type: "error",
            }
        }
        const userId = req.user.id;
        
        const exportInsertResult = await initializeExportUrl(userId);
        const exportId = exportInsertResult[0].exportId;

        const job = await queue.add("export-buyers", {
            filterParams,
            sortParams,
            exportId,
        })
        
        return {
            status: 200,
            message: "Job queued successfully",
            data: {
                jobId: job.id,
                exportId: exportId,
                status: "pending",
            },
            type: "success",
        }

    } catch (error) {
        return handleApiError(error);
    }
};