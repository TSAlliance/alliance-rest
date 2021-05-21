import { ApiError } from "./apiError";

export class BadRequestError extends ApiError {
    constructor() {
        super("Bad request", 400, "BAD_REQUEST");
    }
}
