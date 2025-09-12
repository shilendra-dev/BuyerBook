import { Request, Response } from "express";
import {
  ControllerFunction,
  AuthenticatedRequest,
  ApiResponse,
} from "@/types/controllers/base.types.js";

export const getPublicData: ControllerFunction = async (
  req: Request,
  res: Response
): Promise<ApiResponse> => {
  return {
    status: 200,
    message: "Public data retrieved successfully",
    data: {
      timestamp: new Date().toISOString(),
      message: "This is public data",
    },
    type: "success",
  };
};

export const getPrivateData: ControllerFunction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<ApiResponse> => {
  return {
    status: 200,
    message: "Private data retrieved successfully",
    data: {
      user: req.user,
      timestamp: new Date().toISOString(),
      message: "This is private data",
    },
    type: "success",
  };
};

export const createData: ControllerFunction = async (
  req: Request,
  res: Response
): Promise<ApiResponse> => {
  const { name, description } = req.body;

  if (!name) {
    return {
      status: 400,
      message: "Name is required",
      type: "error",
    };
  }

  return {
    status: 201,
    message: "Data created successfully",
    data: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: description || "",
      createdAt: new Date().toISOString(),
    },
    type: "success",
  };
};
