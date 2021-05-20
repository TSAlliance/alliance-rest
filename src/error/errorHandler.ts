import { Request, Response } from "express";
import { ApiError } from "./apiError";

export interface ErrorHandler {
    handleError(error: ApiError, request: Request, response: Response);
}
