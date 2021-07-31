import { ApiError } from "@tsalliance/sdk";
import { Request, Response } from "express";

export interface ErrorHandler {
    handleError(error: ApiError, request: Request, response: Response);
}
