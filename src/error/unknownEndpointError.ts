import { ApiError } from "./apiError";

export class UnknownEndpointError extends ApiError {

    constructor() {
        super("Unknown endpoint requested.", 400);
    }

    protected getErrorCode(): string {
        return "UNKNOWN_ENDPOINT_ERROR"
    }

}