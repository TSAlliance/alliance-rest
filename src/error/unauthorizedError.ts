import { ApiError } from "./apiError";

export class UnauthorizedError extends ApiError {
    constructor() {
        super("You need to authenticate", 403, "UNAUTHORIZED_ERROR");
    }
}
