import { ApiError } from "./apiError";

export class InternalError extends ApiError {
    constructor() {
        super("Internal server error", 500, "INTERNAL_ERROR");
    }
}
