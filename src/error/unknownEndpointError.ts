import { ApiError } from "./apiError";

export class UnknownEndpointError extends ApiError {
    constructor() {
        super("Unknown endpoint requested.", 400, "UNKNOWN_ENDPOINT_ERROR");
    }
}
