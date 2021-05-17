import { ApiError } from "./apiError";

export class NotFoundError extends ApiError {
    constructor() {
        super("Not found.", 404, "NOT_FOUND");
    }
}
