import { ApiError } from "alliance-sdk";

export class BadRequestError extends ApiError {
    constructor() {
        super("Bad request", 400, "BAD_REQUEST");
    }
}
