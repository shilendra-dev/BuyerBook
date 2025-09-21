import { ControllerFunction } from "@/types/base.types";
import { AuthenticatedRequest } from "@/types/base.types";
import { ApiResponse } from "@/types/base.types";
import { handleApiError } from "@/utils/errorHandler";
import { Response } from "express";
import { getExportStatus } from "../queries/getExportStatus";

export const pollExportBuyersAPI: ControllerFunction = async (req: AuthenticatedRequest, _res: Response): Promise<ApiResponse> => {
    try {
        const { exportId } = req.params;

        const exportStatus = await getExportStatus(exportId);

        if(exportStatus.status === "completed") {
            return {
                status: 200,
                message: "Export completed",
                type: "success",
                data: {
                    status: exportStatus.status,
                    url: exportStatus.url,
                },
            }
        }

        if(exportStatus.status === "failed") {
            return {
                status: 200,
                message: "Export failed",
                type: "error",
                data: {
                    status: exportStatus.status,
                },
            }
        }

        return {
            status: 200,
            message: "Export in progress",
            type: "success",
            data: {
                status: exportStatus.status,
            },
        }

    } catch (error) {
        return handleApiError(error);
    }
}