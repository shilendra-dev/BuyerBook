import { ApiResponse } from "@/types/base.types";
import { z } from "zod";
import {
  BuyerNotFoundError,
  ConcurrencyError,
} from "@/resources/buyers/errors/buyerErrors";

export function handleApiError(error: unknown): ApiResponse {
  console.error(error);

  // Validation errors
  if (error instanceof z.ZodError) {
    return {
      status: 400,
      message: "Validation error",
      type: "error",
    };
  }

  // Concurrency errors
  if (error instanceof ConcurrencyError) {
    return {
      status: 409,
      message: error.message,
      type: "error",
    };
  }

  // Not found errors
  if (error instanceof BuyerNotFoundError) {
    return {
      status: 404,
      message: error.message,
      type: "error",
    };
  }

  // Default server error
  return {
    status: 500,
    message: "Internal server error",
    type: "error",
  };
}
