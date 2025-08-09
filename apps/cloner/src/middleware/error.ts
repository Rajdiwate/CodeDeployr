import { Request, Response } from "express";
import { AppError } from "../util/AppError";

// Error Middleware
export const errorMiddleware = (
  error: Error | AppError,
  req: Request,
  res: Response,
  // next: NextFunction,
) => {
  console.error("Error:", error);

  // Check if it's our custom AppError
  if (error instanceof AppError) {
    return res.status(500).json({
      success: error.success,
      message: error.message,
    });
  }

  // Handle Prisma unique constraint errors
  if (error.message.includes("Unique constraint")) {
    return res.status(400).json({
      success: false,
      message: "Entry Already Exists",
    });
  }

  // Handle other known errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message,
  });
};
