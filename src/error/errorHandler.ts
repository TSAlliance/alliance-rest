import { ApiError } from "alliance-sdk";
import { Request, Response } from "express";

export interface ErrorHandler {
    handleError(error: ApiError, request: Request, response: Response);
}
