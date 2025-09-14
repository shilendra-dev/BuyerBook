import { AuthenticatedRequest } from "@/types/base.types";
import { ControllerFunction } from "@/types/base.types";
import { updateBuyerSchema } from "../validators/buyerValidator";
import { Response } from "express";
import { ApiResponse } from "@/types/base.types";
import { z } from "zod";
import { fetchBuyerById } from "../queries/fetchBuyerById";
import { getUser } from "../queries/getUserRole";
import {
  updateBuyer,
  ConcurrencyError,
  BuyerNotFoundError,
} from "../queries/updateBuyer";

export const updateBuyerAPI: ControllerFunction = async (
  req: AuthenticatedRequest,
  _res: Response
): Promise<ApiResponse> => {
  try {
    const validatedData = updateBuyerSchema.parse(req.body);
    const buyerId = req.params.id;

    // Extract expectedUpdatedAt from request body
    const { expectedUpdatedAt } = req.body;

    if (!req.user?.id) {
      return {
        status: 401,
        message: "Unauthorized",
        type: "error",
      };
    }
    const ownerId = req.user.id;

    //check if buyer exists
    const buyer = await fetchBuyerById(buyerId);
    if (buyer.length === null) {
      return {
        status: 404,
        message: "Buyer not found",
        type: "error",
      };
    }
    const buyerData = buyer[0];

    //get user role
    console.log(buyerData);
    const user = await getUser(req.user.id);
    console.log("user", user);

    //if current user is admin or owner
    const isOwner = buyerData.ownerId === ownerId;
    const isAdmin = user.role === "admin";

    //update buyer
    if (!isOwner && !isAdmin) {
      return {
        status: 401,
        message: "Unauthorized",
        type: "error",
      };
    }

    // Use the buyer's current updatedAt if expectedUpdatedAt is not provided
    const expectedTimestamp = expectedUpdatedAt
      ? new Date(expectedUpdatedAt)
      : buyerData.updatedAt;

    const updatedBuyer = await updateBuyer(
      buyerId,
      validatedData,
      expectedTimestamp,
      user.id
    );

    return {
      status: 200,
      message: "Buyer updated successfully",
      data: updatedBuyer,
      type: "success",
    };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        message: "Validation error",
        type: "error",
      };
    }
    if (error instanceof ConcurrencyError) {
      return {
        status: 409,
        message: error.message,
        type: "error",
      };
    }
    if (error instanceof BuyerNotFoundError) {
      return {
        status: 404,
        message: error.message,
        type: "error",
      };
    }
    return {
      status: 500,
      message: "Internal server error",
      type: "error",
    };
  }
};
