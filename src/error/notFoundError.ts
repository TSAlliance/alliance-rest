import { ApiError } from "alliance-sdk";

export class NotFoundError extends ApiError {
    constructor() {
        super("Not found.", 404, "NOT_FOUND");
    }
}
